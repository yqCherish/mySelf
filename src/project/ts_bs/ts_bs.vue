<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <loading v-model="isLoading" text="保存中"></loading>
    <div>
      <group title="选择事物类型">
         <checker style="padding:10px 15px;"
                  v-model="is_checked"
                  default-item-class="demo5-item"
                  selected-item-class="demo5-item-selected">
          <checker-item  v-for="item in worktypes" :key="item.val" :value="item.desc" @on-item-click="itemclick">{{item.desc}}</checker-item>
        </checker>
      </group>

      <!--<div class="weui-cells">-->
      <!--<div class="weui-cell">-->
      <!--&lt;!&ndash;<div class="weui_cell_hd"><label class="weui_label" style="line-height: 16px;">拍照<br><span style="font-size:12px; color:#a5a5a5;">( 最多五张<br>可删除 )</span></label></div>&ndash;&gt;-->
      <!--<div class="weui_cell_bd weui_cell_primary">-->
      <uploadfield
        fieldname="picurls"
        :fieldobj="picurls"
        :items="picurls"
        typefieldid="j_images"
        queryby="val"
        :clickzoominaction="clickzoominaction"
        :max="4">
      </uploadfield>
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--<group title="上传照片（最多可上传4张）">-->
      <!--<x-upload-->
      <!--fieldname="png"-->
      <!--:items="picurls"-->
      <!--typefieldid="j_images"-->
      <!--:max="4">-->
      <!--</x-upload>-->
      <!--</group>-->
      <group title="填写申请描述">
        <x-textarea :max="50" placeholder="请填写详细信息" v-model="affairdesc"></x-textarea>
      </group>
      <group v-if="page_type===1" title="期望服务时间">
        <datetime v-model="wishdate" :start-date="startDate" placeholder="请选择期望时间" format="YYYY-MM-DD HH:mm" @on-change="setBegin" title="期望时间" year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>
      </group>
      <div style="margin:20px 10px 10px"><x-button class="zj_button" type="primary" @click.native="submit_affair">提交</x-button></div>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{content}}</alert>
    <toast v-model="show_toast">{{toast_text}}</toast>
  </div>
</template>

<script>
//  import Loading from '@/components/loading/dataLoading';
//  import XUpload from '../../components/upload/upload.vue';
  import uploadfield from '../../components/uploadfield/uploadfield.vue';
  import {setTitle} from '@/common/js/common';
  import {XTextarea,XButton,Checker, CheckerItem,Group,Datetime,Loading,Alert,Toast} from 'vux';
  import {mapState } from 'vuex'

  export default{
    data(){
      return{
        isLoading:false,
        wishdate:"",
        owishdate:"",
        worktypes:"",
        affairdesc:"",
        select_work:"",
        is_checked:"室内",
        page_type:0,
        startDate:"",
        confirm_show:false,
        dialog_title:"",
        content:"",
        show_toast:false,
        toast_text:"保存成功"
      }
    },
    computed: {
      ...mapState({
        picurls: state => state.picurls,

      })
    },
    components:{
      Loading,XTextarea,XButton,Checker, CheckerItem,Group,Datetime,uploadfield,Alert,Toast
    },
    mounted(){
      let self = this;
      let oDate = new Date();
      /* 时间戳的延后15分钟如何处理 */
      this.startDate = oDate.getFullYear()+"-"+(oDate.getMonth()+1)+"-"+oDate.getDate()+" "+oDate.getHours()+":"+oDate.getMinutes();
      oDate.setMinutes(oDate.getMinutes()+15);
      this.wishdate = oDate.getFullYear()+"-"+(oDate.getMonth()+1)+"-"+oDate.getDate()+" "+oDate.getHours()+":"+oDate.getMinutes();
      this.page_type=parseInt(this.$route.params.type);
      this.page_type===1?setTitle("报事报修"):setTitle("投诉建议");
      let get_url=this.page_type===1?"/o2o/affair/wx/getlist":"/o2o/suggest/wx/getlist";
      if(service_url){
        this.$http.get(service_url+get_url).then((data)=>{
          self.worktypes=data.body.items;
          for(let i=0;i<self.worktypes.length;i++){
            if(self.worktypes[i].isselect){
              self.is_checked=self.worktypes[i].desc;
              self.select_work=self.worktypes[i].val;
            }
          }
        },() => {
//          alert("访问失败");
        });
      }else{
          self.worktypes=[{"val":"in","desc":"室内","isselect":true},{"val":"cs","desc":"公区","isselect":false},{"val":"orth","desc":"其它","isselect":false}];
          for(let i=0;i<self.worktypes.length;i++){
            if(self.worktypes[i].isselect){
              self.is_checked=self.worktypes[i].desc;
            }
          }
      }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      resetPic(){
        this.$store.dispatch("resetContext");
      },
      change (value) {
        console.log('change', value)
      },
      setBegin (value) {
        this.wishdate=value;
        let owishdate = this.getownTime(this.wishdate);
        if(owishdate <= Date.parse(new Date())){
          this.dialog_title="提示";
          this.content="开始时间应该大于当前时间";
          this.confirm_show=true;
          this.owishdate="";
        }else{
          this.owishdate=owishdate;
        }
      },
      clickzoominaction(){
      },
      itemclick(val){
        for(let i = 0;i<this.worktypes.length;i++){
          if(val===this.worktypes[i].desc){
            this.select_work=this.worktypes[i].val;
          }
        }
      },
      submit_affair(){
        if(this.page_type===1&&(this.wishdate===""||this.owishdate==="")){
          this.dialog_title="提示";
          this.content="请重新选择期望时间";
          this.confirm_show=true;
          return;
        }else{
            if(!this.select_work){
              this.dialog_title="提示";
              this.content="请选择事物类型";
              this.confirm_show=true;
                return;
            }
            if((this.page_type===1&&this.picurls.length===0)||(this.page_type===2&&this.picurls.length===0)){
              this.dialog_title="提示";
              this.content="请选择图片上传";
              this.confirm_show=true;
              return;
            }
          this.isLoading=true;
          let self = this;
          let suggest_data={
            "data":{
              "worktype":this.select_work,
              "picurls":this.picurls,
              "suggestdesc":this.affairdesc
            }
          };
          let affair_data = {
            "data":{
              "wishdata":this.owishdate,
              "worktype":this.select_work,
              "picurls":this.picurls,
              "affairdesc":this.affairdesc
            }
          };
          let send_data=this.page_type===1?affair_data:suggest_data;
          let post_url=this.page_type===1?"/o2o/affair/wx/insert?vid=":"/o2o/suggest/wx/insert?vid=";
          if(service_url){
            this.$http.post(service_url+post_url+userProfile.vid+"&openid="+userProfile.openid+"&houseid="+userProfile.houseid,send_data).then( (data)=> {
              self.isLoading=false;
              setTimeout(self.resetPic("picurls"),100);
              if(data.body.statusCode==="ok"){
//                self.$router.push({path:'/my_service'})
                self.show_toast=true;
                setTimeout(self.go_back,1000);
                setTimeout(self.resetPic,1000);
//                self.$router.go(-1);
              }else{
                this.dialog_title="提示";
                this.content="提交失败";
                this.confirm_show=true;
              }
//            self.loading=false;
            })
          }else{
            self.isLoading=false;
//            self.$router.push({path:'/my_service'})
//            self.$router.go(-1);
            self.show_toast=true;
            setTimeout(self.go_back,1000);
            setTimeout(self.resetPic,1000);
          }
        }
      },
      getownTime(time){
        var arr = time.split(/[- :]/);

        return (new Date(arr[0], arr[1]-1, arr[2],arr[3],arr[4])).getTime();
      },
      go_back(){
        this.$router.go(-1);
      }

    }
  }
</script>

<style scoped>
  .demo4-item {
    background-color: rgba(221, 221, 221, 0.38);
    color: #222;
    font-size: 13px;
    padding: 5px 10px;
    margin-right: 10px;
    line-height: 16px;
    border-radius: 15px;
  }

  .demo4-item-selected {
    background-color: #FF3B3B;
    color: #fff;
  }
  .demo5-item {
    border: 1px solid #ad7de7;
    border-radius: 15px;
    padding: 5px 10px;
    margin-right: 10px;
    font-size: 13px;
    line-height: 16px;
  }
  .demo5-item-selected {
    /*background: #ffffff url(../assets/demo/checker/active.png) no-repeat right bottom;*/
    color:white;
    background-color:#ad7de7;
  }
</style>

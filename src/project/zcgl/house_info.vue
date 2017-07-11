<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div>
      <tab :line-width=2 active-color="#ad7de7" v-model="index">
        <tab-item class="vux-center" :selected="click_tab === item" v-for="(item, index) in list2" @click="click_tab = item"
                  :key="index" @on-item-click="onItemClick">{{item}}
        </tab-item>
      </tab>
      <div v-if="index===0">
        <group gutter="0">
          <x-input class="font_14" labelWidth="6em" title='房屋地址' v-model="data1.position"></x-input>
          <x-input class="font_14" labelWidth="6em" title='面积' placeholder="请填写面积（平米）" v-model="acreage"></x-input>
          <x-input class="font_14" labelWidth="6em" title='户型'  placeholder="点击填写户型" v-model="house_type"></x-input>
          <div style="padding:10px 15px 10px 0;margin-left:15px;border-top:1px solid #ececec;" class="font_14">
            <label style="width:6em;display: inline-block;">价格区间</label>
            <input v-model="min_price" class="weui_input" type="text" placeholder="最低价"/>~
            <input v-model="max_price" style="margin-left:10px;" class="weui_input" type="text" placeholder="最高价"/>
            万元
          </div>
          <x-input class="font_14" labelWidth="6em" title='联系电话' v-model="data1.phone"></x-input>
          <!--<x-input class="font_14" labelWidth="6em" title='最高价(万元)'  placeholder="点击填写最高价" v-model="max_price"></x-input>-->
          <!--<x-input class="font_14" labelWidth="6em" title='最低价(万元)'  placeholder="点击填写最低价" v-model="min_price"></x-input>-->
          <!--<x-textarea class="font_14" :max="50" placeholder="备注" v-model="content"></x-textarea>-->
        </group>
        <group gutter="10px">
          <uploadfield
            fieldname="picurls"
            :fieldobj="picurls"
            :items="picurls"
            typefieldid="j_images"
            queryby="val"
            :max="4">
          </uploadfield>
        </group>
        <div style="padding:20px 10px">
          <x-button type="primary" class="zj_button" @click.native="submit1">提交</x-button>
        </div>
      </div>
      <div v-if="index===1">
        <group gutter="0">
          <x-input class="font_14" labelWidth="6em" title='房屋地址' v-model="data1.position"></x-input>
          <x-input class="font_14" labelWidth="6em" title='面积' placeholder="请填写面积（平米）" v-model="acreage"></x-input>
          <x-input class="font_14" labelWidth="6em" title='户型'  placeholder="点击填写户型" v-model="house_type"></x-input>
          <div style="padding:10px 15px 10px 0;margin-left:15px;border-top:1px solid #ececec;" class="font_14">
            <label style="width:6em;display: inline-block;">价格区间</label>
            <input v-model="min_price" class="weui_input" type="text" placeholder="最低价"/>~
            <input v-model="max_price" style="margin-left:10px;" class="weui_input" type="text" placeholder="最高价"/>
            万元
          </div>
          <x-input class="font_14" labelWidth="6em" title='联系电话' v-model="data1.phone"></x-input>
          <x-textarea class="font_14" :max="50" placeholder="问题描述" v-model="content"></x-textarea>
        </group>
        <group gutter="10px">
          <uploadfield
            fieldname="picurls"
            :fieldobj="picurls"
            :items="picurls"
            typefieldid="j_images"
            queryby="val"
            :max="4">
          </uploadfield>
        </group>
        <div style="padding:20px 10px">
          <x-button class="zj_button" type="primary" @click.native="submit2">提交</x-button>
        </div>
      </div>
      <div v-if="index===2">
          <div style="padding:0 15px;"><label class="font_14" style="display: inline-block;width:6em;">管理类型</label><checker  style="padding:10px 10px 10px 0;display:inline-block"
                         v-model="is_checked"
                         default-item-class="demo4-item"
                         selected-item-class="demo4-item-selected">
            <checker-item  v-for="item in worktypes" style="margin-bottom: 5px;" :key="item.val" :value="item.desc" @on-item-click="itemclick">{{item.desc}}</checker-item>
          </checker></div>
        <group gutter="0">
          <x-input class="font_14" labelWidth="6em" title='房屋地址' v-model="data1.position"></x-input>
          <x-input class="font_14" labelWidth="6em" title='面积' placeholder="请填写面积（平米）" v-model="acreage"></x-input>
          <x-input class="font_14" labelWidth="6em" title='联系电话' v-model="data1.phone"></x-input>

          <!--<x-textarea class="font_14" :max="50" placeholder="备注" v-model="content"></x-textarea>-->
        </group>
        <group gutter="10px">
          <uploadfield
            fieldname="picurls"
            :fieldobj="picurls"
            :items="picurls"
            typefieldid="j_images"
            queryby="val"
            :max="4">
          </uploadfield>
        </group>
        <div style="padding:20px 10px">
          <x-button class="zj_button" type="primary" @click.native="submit3">提交</x-button>
        </div>
      </div>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
    <loading v-model="isLoading" text="保存中"></loading>
    <toast v-model="show_toast">{{toast_text}}</toast>
  </div>
</template>

<script>
  import {setTitle} from '@/common/js/common';
  import {Tab,TabItem,Cell,Group,XButton,XInput,XTextarea,Checker,CheckerItem,Alert,Loading,Toast} from 'vux';
  import uploadfield from '../../components/uploadfield/uploadfield.vue';
  import {mapState } from 'vuex'

  const list = () => ['我要出租', '我要卖房','我要托管'];

  export default{
    data(){
      return{
        loading:true,
        index:0,
        list2: list(),
        click_tab:"我要出租",
        data1:[],
        acreage:"",
        house_type:"",
        max_price:"",
        min_price:"",
        content:"",
        is_checked:0,
        select_work:"",
        worktypes:[{"val":"0","desc":"保洁","isselect":true},{"val":"1","desc":"托管","isselect":false},{"val":"2","desc":"钥匙管理","isselect":false}],
        confirm_show:false,
        dialog_title:"提示",
        confirm_content:"",
        isLoading:false,
        toast_text:"",
        show_toast:false
      }
    },
    computed: {
      ...mapState({
        picurls: state => state.picurls,
      })
    },
    components:{
      Loading,Tab,TabItem,Cell,Group,XButton,XInput,uploadfield,XTextarea,Checker,CheckerItem,Alert,Toast
    },
    mounted(){
      setTitle("房屋管理");
      for(let i=0;i<this.worktypes.length;i++){
        if(this.worktypes[i].isselect){
          this.is_checked=i+1;
        }
      }
      this.getList();
    },
    methods:{
      resetPic(){
        this.$store.dispatch("resetContext");
      },
      go_back(){
        this.$router.go(-1);
      },
      onItemClick(index){
          this.index = index;
      },
      getList(){
          let self = this;
          if(service_url){
            this.$http.get(service_url+"/o2o/asset/wx/houseinfo?houseid="+userProfile.houseid).then((data)=>{
              self.data1=data.body.data;
            })
          }else{
            this.$http.get("/api/houseinfo").then((data)=>{
              self.data1=data.body.data.data;
            })
          }
        document.getElementById("index_loading").style.display="none";
      },
      validate(key){
        if(key===1){
          if(!this.acreage){
            this.confirm_content="请填写面积";
            this.confirm_show=true;
            return false;
          }
          if(!this.house_type){
            this.confirm_content="请填写户型";
            this.confirm_show=true;
            return false;
          }
          if(!this.min_price){
            this.confirm_content="请填写最低价";
            this.confirm_show=true;
            return false;
          }
          if(!this.max_price){
            this.confirm_content="请填写最高价";
            this.confirm_show=true;
            return false;
          }
          if(!this.picurls.length){
            this.confirm_content="请选择图片上传";
            this.confirm_show=true;
            return false;
          }
          return true;
        }else{
          if(!this.acreage){
            this.confirm_content="请填写面积";
            this.confirm_show=true;
            return false;
          }
          if(!this.picurls.length){
            this.confirm_content="请选择图片上传";
            this.confirm_show=true;
            return false;
          }
          if(!this.select_work){
            this.confirm_content="请选择管理类型";
            this.confirm_show=true;
            return false;
          }
          return true;
        }
      },
      submit1(){
        if(!this.validate(1)){
            return;
        }
        this.isLoading=true;
        let self = this;
        const items={
          "data":{
            "address":this.data1.position,
            "phone":this.data1.phone,
            "area":this.acreage, //面积
            "housetype":this.house_type,  // 户型
            "pricelow":this.min_price,//价位  低
            "pricehigh":this.max_price,//价位  高
            "remark":this.content,//备注
            "picurls":this.picurls
          }
        };
        if(service_url){
          this.$http.post(service_url+"/o2o/asset/wx/rent?houseid="+userProfile.houseid,items).then((data)=>{
            this.isLoading=false;
            if(data.body.statusCode==="ok"){
              this.show_toast=true;
              this.toast_text=data.body.message;
              setTimeout(self.go_back,1000);
              setTimeout(self.resetPic,1000);
            }else{
              this.confirm_content=data.body.message;
              this.confirm_show=true;
            }
          })
        }else{
          this.isLoading=false;
          this.show_toast=true;
          this.toast_text="保存成功";
          setTimeout(self.go_back,1000);
          setTimeout(self.resetPic,1000);
        }
      },
      submit2(){
        if(!this.validate(1)){
          return;
        }
        this.isLoading=false;
        const items={
          "data":{
            "address":this.data1.position,
            "phone":this.data1.phone,
            "area":this.acreage, //面积
            "housetype":this.house_type,  // 户型
            "pricelow":this.min_price,//价位  低
            "pricehigh":this.max_price,//价位  高
            "remark":this.content,//备注
            "picurls":this.picurls
          }
        };
        this.$http.post(service_url+"/o2o/asset/wx/sail?houseid="+userProfile.houseid,items).then((data)=>{
          this.isLoading=true;
          if(data.body.statusCode==="ok"){
            this.show_toast=true;
            this.toast_text=data.body.message;
            setTimeout(this.go_back,1000);
            setTimeout(this.resetPic,1000);
          }else{
            this.confirm_content=data.body.message;
            this.confirm_show=true;
          }
        })
      },
      submit3(){
        if(!this.validate(2)){
          return;
        }
        const items={
          "data":{
            "address":this.data1.position,
            "phone":this.data1.phone,
            "type":this.select_work, //类型
            "area":this.acreage, //面积
            "remark":this.content,//备注
            "picurls":this.picurls
          }
        };
        this.$http.post(service_url+"/o2o/asset/wx/trust?houseid="+userProfile.houseid,items).then((data)=>{
          if(data.body.statusCode==="ok"){
            this.show_toast=true;
            this.toast_text=data.body.message;
            setTimeout(this.go_back,1000);
            setTimeout(this.resetPic,1000);
          }else{
            this.confirm_content=data.body.message;
            this.confirm_show=true;
            setTimeout(this.resetPic,500);
          }
        })
      },
      itemclick(val){
        for(let i = 0;i<this.worktypes.length;i++){
          if(val===this.worktypes[i].desc){
            this.select_work=this.worktypes[i].val;
          }
        }
      },
    }
  }
</script>

<style scoped>
  .demo4-item {
    border: 1px solid #ad7de7;
    border-radius: 15px;
    padding: 5px 10px;
    margin-right: 10px;
    font-size: 13px;
    line-height: 16px;
  }
  .demo4-item-selected {
    /*background: #ffffff url(../assets/demo/checker/active.png) no-repeat right bottom;*/
    color:white;
    background-color:#ad7de7;
  }
  .font_14{
    font-size:14px;
  }
  .weui_input{
    width: 60px;
    border: 0;
    outline: 0;
    -webkit-appearance: none;
    background-color: transparent;
    font-size: inherit;
    color: inherit;
    height: 1.41176471em;
    line-height: 1.41176471;
  }
</style>

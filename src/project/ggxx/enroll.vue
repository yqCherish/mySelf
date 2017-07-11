<template>
  <div>
    <!--<loading style="text-align: center;" v-if="loading"></loading>-->
    <loading v-model="isLoading" text="保存中"></loading>
    <div>
      <group>
        <x-input title="姓名" placeholder="请输入您的姓名" v-model="name"></x-input>
        <x-input title="手机" placeholder="请输入您的手机号" type="tel" keyboard="number" v-model="phone"></x-input>
        <x-number align="left" title="<p style='width:3em'>成人</p>" v-model="adult" button-style="round" :min="0"></x-number>
        <x-number title="<p style='width:3em'>儿童</p>" align="left" v-model="children" button-style="round" :min="0"></x-number>
        <x-textarea title="备注" placeholder="请输入备注" :show-counter="false" :rows="3" v-model="remark" autosize></x-textarea>
      </group>
      <div style="margin:30px 10px 10px"><x-button style="background-color:#ad7de7;border-color:#ad7de7;color:white;" @click.native="do_submit">{{button_name}}</x-button></div>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
    <toast v-model="show_toast">{{toast_text}}</toast>
  </div>
</template>

<script>
  import { Group, XInput, XButton ,XTextarea,Divider,XNumber,Alert,Loading,Toast} from 'vux'
  import {setTitle} from '@/common/js/common';

  export default{
      data(){
          return{
            title:"这是游泳比赛哟",
            name:'',
            num:'',
            noticeid:'',
            maxnum:[],
            fenid:[],
            button_name:"",
            phone:'',
            adult:0,
            children:0,
            remark:'',
            confirm_show:false,
            dialog_title:"提示",
            confirm_content:"",
            type:0,
            isLoading:false,
            show_toast:false,
            toast_text:"保存成功"
          }
      },
    components:{
      Group, XInput, XButton,XTextarea,Divider,XNumber,Alert,Loading,Toast
    },
    mounted(){

      document.getElementById("index_loading").style.display="none";
      this.noticeid=this.$route.query.noticeid;
      this.type=parseInt(this.$route.query.type);
      if(this.type===1){
          this.button_name="保存";
        setTitle("活动编辑");
          if(service_url){
            this.$http.get(service_url+"/o2o-notice-webAndroid/wx/entryDetail?nid="+this.noticeid).then((data)=>{
              this.adult=data.body.data.adultcount;
              this.children=data.body.data.childcount;
              this.name=data.body.data.nname;
              this.phone=data.body.data.nphone;
              this.remark=data.body.data.remark;
            })
          }else{
            this.$http.get("/api/enroll").then((data)=>{
              this.adult=data.body.data.adultcount;
              this.children=data.body.data.childcount;
              this.name=data.body.data.nname;
              this.phone=data.body.data.nphone;
              this.remark=data.body.data.remark;
            })
          }
      }else{
        this.button_name="报名";
        setTitle("活动报名");
      }
    },
    methods:{
      do_submit(){
        let self =this;
        let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(!this.name){
          this.confirm_content="请输入您的姓名";
          this.confirm_show=true;
          return;
        }
        if(!this.phone||this.phone.length!==11||!myreg.test(this.phone)){
          this.confirm_content="请正确输入您的手机号";
          this.confirm_show=true;
          return;
        }
        if(!this.adult&&!this.children){
          this.confirm_content="请选择参加人数";
          this.confirm_show=true;
          return;
        }
        this.isLoading=true;
        const senddata={
          "data":{
            "fenid":this.noticeid, //这个id是标识活动的   页面没有显示，后台可能需要
            "name":this.name,//姓名
            "phone":this.phone,//手机号
            "adult":this.adult,//成人人数
            "children":this.children,//小孩人数
            "remark":this.remark,//备注
          }
        };
        let url = service_url+"/o2o/notice/wx/action/entry?vid="+userProfile.vid+"&id="+this.noticeid;
        if(service_url){
          this.$http.post(url,senddata).then((data) => {
            this.isLoading=false;
            if(data.body.statusCode === "ok"){
              self.show_toast=true;
              setTimeout(this.go_back,1000);
            }else if(data.body.statusCode === "error"){
              this.confirm_content=data.body.message;
              this.confirm_show=true;
            }
          });
        }else{
          this.isLoading=false;
          self.show_toast=true;
          setTimeout(this.go_back,1000);
        }

      },
      go_back(){
        this.$router.go(-1);
      }
    }
  }
</script>

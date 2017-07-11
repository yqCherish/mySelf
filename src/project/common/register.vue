<template>
  <div>
    <loading v-model="isLoading" text="保存中"></loading>
    <div>
      <group gutter="0">
        <x-input title="姓名" placeholder="请输入姓名" v-model="user_name" :show-clear="false"></x-input>
        <x-input title="手机号" type="tel" class="weui-vcode" placeholder="请输入手机号" v-model="user_tel" :show-clear="false">
          <x-button class="zj_button" v-if="issend" slot="right" type="primary" @click.native="getCode" mini>{{validata}}</x-button>
          <x-button class="zj_button" v-else slot="right" type="primary" @click.native="getCode" mini disabled>{{validata}}</x-button>
        </x-input>
        <x-input title="验证码" placeholder="请输入验证码" v-model="user_code"  :show-clear="false">
          <div slot="right">{{count}}</div>
        </x-input>
        <!--<x-input title="身份证号" placeholder="请输入身份证号" v-model="id_code" :show-clear="false"></x-input>-->
        <popup-picker title="身份" :data="typelist" v-model="idtype" @on-change="onChange_u" placeholder="请选择身份"></popup-picker>
        <popup-picker title="小区" :data="outer_list" v-model="e_type" @on-change="onChange_e" placeholder="请选择小区"></popup-picker>
        <popup-picker title="房产" :data="list" v-model="housedesc" @on-change="onChange_h" placeholder="请选择房产"></popup-picker>
      </group>
      <div style="padding:20px 10px;"><x-button type="primary" class="zj_button"  @click.native="register">注册</x-button></div>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{content}}</alert>
  </div>
</template>

<script>
  import {setTitle} from '@/common/js/common';
  import {XInput,XButton,Group,PopupPicker,Loading,Alert} from 'vux';

  export default{
    data(){
      return{
        user_name:"",
        user_tel:"",
        user_code:"",
        count:"",
        token:[],
        issend:true,
        nums:"",
        clock:"",
        idtype:[],
        housedesc:[],
        typelist:[["业主","家人","租户"]],
        list:[],
        validata:"发送验证码",
        estate:[],
        e_type:[],
        outer_list:[],
        this_vid:"",
        isLoading:false,
        dialog_title:"",
        content:"",
        confirm_show:false
//        id_code:""
      }
    },
    components:{
      Loading,XInput,XButton,Group,PopupPicker,Alert
    },
    mounted(){
        setTitle("注册");
        let self = this;
        if(service_url){
          this.$http.get(service_url+"/o2o/common/wx/getVillage").then((data)=>{
            self.estate=data.body.data;
            let name_list=[];
            let outer_list=[];
            for(let i =0;i<self.estate.length;i++){
              name_list.push(self.estate[i].name);
            }
            outer_list.push(name_list);
            this.outer_list=outer_list;
          });
        }else{
          this.$http.get("/api/getVillage").then((data)=>{
              self.estate = data.body.data.data;
              let name_list=[];
              let outer_list=[];
              for(let i =0;i<self.estate.length;i++){
                name_list.push(self.estate[i].name);
              }
              outer_list.push(name_list);
            this.outer_list=outer_list;
          })
        }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      onChange_e(type){
        let this_id;
        this.e_type=type;
        for(let i =0;i<this.estate.length;i++){
            if(type[0]===this.estate[i].name){
              this_id=this.estate[i].id
            }
        }
        this.this_vid=this_id;
        let self = this;
        this.$http.get(service_url+"/o2o/common/wx/houselist?vid="+this_id).then((data)=>{
          self.list=data.body.data;
        });
        if(service_url){
          this.$http.get(service_url+"/o2o/common/wx/houselist?vid="+this_id).then((data)=>{
            self.list=data.body.data;
          });
        }else{
          console.log(1);
        }
      },
      onChange_u(type){
        this.idtype=type;
      },
      onChange_h(type){
        this.housedesc=type;
      },
      doLoop()
      {
        this.nums--;
        if(this.nums >= 0){
          this.count=this.nums+'秒';
        }else{
          clearInterval(this.clock); //清除js定时器
          this.issend=true;
          this.count="";
          this.validata="再次发送";
          this.nums = 60; //重置时间
        }
      },
      register(){

        /*if(JSON.stringify(this.token)===JSON.stringify(this.user_code)){
            const items ={
            data: {
              name:this.user_name,
                phone:this.user_tel,
//                idcode:this.id_code, //身份证
                idtype:this.idtype, //业主, 家人,租客,
                housedesc:this.housedesc //housedesc
            }
          };
            let self = this;
            this.$http.post(service_url+"/o2o/common/wx/reg/request",items).then((data)=>{
              if(data.body.statusCode==="ok"){
                self.$router.push({
                  path:'index'
                })
              }else{
                  alert(data.body.message);
              }
            })
        }*/
        let self = this;
        if(!this.user_name||this.user_name===""){
          this.dialog_title="提示";
          this.content="请输入姓名";
          this.confirm_show=true;
          return;
        }
        if(!this.user_tel||this.user_tel===""){
          this.dialog_title="提示";
          this.content="请输入手机号";
          this.confirm_show=true;
          return;
        }
        if(JSON.stringify(this.token)===JSON.stringify(this.user_code)){
          if(this.idtype.length===0){
            this.dialog_title="提示";
            this.content="请选择身份";
            this.confirm_show=true;
            return;
          }
          if(this.e_type.length===0){
            this.dialog_title="提示";
            this.content="请选择小区";
            this.confirm_show=true;
            return;
          }
          if(this.housedesc.length===0){
            this.dialog_title="提示";
            this.content="请选择房产";
            this.confirm_show=true;
            return;
          }
          this.isLoading=true;
          const items ={
            data: {
              name:this.user_name,
              phone:this.user_tel,
//                idcode:this.id_code, //身份证
              idtype:this.idtype, //业主, 家人,租客,
              housedesc:this.housedesc, //housedesc
              vid:this.this_vid
            }
          };
          this.$http.post(service_url+"/o2o/common/wx/reg/request",items).then((data)=>{
            this.isLoading=false;
            if(data.body.statusCode==="ok"){
              this.dialog_title="恭喜";
              this.content="注册成功！";
              this.confirm_show=true;
              userProfile=data.body.userProfile;
              self.$router.push({
                path:'index'
              })
            }else{
              this.dialog_title="提示";
              this.content=data.body.message;
              this.confirm_show=true;
            }
          })
        }else{
          this.dialog_title="提示";
          this.content="请正确输入验证码";
          this.confirm_show=true;
        }


      },
      getCode(){
          let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
          if(this.user_tel&&this.user_tel!==""&&this.user_tel.length===11&&myreg.test(this.user_tel)){
            let self = this;
             this.nums =60;
             this.issend=false;
             this.$http.get(service_url+"/o2o/common/wx/gettoken?phone="+this.user_tel).then((data)=>{
             self.token=data.body.token;
             });
             this.count=this.nums+'秒';
             this.clock = setInterval(this.doLoop, 1000);
          }else{
              this.dialog_title="提示";
              this.content="请正确输入手机号";
              this.confirm_show=true;
          }

      }
    }
  }
</script>

<style scoped>

</style>

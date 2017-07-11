<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div>
      <group gutter="0">
        <div style="padding:20px 0;text-align: center;font-size:20px;color:#ad7de7">
          {{this_title}}
        </div>
        <x-input v-if="mark===2" labelWidth="6em" type="password" :is-type="check_func" @change.native="validate" title="原密码" placeholder="点击填写原密码" v-model="old_code" :show-clear="false"></x-input>
        <x-input labelWidth="6em" type="password" :is-type="check_func" title="新密码" placeholder="点击填写新密码" v-model="new_code_first" :show-clear="false"></x-input>
        <x-input type="password" :is-type="check_func" title="确认新密码" placeholder="点击填写新密码" v-model="new_code_second" :show-clear="false"></x-input>
        <div style="padding:10px 15px;border-top:1px solid #ececec;font-size:12px;color:#999">
          <p>
            注：如忘记密码，请联系物业客服或凭身份证到物业前台重置。
          </p>
          <p>
            密码格式由6位数字组成
          </p>
        </div>
      </group>
      <div style="padding:20px 10px;">
        <x-button class="zj_button" type="primary" @click.native="submit_save">提交保存</x-button>
      </div>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{content}}</alert>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {Group,XInput,XButton,Alert} from 'vux';

  export default{
    data(){
      return{
        loading:true,
        old_code:"",
        new_code_first:"",
        new_code_second:"",
        check_code:"",
        mark:0,
        dialog_title:"",
        content:"",
        this_title:"",
        confirm_show:false,
        check_func:function (value) {
            /*if(value.length<6||value.length>10){
              return {
                valid: false
              }
            }else{
              let reg1 = new RegExp(/^[0-9A-Za-z]+$/);
              if (!reg1.test(value)) {
                return {
                  valid: false
                }
              }
              let reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
              if(!reg.test(value)) {
                return {
                  valid: false
                }
              }
              return {
                valid: true
              }
            }*/
          let reg = /^\d{6}$/;
          if(!reg.test(value.trim())){
              return{
                  valid:false
              }
          }else{
              return{
                  valid:true
              }
          }
        }
      }
    },
    components:{
      loading,Group,XInput,XButton,Alert
    },
    mounted(){
      this.mark = parseInt(this.$route.query.mark);
      this.mark===1?setTitle("设置密码"):setTitle("修改密码");
      this.mark===1?this.this_title="设置密码":this.this_title="修改密码";
      document.getElementById("index_loading").style.display="none";
      if(service_url){
          if(this.mark===2){
            this.$http.get(service_url+"/o2o/assetsv2/wx/wallet_code.do").then((data)=>{
              if(data.body.status===0){
                this.check_code=parseInt(data.body.data.password);
              }
            })
          }

      }else{
        this.$http.get("/api/wallet_code").then((data)=>{
          this.check_code=data.body.data.data.password;
        })
      }
    },
    methods:{
      validate(){
        if(!this.old_code||this.old_code!==this.check_code){
          this.dialog_title="提示";
          this.content="请正确输入原密码！";
          this.confirm_show=true;
        }
      },
      confirm(){
        if(!this.old_code||this.old_code!==this.check_code){
          this.dialog_title="提示";
          this.content="请正确输入原密码！";
          this.confirm_show=true;
          return false;
        }
        return true;
      },
      submit_save(){
          if(this.mark===2){
            if(!this.confirm()){
              return;
            }
          }
        if(!this.new_code_first||!this.new_code_second){
          this.dialog_title="提示";
          this.content="请输入新密码！";
          this.confirm_show=true;
          return;
        }
        if(this.new_code_first!==this.new_code_second){
          this.dialog_title="提示";
          this.content="请确认两次密码的一致性！";
          this.confirm_show=true;
          return;
        }
        const item = {
          new_code:this.new_code_first
        };
        this.$http.post(service_url+"/o2o/assetsv2/wx/updatepassword.do",item).then((data)=>{
          if(data.body.status===0){
            this.dialog_title="恭喜";
            this.content="修改成功！";
            this.confirm_show=true;
            this.$router.go(-1);
          }else{
            this.dialog_title="提示";
            this.content=data.body.error_reason;
            this.confirm_show=true;
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>

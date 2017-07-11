<template>
  <div>
    <loading v-model="isLoading" text="生成中"></loading>
    <div>
      <group title="访客邀请">
      <x-input title="姓名" placeholder="请输入姓名" v-model="name"></x-input>
        <div style="display:flex;align-items: center;padding:5px 10px 5px 0;margin-left:15px;border-top:1px solid #ececec;">
          <div>性别：</div>
          <checker
            default-item-class="demo5-item"
            selected-item-class="demo5-item-selected"
          >
            <checker-item style="font-size:14px;" v-for="item in sexlist" :key="item" :value="item" @on-item-click="itemclick">{{item}}</checker-item>
          </checker>
        </div>
      <x-input title="手机号" placeholder="请输入受邀人手机号" v-model="phone"></x-input>
      </group>
      <div style="padding:20px 10px;"><x-button class="zj_button" type="primary" @click.native="gocode">生成二维码</x-button></div>
    </div>
    <alert v-model="alert_show" :title="dialog_title" @on-show="onShow" @on-hide="onHide"> {{content}}</alert>
  </div>
</template>

<script>
  import {setTitle} from '@/common/js/common';
  import {Group,XInput,Checker,CheckerItem,XButton,Alert,Loading} from 'vux';

  export default{
    data(){
      return{
        isLoading:false,
        sex:[],
        sexlist:["男","女"],
        content:"",
        name:"",
        phone:"",
        choose_item:"男",
        alert_show:false,
        dialog_title:"",
      }
    },
    components:{
      Loading,Group,XInput,Checker,CheckerItem,XButton,Alert
    },
    mounted(){
      setTitle("访客邀请");
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      itemclick(val){
        this.choose_item=val;
      },
      gocode(){
          this.isLoading=true;
          let self = this;
          let items={
            "data": {
              "name":this.name, //姓名
              "sex":this.choose_item , //0男 1女
              "phone":this.phone, //新手机
            }
          };
          if(service_url){
            this.$http.post(service_url+"/o2o/door/wx/door/invite",items).then((data)=>{
                self.isLoading=false;
              if(data.body.statusCode=="ok"){
                self.$router.replace({path:"code_share",query:{"id":data.body.id}});
              }else{
                self.alert_show=true;
                self.content="访问失败";
                self.dialog_title="注意";
              }
            })
          }else{
            self.isLoading=false;
            self.$router.replace({path:"code_share",query:{"id":1}});
          }

      },
      onShow(){},
      onHide(){}
    }
  }
</script>

<style scoped>
  .demo5-item {
    border: 1px solid #ad7de7;
    border-radius:5px;
    padding: 2px 15px;
    margin:5px;
  }
  .demo5-item-selected {
    /*background: #ffffff url(../assets/demo/checker/active.png) no-repeat right bottom;*/
    color:white;
    background-color:#ad7de7;
  }
</style>

<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <loading v-model="isLoading" text="加载中"></loading>
    <div>
      <group gutter="0">
        <div class="containers ">
          <!--外框-->
          <div class="fk_outer_div">
            <!--二维码-->
            <div class="inner_div_1">
              <img v-if="pic.length==0" style="width:100%;height:100%" src= "../../common/img/erweima.png"/>
              <img v-if="pic.length!=0" style="width:100%;height:100%" :src="pic"/>
            </div>
            <!--文字-->
            <div class="inner_div_2" >
              <h2 class="text_center" style="font-size: 14px;color: #10aeff;">
                开门二维码动态更新,请当面使用勿泄露
              </h2>
            </div>
          </div>
        </div>
      </group>
    </div>
    <alert v-model="confirm_show" :title="dialog_title" @on-show="onShow" @on-hide="onHide"> {{content}}</alert>
  </div>
</template>

<script>
//  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {Alert,Group,Loading} from 'vux';

  export default{
    data(){
      return{
        isLoading:true,
        pic:[],
        confirm_show:false,
        dialog_title:"",
        content:"",
        replay:""
      }
    },
    components:{
      Loading,Alert,Group
    },
    mounted(){
      setTitle("我的二维码");
      let self = this;
      self.getdata();
      this.replay=window.setInterval(function(){
        self.getdata();
      },30000)
    },
    destroyed(){
      clearInterval(this.replay);
    },
    methods:{
      getdata(){
          if(service_url){
            this.$http.get(service_url+'/o2o/door/wx/door/open/qrcode').then((data)=>{
              this.isLoading=false;
              if(data.body.statusCode==="ok"){
                  if(data.body.status==="OK"){
                    this.pic=data.body.data.pic;
                  }else{
                    this.dialog_title="提示";
                    this.content="请确定您当前有可用的门禁权限!";
                    this.confirm_show=true;

                  }
              }else{
                this.dialog_title="提示";
                this.content=data.body.message;
                this.confirm_show=true;
              }
            })
          }else{
            this.$http.get("/api/my_code").then((data)=>{
              this.isLoading=false;
              this.pic=data.body.data.data.pic;
            })
          }
        document.getElementById("index_loading").style.display="none";
      },
      onShow(){

      },
      onHide(){
        this.$router.push({path:"index"});
      }
    }
  }
</script>

<style scoped>
  @import '../../common/css/menjin.css';
</style>

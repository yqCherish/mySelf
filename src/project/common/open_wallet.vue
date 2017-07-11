<template>
  <div>
    <div :style="outer_style">
      <div :style="inner_style"><img style="height:100%;width:100%" src = "../../common/img/闪电.png"/></div>
    </div>
    <div style="text-align: center;font-size:28px;color:#999;font-weight:600;">闪电开通</div>
    <div style="padding:10px 15px;color:#999">
      <p>钱包充值暂不能使用在增值服务上(类似品质生活、专业保洁等服务)</p>
      <p>同一套房产使用一个密码</p>
      <p>咨询可联系客服<span style="margin-left:20px;">400-920-2011</span></p>
      <x-button style="margin-top:20px;margin-bottom:10px;" class="zj_button" type="primary" @click.native="confirm">确认</x-button>
      <p>点击“确认”即表示您同意<a style="color:#ad7de7;">《钱包使用协议》</a></p>
    </div>
  </div>
</template>

<script>
  import {XButton} from 'vux';
  export default{
      data(){
          return{

          }
      },
    components:{
      XButton
    },
    computed:{
       inner_style(){
           return{
              "height":150*document.body.clientWidth/360+"px",
              "width":200*document.body.clientWidth/360+"px",
              "position":"absolute",
              "top":30*document.body.clientWidth/360+"px",
              "bottom":10*document.body.clientWidth/360+"px",
              "left":65*document.body.clientWidth/360+"px",
              "right":95*document.body.clientWidth/360+"px",
           }
       },
        outer_style(){
            return{
                "position":"relative",
                "height":190*document.body.clientWidth/360+"px",
                "width":360*document.body.clientWidth/360+"px",
            }
        }
    },
    mounted(){
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      confirm(){
          this.$router.push({path:"wallet_code"});
      }
    }
  }
</script>

<style scoped>

</style>

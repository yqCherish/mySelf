<template>
  <div>
    <loading v-if="loading" style="text-align: center"></loading>
    <div v-else>
      <group title="预约信息">
        <cell-form-preview v-for="item in list" :key="item" :list="item"></cell-form-preview>
      </group>
      <group v-if="route_type===1" title="选择您的会员卡">
        <Cardchoose v-if="list_len!=0" :slideNub="list_len" :project_list="card_list"></Cardchoose>
      </group>
      <div v-if="route_type===1" style="padding:0 10px;">
        <x-button style="background-color:#ad7de7" type="primary" @click.native="goNext">预约</x-button>
      </div>
      <div style="padding:20px 10px;">
        <x-button type="primary" @click.native="goCode">扫码</x-button>
        <x-button type="default" @click.native="cancelReserve">取消预约</x-button>
        <div style="padding:0 15px 15px 40px;font-size:12px;color:#ad7de7;">取消预订至少提前两小时，否则照常收取或取消预订资格</div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {wx} from '@/common/js/jweixin-1.0.0';
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import Cardchoose from '@/components/card_switch/card_choose.vue';
  import {Group,Cell,CellFormPreview,XButton} from 'vux';

  export default{
    data(){
      return{
        loading:true,
        this_checked:false,
        list: [],
        route_type:0,
        card_list:[],
        list_len:0,
        current_card_id:0,
        choose_time_key:[],
        area_key:"",
        choose_date:"",
        order_id:""
      }
    },
    components:{
      loading,Group,Cell,CellFormPreview,Cardchoose,XButton
    },
    mounted(){
      this.route_type = parseInt(this.$route.query.route_type);
      if(this.route_type===1){
        setTitle("预约");
        this.list=this.$route.query.list;
        this.choose_time_key=this.$route.query.choose_time_key;
        this.choose_date=this.$route.query.choose_date;
        this.area_key=this.$route.query.area_key;
        this.getCardList();
      }else{
        setTitle("预订详细");
        this.order_id = parseInt(this.$route.query.type);
        console.log(this.order_id);
        this.getOrderList();
      }
    },
    methods:{
      click_check(){
        this.this_checked=!this.this_checked;
      },
      goNext(){
        this.current_card_id=$(".img3").attr("id");
        const items={
          card_id:this.current_card_id,
          area_id:this.area_key,
          cost_date:this.choose_date,
          cost_time:this.choose_time_key,
        };
        this.$http.post(service_url+"/o2o/club/wx/preSave",items).then((data)=>{
          if(data.body.status===0){
            this.$router.push({path:'reserve_success',query:{route_type:1}});
          }else{
            alert(data.body.error_reason);
          }
        })
//        this.$router.push({path:'reserve_success',query:{route_type:1}});
      },
      cancelReserve(){
        let self = this;
        if(service_url){
          const item = {
            order_id:this.order_id
          };
          this.$http.post(service_url+"/o2o/club/wx/preCancel",item).then((data)=>{

          })
        }else{

        }
      },
      goCode(){
        let self = this;
        let qrCode = "tj_receive_site_whfmc_"+this.area_key;
        wx.config({
          debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//                        debug : true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId : userProfile.wx.appid, // 必填，公众号的唯一标识
          timestamp : userProfile.wx.timestamp, // 必填，生成签名的时间戳
          nonceStr : userProfile.wx.nonceStr, // 必填，生成签名的随机串
          signature : userProfile.wx.signature ,// 必填，签名，见附录1
          jsApiList : ['checkJsApi', 'startRecord', 'stopRecord','translateVoice','scanQRCode', 'openCard']
          // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
          wx.scanQRCode({
            needResult: 1,
            scanType: ["qrCode"],
            success: function (res) {
//                    alert(JSON.stringify(res));
              var resultStr = res.resultStr;
              var errMsg = res.errMsg;
              if(errMsg === "scanQRCode:ok"){
                if(resultStr === qrCode){
                  self.$router.push({path:'reserve_success',query:{route_type:5}})
                }else{
                  alert("二维码不匹配")
                }
              }else{
                alert("访问失败")
              }
            }
          });
        })
      },
      getCardList(){
        let self = this;
        if(service_url){
          this.$http.get(service_url+"/o2o/club/wx/myCardList").then((data)=>{
            self.card_list=data.body.data;
            self.list_len=data.body.data.length;
            this.loading = false;
          })
        }
      },
      getOrderList(){
        let self = this;
        const item ={
          "order_id":this.order_id
        };
        this.$http.post(service_url+"/o2o/club/wx/preDetail",item).then((data)=>{
          self.list=[
            [{
              label:"预约项目",
              value:data.body.data.project_name
            },{
              label:"预约场地",
              value:data.body.data.area_name
            },
              {
                label:"预订时间",
                value:data.body.data.area_time
              },
              {
                label:"预计费用",
                value:data.body.data.price
              },
              {
                label:"会所名称",
                value:data.body.data.clubname
              }]
          ];
          this.loading = false;
        })
      }
    }
  }
</script>

<style scoped>
  .weui_flex{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    outline: 0;
    -webkit-align-items: center;
    align-items: center;
  }
  .weui-check{
    position: absolute;
    left: -9999em;
  }
  [class^="weui-icon-"], [class*=" weui-icon-"] {
    display: inline-block;
    vertical-align: middle;
    font: normal normal normal 14px/1 "weui";
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
  }
  .weui-check:checked + .weui-icon-checked:before {
    content: '\EA06';
    color: #ad7de7;
  }
  .weui-icon-checked:before {
    content: '\EA01';
    color: #C9C9C9;
    font-size: 23px;
    display: block;
  }
  .weui-cell__hd{
    margin-left:-5px;
  }
  .weui_margin{
    padding-top:10px;
    margin-left:15px;
    border-top:1px solid #D9D9D9;
  }
</style>

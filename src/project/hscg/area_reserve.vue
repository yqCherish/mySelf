<template>
  <div>
    <loading v-model="isLoading" :text="alert_text"></loading>
    <div>
      <group title="预约信息">
        <!--<cell-form-preview v-for="item in list" :key="item" :list="item"></cell-form-preview>-->
        <cell title="预约场地" :value="area_value"></cell>
        <cell title="预约日期" :value="area_time"></cell>
        <cell title="预约时间" :value="first_time"></cell>
        <div v-for="item in time_arr" style="padding:10px 15px;"><div style="text-align: right;color:#999;">{{item}}</div></div>
        <cell title="预计费用" :value="this_sum+'元'"></cell>
        <cell title="入场时间" v-if="enter_time!==''" :value="enter_time"></cell>
        <cell title="离场时间" v-if="over_time!==''" :value="over_time"></cell>
      </group>
      <group v-if="route_type===1||route_state===1" title="选择您的会员卡">
        <Cardchoose v-if="list_len!=0" :slideNub="list_len" :project_list="card_list"></Cardchoose>
      </group>
      <group v-if="route_state===2" title="订单评价">
        <cell title="评分">
          <rater v-model="eva_score" star="✩" active-color="#FF9900" :margin="4"></rater>
        </cell>
        <x-textarea :max="100" v-model="eva_content" placeholder="请输入详细内容"></x-textarea>
      </group>
      <group v-if="route_state===3" title="订单评价">
        <cell title="评分">
          <rater v-model="eva_score" star="✩" active-color="#FF9900" :margin="4" disabled></rater>
        </cell>
        <x-textarea :max="100" v-model="eva_content" placeholder="请输入详细内容" readonly></x-textarea>
      </group>
      <div v-if="route_type===1" style="padding:0 10px;">
        <x-button class="zj_button" type="primary" @click.native="goNext">预约</x-button>
      </div>
      <div style="padding:20px 10px;">
        <div style="padding:0 15px 30px 15px;font-size:12px;color:#ad7de7;">取消预订至少提前两小时，否则照常收取或取消预订资格</div>
        <x-button class="zj_button" v-if="route_state===1||route_state===0||route_state===2" type="primary" @click.native="goCode">{{button_name}}</x-button>
        <x-button v-if="route_state===0" type="default" @click.native="cancelReserve">取消预约</x-button>
      </div>
    </div>
    <alert v-model="confirm_show2" title="离场成功">
      <cell style="text-align: left;" title="消费卡号">{{number}}</cell>
      <cell style="text-align: left;" title="消费卡类别">{{name}}</cell>
      <cell style="text-align: left;" title="费用">{{mprice}}</cell>
      <cell style="text-align: left;" title="余额">{{emoney}}</cell>
    </alert>
    <alert v-model="confirm_show" @on-hide="onHide" :title="dialog_title"> {{confirm_content}}</alert>
    <div v-transfer-dom>
      <confirm v-model="show"
               title="提示"
               @on-confirm="onConfirm">
        <p style="text-align:center;">{{confirm_text}}</p>
      </confirm>
    </div>
    <toast v-model="show_toast">{{toast_text}}</toast>
  </div>
</template>

<script>
  import $ from 'jquery'
  import wx from 'weixin-js-sdk';
  import {setTitle} from '@/common/js/common';
  import Cardchoose from '@/components/card_switch/card_choose.vue';
  import {Loading,Group,Cell,CellFormPreview,XButton,Rater,XTextarea,Alert,Toast,Confirm,TransferDomDirective as TransferDom} from 'vux';

  export default{
    data(){
      return{
        isLoading:false,
        alert_text:"",
        loading:true,
        this_checked:false,
        list: "",
        route_type:0,
        card_list:[],
        list_len:0,
        current_card_id:0,
        choose_time_key:[],
        area_key:"",
        choose_date:"",
        order_id:"",
        route_state:"",
        reserve_time:"",
        button_name:"",
        eva_score:0,
        eva_content:"",
        area_value:"",
        area_time:"",
        time_arr:[],
        this_sum:"",
        first_time:"",
        clubname:"",
        enter_time:"",
        over_time:"",
        confirm_show:false,
        dialog_title:"",
        confirm_content:"",
        show_toast:false,
        toast_text:"",
        confirm_text:"",
        show:false,
        emoney:"",
        mprice:"",
        name:"",
        number:"",
        confirm_show2:false
      }
    },
    directives: {
      TransferDom
    },
    components:{
      Loading,Group,Cell,CellFormPreview,Cardchoose,XButton,Rater,XTextarea,Alert,Toast,Confirm
    },
    mounted(){
        /*route_state:1--详细   route_state:2--评价 route_state:4--查看评价*/
      this.route_state=parseInt(this.$route.query.route_state);
      if(this.route_state===0){
        this.button_name="扫码入场";
      }else if(this.route_state===1){
        this.button_name="扫码离场";
      }else if(this.route_state===2){
        this.button_name="评价";
      }
      console.log(this.route_state);
      this.route_type = parseInt(this.$route.query.route_type);
      console.log(this.route_type);
      if(this.route_type===1){
        setTitle("预约");
        this.list=JSON.parse(this.$route.query.list);
        this.area_value=this.list.area_value;
        this.area_time=this.list.area_time;
        this.time_arr=this.list.time_arr;
        this.this_sum=this.list.this_sum;
        this.first_time=this.list.first_time;
        this.choose_time_key=this.$route.query.choose_time_key;
        this.choose_date=this.$route.query.choose_date;
        this.area_key=this.$route.query.area_key;
        this.getCardList();
      }else{
        setTitle("预订详细");
        this.order_id = parseInt(this.$route.query.order_id);
        console.log("this.order_id:"+this.order_id);
        this.getOrderList();
        if(this.route_state===3){
            this.get_evaluate();
        }
      }
    },
    methods: {
      click_check(){
        this.this_checked = !this.this_checked;
      },
      goNext(){
        this.current_card_id = $(".img3").attr("id");
        const items = {
          card_id: this.current_card_id,
          area_id: this.area_key,
          cost_date: this.choose_date,
          cost_time: this.choose_time_key,
        };
        if(service_url){
          this.$http.post(service_url + "/o2o/club/wx/preSave", items).then((data) => {
            if (data.body.status === 0) {
              this.$router.push({path: 'reserve_success', query: {route_type: 1}});
            } else {
              this.dialog_title="提示";
              this.confirm_content=data.body.error_reason;
              this.confirm_show=true;
            }
          })
        }else{
          this.$router.push({path: 'reserve_success', query: {route_type: 1}});
        }

//        this.$router.push({path:'reserve_success',query:{route_type:1}});
      },
      cancelReserve(){
        this.show=true;
        this.confirm_text="是否取消预约？";
      },
      goCode(){
        if(!this.current_card_id||this.current_card_id==='0'){
          this.current_card_id = $(".img3").attr("id");
        }
        let self = this;
        if (self.route_state === 2) {
          if(self.eva_score===0){
            self.dialog_title="提示";
            self.confirm_content="请选择分数";
            self.confirm_show=true;
          }else{
              const item = {
                order_id:self.order_id,
                eva_score:self.eva_score,
                eva_content:self.eva_content
              };
              this.$http.post(service_url+"/o2o/club/wx/addEvaluate",item).then((data)=>{
                if(data.body.status===0){
                  self.dialog_title="提示";
                  self.confirm_content="评价成功";
                  self.confirm_show=true;
                  self.route_state=3;
                }else{
                  self.dialog_title="提示";
                  self.confirm_content=data.body.error_reason;
                  self.confirm_show=true;
                }
              })
          }
        } else{
            this.wx_code();
        }
      },
      wx_code(){
          let self =this;
        let qrCode = "tj_receive_site_whfmc_" + this.area_key;
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
                  const items = {
                    order_id:self.order_id,
                    card_id:self.current_card_id,
                    choose_datetime:self.reserve_time
                  };
                  if(self.route_state===0){
                    self.$http.post(service_url+"/o2o/club/wx/enterSite",items).then((data)=>{
                      if(data.body.status===0){
                        self.dialog_title="提示";
                        self.confirm_content="入场成功";
                        self.confirm_show=true;
                        self.button_name="扫码离场";
                        self.enter_time=data.body.data;
                        self.route_state = 1;
                      }else{
                        self.dialog_title="提示";
                        self.confirm_content=data.body.error_reason;
                        self.confirm_show=true;
                      }
                    });
                  }else if(self.route_state===1){
                    self.$http.post(service_url+"/o2o/club/wx/leaveSite",items).then((data)=>{
                      if(data.body.status===0){
                        self.emoney = data.body.data.emoney;
                        self.mprice = data.body.data.mprice;
                        self.name = data.body.data.name;
                        self.number = data.body.data.number;
                        self.confirm_show2=true;
                        self.over_time=data.body.data.date;
                        self.button_name="评价";
                        self.route_state=2;
                      }else{
                        self.dialog_title="提示";
                        self.confirm_content=data.body.error_reason;
                        self.confirm_show=true;
                      }
                    });
                  }


                }else{
                  self.dialog_title="提示";
                  self.confirm_content="二维码不匹配";
                  self.confirm_show=true;
                }
              }else{
                self.dialog_title="提示";
                self.confirm_content="访问失败";
                self.confirm_show=true;
              }
            }
          });
        })
      },
      getCardList(){
          console.log("this.area_key:"+this.area_key);
          console.log("this.choose_date:"+this.choose_date);
        let self = this;
        if(service_url){
            const item = {
              choose_key:this.area_key,
              choose_date:this.choose_date
            };
          this.$http.post(service_url+"/o2o/club/wx/preUseCard",item).then((data)=>{
            self.card_list= data.body.data;
            self.list_len=data.body.data.length;
          })
        }else{
          this.$http.get("/api/myCardList").then((data)=>{
              console.log(data);
            self.card_list=data.body.data.data;
            console.log(data.body.data.data);
            self.list_len=data.body.data.data.length;
          })
        }
        document.getElementById("index_loading").style.display="none";
      },
      getOrderList(){
        let self = this;
        const item ={
          "order_id":this.order_id
        };
        if(service_url){
          this.$http.post(service_url+ "/o2o/club/wx/preDetail",item).then((data)=>{
            self.reserve_time=data.body.data.area_date+ " "+data.body.data.area_time;
            self.area_time=data.body.data.area_date;
            self.area_value = data.body.data.area_name;
            self.first_time=data.body.data.area_time;
            self.this_sum=data.body.data.price;
            self.clubname= data.body.data.clubname;
            self.area_key=data.body.data.area_id;
            self.current_card_id=data.body.data.card_id;
            self.enter_time=data.body.data.enter_time;
            self.over_time=data.body.data.over_time;
            self.getCardList();
            /*self.list=[
              [{
                label:"预约项目",
                value:data.body.data.project_name
              },{
                label:"预约场地",
                value:data.body.data.area_name
              },
              {
                label:"预订时间",
                value:data.body.data.area_date+"  "+data.body.data.area_time
              },
              {
                label:"预计费用",
                value:data.body.data.price
              },
              {
                label:"会所名称",
                value:data.body.data.clubname
              }]
            ];*/
          })
        }else{
          this.$http.get("/api/club_order_list").then((data)=>{
            self.reserve_time=data.body.data.data[0].area_date+"  "+data.body.data.data[0].area_time;
            self.area_time=data.body.data.data[0].area_date;
            self.area_value=data.body.data.data[0].area_name;
            self.first_time=data.body.data.data[0].area_time;
            self.this_sum=data.body.data.data[0].price;
            self.clubname=data.body.data.data[0].clubname;
            self.area_key=data.body.data.data[0].area_id;
          })
        }
        document.getElementById("index_loading").style.display="none";
      },
      get_evaluate(){
          let self =this;
          const item = {
              order_id:this.order_id
          };
          this.$http.post(service_url+"/o2o/club/wx/preEvaluate",item).then((data)=>{
              if(data.body.status===0){
                self.eva_score=data.body.data.eva_score;
                self.eva_content=data.body.data.eva_content;
              }else{
                self.dialog_title="提示";
                self.confirm_content=data.body.error_reason;
                self.confirm_show=true;
              }
          })
      },
      onConfirm(){
        this.isLoading=true;
        this.alert_text="取消中";
        if (service_url) {
          const item = {
            order_id: this.order_id
          };
          this.$http.post(service_url + "/o2o/club/wx/preCancel", item).then((data) => {
            if (data.body.status === 0) {
                this.isLoading=false;
              this.show_toast=true;
              this.toast_text="取消预约成功";
              setTimeout(this.go_back,1000);
            } else {
              this.dialog_title="提示";
              this.confirm_content=data.body.error_reason;
              this.confirm_show=true;
            }
          })
        } else {
          this.isLoading=false;
          this.show_toast=true;
          this.toast_text="取消预约成功";
          setTimeout(this.go_back,1000);
        }
      },
      go_back(){
          this.$router.go(-1);
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

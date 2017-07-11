<template>
  <div>
    <!--<loading v-show="loading" style="text-align: center"></loading>-->
    <div>
      <group gutter="0">
        <div id="container">123</div>
        <div style="background-color:white" class="containers" id="containers" ref="abc">
          <!--外框-->
          <div class="fk_outer_div">
            <!--二维码-->
            <div class="inner_div_1">
              <img v-if="pic.length==0" style="width:100%;height:100%;" src="../../common/img/erweima.png"/>
              <img v-if="pic.length!=0" style="width:100%;height:100%;" :src="pic"/>
            </div>
            <!--文字-->
            <div class="inner_div_2">
              <h2 ref="this_position" class="text_center">
                {{position}}
              </h2>
              <div class="weui_flex third_font third_font_margin">
                <div>有效期至</div>
                <div class="text_right this_flex_1" id="timevalue">{{time}}</div>
              </div>
              <div class="weui_flex third_font third_font_margin">
                <div>访客姓名</div>
                <div class="text_right this_flex_1">{{name}}</div>
              </div>
              <div class="weui_flex third_font third_font_margin">
                <div>性别</div>
                <div class="text_right this_flex_1">{{sex}}</div>
              </div>
              <div class="weui_flex third_font third_font_margin">
                <div>联系电话</div>
                <div class="text_right this_flex_1">{{phone}}</div>
              </div>
              <div class="weui_flex fourth_font third_font_margin fourth_font_color">
                <div class="text_center this_flex_1">请在门岗打开二维码，扫码开门</div>
              </div>
            </div>
          </div>
        </div>
      </group>
      <div style="padding:20px 10px;">
        <x-button type="primary" @click.native="help">分享</x-button>
      </div>

      <div v-if="dialog_show" class="weui_dialog_alert weui_share" id="share">
        <div class="weui_mask"></div>
        <div class="weui_dialog">
          <div class="weui_dialog_hd"><strong class="weui_dialog_title">请点击右上角【...】
            <br>马上分享</strong></div>
          <div class="weui_dialog_bd"></div>
          <div class="weui_dialog_ft_m">
            <div @click="dialog_hide" class="close"></div>
          </div>
        </div>
      </div>
    </div>

    <alert v-model="confirm_show" :title="dialog_title" @on-show="onShow" @on-hide="onHide"> {{content}}</alert>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import html2canvas from 'html2canvas';
  import $ from 'jquery';
  //  import html2canvas from '@/common/js/html2canvas';
  import wx from 'weixin-js-sdk';
  import {Alert,Group,XButton} from 'vux';

  export default{
    data(){
      return{
        loading:true,
        dialog_show:false,
        pic:"",
        position:"",
        time:"",
        name:"",
        sex:"",
        phone:"",
        confirm_show:false,
        content:"",
        dialog_title:"",
        state:0
      }
    },
    components:{
      loading,Alert,Group,XButton
    },
    mounted(){
      let self =this;
      setTitle("二维码分享");
      this.getdata();

    },
    methods:{
      getdata(){
        let self = this;
        if(service_url){
          this.$http.get(service_url+"/o2o/door/wx/door/invite/qrcode?id="+this.$route.query.id).then((data)=>{
            if(data.body.statusCode==="ok"){
              if(data.body.status==="OK"){
                self.pic=data.body.data.pic;
                self.position=data.body.data.position.desc;
                self.time=data.body.data.time.val;
                self.name=data.body.data.name.val;
                self.sex=data.body.data.sex.val;
                self.phone=data.body.data.phone.val;


              }else{
                alert("请确定您当前有可用的门禁权限！");
                this.$router.push({path:"index"});
              }
            }else{
              alert(data.body.message);
            }

          })
        }else{
          this.$http.get("/api/code_share").then((data)=>{
            self.pic=data.body.data.data.pic;
            self.position=data.body.data.data.position.desc;
            self.time=data.body.data.data.time.val;
            self.name=data.body.data.data.name.val;
            self.sex=data.body.data.data.sex.val;
            self.phone=data.body.data.data.phone.val;
            self.state=1;
          })
        }
        if($("#timevalue").html()!==""){
          let w = $("#container").width();
          let h = $("#container").height();
          var canvas = document.createElement("canvas");
          canvas.width = w * 2;
          canvas.height = h * 2;
          canvas.style.width = w + "px";
          canvas.style.height = h + "px";
          let context = canvas.getContext("2d");
          context.scale(2,2);

          html2canvas($("#container"), {
            canvas: canvas,
            onrendered: function(canvas) {
              let dataUrl = canvas.toDataURL();
              const items={
                "data": {
                  "img": dataUrl, //姓名
                }
              };
              if(service_url){
                self.$http.post(service_url+"/o2o/door/wx/door/share",items).then((data)=>{
                  if (data.body.statusCode === "ok") {
                    self.share_url=data.body.data.share_url;
                    wx.config({
                      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//                        debug : true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                      appId: userProfile.wx.appid, // 必填，公众号的唯一标识
                      timestamp: userProfile.wx.timestamp, // 必填，生成签名的时间戳
                      nonceStr: userProfile.wx.nonceStr, // 必填，生成签名的随机串
                      signature: userProfile.wx.signature,// 必填，签名，见附录1
                      jsApiList: ['onMenuShareAppMessage']
                      // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(function () {
                      if (self.share_url) {
//                      wx.hideMenuItems({
//                        menuList: ["menuItem:share:timeline,menuItem:share:weiboApp,menuItem:share:facebook,menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
//                      });
                        wx.onMenuShareAppMessage({
                          title: '开门二维码', // 分享标题
                          desc: '这是分享给您的开门二维码', // 分享描述
                          link: self.share_url, // 分享链接
                          imgUrl: '', // 分享图标
                          type: '', // 分享类型,music、video或link，不填默认为link
                          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                          success: function () {
                            self.dialog_title="恭喜";
                            self.content="分享成功";
                            self.confirm_show=true;
                          },
                          cancel: function () {
                            // 用户取消分享后执行的回调函数
                          }
                        });
                        /*wx.onMenuShareQQ({
                         title: '开门二维码', // 分享标题
                         desc: '这是分享给您的开门二维码', // 分享描述
                         link: self.share_url, // 分享链接
                         imgUrl: '', // 分享图标
                         success: function () {
                         self.dialog_title="恭喜";
                         self.content="分享成功";
                         self.confirm_show=true;
                         },
                         cancel: function () {
                         // 用户取消分享后执行的回调函数
                         }
                         });*/
                      }
                    })
                  } else {
                    self.dialog_title="注意";
                    self.content=data.message;
                    self.confirm_show=true;
                  }
                })
              }
            }
          });
          document.getElementById("index_loading").style.display="none";
        }
      },
      wxShare(){
        let self = this;
        html2canvas(document.getElementById("containers"), {
          allowTaint: true,
          taintTest: false,
          onrendered: function (canvas) {
            canvas.id = "mycanvas";
            document.body.appendChild(canvas);
            //生成base64图片数据
            self.dataUrl = canvas;
            self.mark=1;
          }
        });
//        console.log(this.mark);
      },
      share_to(){
        let self = this;
        const items={
          "data": {
            "img": this.dataUrl.toDataURL(), //姓名
          }
        };
        if(service_url){
          self.$http.post(service_url+"/o2o/door/wx/door/share",items).then((data)=>{
            if (data.body.statusCode === "ok") {
              self.share_url=data.body.data.share_url;
              wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//                        debug : true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: userProfile.wx.appid, // 必填，公众号的唯一标识
                timestamp: userProfile.wx.timestamp, // 必填，生成签名的时间戳
                nonceStr: userProfile.wx.nonceStr, // 必填，生成签名的随机串
                signature: userProfile.wx.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareAppMessage']
                // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              });
              wx.ready(function () {
                if (self.share_url) {
//                      wx.hideMenuItems({
//                        menuList: ["menuItem:share:timeline,menuItem:share:weiboApp,menuItem:share:facebook,menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
//                      });
                  wx.onMenuShareAppMessage({
                    title: '开门二维码', // 分享标题
                    desc: '这是分享给您的开门二维码', // 分享描述
                    link: self.share_url, // 分享链接
                    imgUrl: '', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                      self.dialog_title="恭喜";
                      self.content="分享成功";
                      self.confirm_show=true;
                    },
                    cancel: function () {
                      // 用户取消分享后执行的回调函数
                    }
                  });
                  /*wx.onMenuShareQQ({
                   title: '开门二维码', // 分享标题
                   desc: '这是分享给您的开门二维码', // 分享描述
                   link: self.share_url, // 分享链接
                   imgUrl: '', // 分享图标
                   success: function () {
                   self.dialog_title="恭喜";
                   self.content="分享成功";
                   self.confirm_show=true;
                   },
                   cancel: function () {
                   // 用户取消分享后执行的回调函数
                   }
                   });*/
                }
              })
            } else {
              self.dialog_title="注意";
              self.content=data.message;
              self.confirm_show=true;
            }
          })
        }
      },
      help(){
        this.dialog_show=true;
      },
      dialog_hide(){
        this.dialog_show=false;
      },
      onShow(){

      },
      onHide(){

      }
    }
  }
</script>

<style scoped>
  @import "../../common/css/menjin.css";
  .weui_share .weui_mask{
    background: rgba(0,0,0,.6);
    z-index: 1000;
    height: 100%;
    position: fixed;
    left: 0;
    width: 100%;
    top: 0;
  }
  .weui_share .weui_dialog{
    top: 40%;
    background-color: transparent;
    overflow: visible;
    position: fixed;
    z-index: 5000;
    width: 85%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    text-align: center;
    border-radius: 3px;
  }
  .weui_share .weui_dialog:after{
    overflow: hidden;
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(../../common/img/sharearrow2.png) right/55px no-repeat;
    content: " ";
  }
  .weui_share .weui_dialog_hd{
    border: 1px dashed #fff;
    border-radius: 8px;
    padding: 1.2em .5em;
  }
  .weui_share .weui_dialog_title{
    color: #fff;
    font-weight: 400;
    font-size: 17px;
  }
  .weui_share .weui_dialog_bd{
    padding: 20px;
    color: #fff;
    font-size: 15px;
    word-wrap: break-word;
    word-break: break-all;
  }
  .weui_share .weui_dialog_ft_m{
    position: relative;
    line-height: 42px;
    margin-top: 20px;
    font-size: 17px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }
  .weui_share .close{
    position: absolute;
    top: 5em;
    left: 50%;
    width: 40px;
    height: 40px;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .weui_share .close:before{
    transform: rotateZ(45deg);
    position: absolute;
    top: 50%;
    left: 0;
    border-top: 1px solid #bbb;
    width: 100%;
    height: 0;
    content: " ";
  }
  .weui_share .close:after{
    transform: rotateZ(-45deg);
    position: absolute;
    top: 50%;
    left: 0;
    border-top: 1px solid #bbb;
    width: 100%;
    height: 0;
    content: " ";
  }
  .text_center{
    text-align: center;
  }
</style>

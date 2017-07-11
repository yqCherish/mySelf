<template>
  <div class="container">
    <div id="slide" class="slide index-slide" alt="star">

      <div v-for="item in project_list">
        <div v-if="item.card_type==1" :id="item.card_id" class="img"  style="background-image:url(data:image/png;base64,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);background-size:cover;">
          <div class="top_line"></div>
          <div class="center_div">
            <div class="big_height">剩余次数：{{item.cost_extra}}</div>
            <div class="small_height">到期时间:{{item.card_validate}}</div>
            <div class="small_height">{{item.card_name}}<span style="color:#ff9500">{{'('+item.card_no+')'}}</span></div>
          </div>
          <div class="bottom_line"></div>
          <div class="right_line"></div>
          <div class="right_div">次卡</div>
        </div>
        <div v-if="item.card_type==2" :id="item.card_id" class="img"  style="background-image:url(data:image/png;base64,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);background-size:cover;">
          <div class="top_line"></div>
          <div class="center_div">
            <div class="big_height">剩余时长：{{item.cost_extra}}</div>
            <div class="small_height">到期时间:{{item.card_validate}}</div>
            <div class="small_height">{{item.card_name}}<span style="color:#ff9500">{{'('+item.card_no+')'}}</span></div>
          </div>
          <div class="bottom_line"></div>
          <div class="right_line"></div>
          <div class="right_div">小时卡</div>
        </div>
        <div v-if="item.card_type==3" :id="item.card_id" class="img"  style="background-image:url(data:image/png;base64,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);background-size:cover;">
          <div class="top_line"></div>
          <div class="center_div">
            <div class="big_height">余额：{{item.cost_extra}}</div>
            <div class="small_height">到期时间:{{item.card_validate}}</div>
            <div class="small_height">{{item.card_name}}<span style="color:#ff9500">{{'('+item.card_no+')'}}</span></div>
          </div>
          <div class="bottom_line"></div>
          <div class="right_line"></div>
          <div class="right_div">折扣卡</div>
        </div>
      </div>

      <div class="slide-bt"></div>

      <!--轮播图片数量可自行增减-->
      <!--<div @click="goDetail" class="img"><div class="div"><img src ="./swim.png"/><div style="display: inline-block;position: absolute;margin-top: calc(18%);"><p style="font-size:18px; text-align: center">游泳</p><p style="font-size:14px;color:#999">悦享活动，触手可及</p></div></div></div>-->
      <!--<div @click="goDetail" class="img"><div class="div"><img src ="./baseball.png"/><div style="display: inline-block;position: absolute;margin-top: calc(18%);"><p style="font-size:18px; text-align: center">游泳</p><p style="font-size:14px;color:#999">悦享活动，触手可及</p></div></div></div>-->
      <!--<div @click="goDetail" class="img"><div class="div"><img src ="./pingpang.png"/><div style="display: inline-block;position: absolute;margin-top: calc(18%);"><p style="font-size:18px; text-align: center">游泳</p><p style="font-size:14px;color:#999">悦享活动，触手可及</p></div></div></div>-->
      <!--<div @click="goDetail" class="img"><div class="div"><img src ="./card_game.png"/><div style="display: inline-block;position: absolute;margin-top: calc(18%);"><p style="font-size:18px; text-align: center">游泳</p><p style="font-size:14px;color:#999">悦享活动，触手可及</p></div></div></div>-->
      <div class="slide-bt"></div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default{
    props: {
      project_list: Array,
      autoLb: {//autoLb=true为开启自动轮播
        type: Boolean,
        default: false
      },
      autoLbtime: {//autoLbtime为轮播间隔时间（单位秒）
        type: Number,
        default: 1
      },
      touch: {//touch=true为开启触摸滑动
        type: Boolean,
        default: true
      },
      slideBt: {//slideBt=true为开启滚动按钮
        type: Boolean,
        default: true
      },
      slideNub:{
        type:Number,
      }
    },
    data(){
      return {
        _start: [],
        _end: [],
        _content: {}
      }
    },
    mounted(){
      console.log(this.slideNub);
      $(window).resize(function () {
        $(".slide").height($(".slide").width() * 0.56);
      });
      $(".slide").height($(".slide").width() * 0.56);
//      this.slideNub = this.num;             //获取轮播图片数量
//      console.log(123);
//      console.log(this.slideNub);
      for (let i = 0; i < this.slideNub; i++) {
        console.log(i);
        $(".slide .img:eq(" + i + ")").attr("data-slide-imgId", i);
      }

      //根据轮播图片数量设定图片位置对应的class
      if (this.slideNub == 1) {
        for (let i = 0; i < this.slideNub; i++) {
          $(".slide .img:eq(" + i + ")").addClass("img3");
        }
      }
      if (this.slideNub == 2) {
        for (let i = 0; i < this.slideNub; i++) {
          $(".slide .img:eq(" + i + ")").addClass("img" + (i + 3));
        }
      }
      if (this.slideNub == 3) {
        for (let i = 0; i < this.slideNub; i++) {
          $(".slide .img:eq(" + i + ")").addClass("img" + (i + 2));
        }
      }
      if (this.slideNub > 3 && this.slideNub < 6) {
        for (let i = 0; i < this.slideNub; i++) {
          $(".slide .img:eq(" + i + ")").addClass("img" + (i + 1));
        }
      }
      if (this.slideNub >= 6) {
        for (let i = 0; i < this.slideNub; i++) {
          if (i < 5) {
            $(".slide .img:eq(" + i + ")").addClass("img" + (i + 1));
          } else {
            $(".slide .img:eq(" + i + ")").addClass("img5");
          }
        }
      }

//根据轮播图片数量设定轮播图按钮数量
      if (this.slideBt) {
        for (let i = 1; i <= this.slideNub; i++) {
          $(".slide-bt").append("<span data-slide-bt='" + i + "' onclick='tz(" + i + ")'></span>");
        }
        $(".slide-bt").width(this.slideNub * 34);
        $(".slide-bt").css("margin-left", "-" + this.slideNub * 17 + "px");
      }

//自动轮播
      if (this.autoLb) {
        setInterval(function () {
          this.right();
        }, this.autoLbtime * 1000);
      }


      if (this.touch) {
        this.k_touch();
      }
      this.slideLi();
//        this.imgClickFy();
    },
    methods: {
      k_touch(){
//        var _start = 0, _end = 0, _content = document.getElementById("slide");
        this._start = 0;
        this._end = 0;
        this._content = document.getElementById("slide");
        console.log(this._content);
        this._content.addEventListener("touchstart", this.touchStart, false);
        this._content.addEventListener("touchmove", this.touchMove, false);
        this._content.addEventListener("touchend", this.touchEnd, false);
        /*function touchStart(event) {
         var touch = event.targetTouches[0];
         _start = touch.pageX;
         }
         function touchMove(event) {
         var touch = event.targetTouches[0];
         _end = (_start - touch.pageX);
         }

         function touchEnd(event) {
         if (_end < -100) {
         this.left();
         _end=0;
         }else if(_end > 100){
         console.log("run")
         this.right();
         _end=0;
         }
         }*/
      },
      touchStart(event) {
        var touch = event.targetTouches[0];
        this._start = touch.pageX;
      },
      touchMove(event) {
        var touch = event.targetTouches[0];
        this._end = (this._start - touch.pageX);
      },
      touchEnd(event) {
        if (this._end < -100) {
          this.left();
          this._end = 0;
        } else if (this._end > 100) {
          this.right();
          this._end = 0;
        }
      },
      slideLi(){
        var slideList = parseInt($(".slide .img3").attr("data-slide-imgId")) + 1;
        $(".slide-bt span").removeClass("on");
        $(".slide-bt span[data-slide-bt=" + slideList + "]").addClass("on");
      },
      /*imgClickFy(){
       $(".slide .img").removeAttr("onclick");
       let dom_img2=document.getElementsByClassName("img2")[0];
       console.log(dom_img2);
       let dom_img4=document.getElementsByClassName("img4")[0];
       dom_img2.addEventListener("click", this.left, false);
       dom_img4.addEventListener("click", this.right, false);
       },*/
      right(){
        console.log("right");
        var fy = new Array();
        for (let i = 0; i < this.slideNub; i++) {
          fy[i] = $(".slide .img[data-slide-imgId=" + i + "]").attr("class");
        }
        for (let i = 0; i < this.slideNub; i++) {
          if (i == 0) {
            $(".slide .img[data-slide-imgId=" + i + "]").attr("class", fy[this.slideNub - 1]);
          } else {
            $(".slide .img[data-slide-imgId=" + i + "]").attr("class", fy[i - 1]);
          }
        }
//        this.imgClickFy();
        this.slideLi();
      },
      left(){
        var fy = new Array();
        for (let i = 0; i < this.slideNub; i++) {
          fy[i] = $(".slide .img[data-slide-imgId=" + i + "]").attr("class");
        }
        for (let i = 0; i < this.slideNub; i++) {
          if (i == (this.slideNub - 1)) {
            $(".slide .img[data-slide-imgId=" + i + "]").attr("class", fy[0]);
          } else {
            $(".slide .img[data-slide-imgId=" + i + "]").attr("class", fy[i + 1]);
          }
        }
      },
      goDetail(id){
        this.$router.push({path: '/area_detail', query: {"project_id": id}});
      }
    }
  }
</script>

<style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  .slide {
    width: 100%;
    min-height: 180px;
    overflow: hidden;
    position: relative;

  }

  .slide .img{
    overflow: hidden;
    position: absolute;
    transition: width 0.4s,height 0.4s,top 0.4s,left 0.4s,z-index 0.4s;
  }
  .slide .img img{
    width: calc(100% - 14px);
    height: calc(100% - 14px);
    margin: 7px;
  }
  .slide .img1{
    width: 40%;
    height: 40%;
    top: 30%;
    left: -50%;
    z-index: 1;
    background-color:#999999;
    border-radius:5px;
  }
  .slide .img2{
    width: 60%;
    height: 60%;
    top: 20%;
    /*left: -20%;*/
    left: 2%;
    z-index: 2;
    background-color:#999999;
    border-radius:5px;
  }
  .slide .img3{
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    z-index: 3;
    /*background-color:black;*/
    border-radius:5px;
  }
  .slide .img4{
    width: 60%;
    height: 60%;
    top: 20%;
    left: 38%;
    z-index: 2;
    background-color:#999999;
    border-radius:5px;
  }
  .slide .img5{
    width: 40%;
    height: 40%;
    top: 30%;
    left: 110%;
    z-index: 1;
    background-color:#999999;
    border-radius:5px;
  }
  .slide-bt{
    position: absolute;
    left: 50%;
    bottom: 13%;
    z-index: 10;
  }
  .slide-bt span{
    width: 24px;
    height: 8px;
    background: #c9caca;
    float: left;
    margin: 5px;
    border-radius: 4px;
  }
  .slide .slide-bt .on{
    background: #ffd200;
  }

  button {
    width: 50px;
    margin: 20px;
  }

  .posa_h {
    position: absolute;
    font-size: 20px;
    margin-top: calc(17%);
    margin-left: calc(18%);
  }

  .posa_p {
    position: absolute;
    font-size: 14px;
    color: #999;
    margin-top: calc(28%);
  }
  .top_line{
    position:absolute;
    background-color:orange;
    width:calc(1%);
    height:calc(40%);
    margin-left:calc(10%);
  }
  .center_div{
    width:calc(80%);
    height:calc(40%);
    top:calc(40%);
    margin-left:calc(10%);
    color:white;
    position:absolute;
  }
  .bottom_line{
    position:absolute;
    background-color:orange;
    top:calc(80%);
    width:calc(1%);
    height:calc(40%);
    margin-left:calc(10%);
  }
  .right_line{
    position:absolute;
    background-color:orange;
    top:calc(20%);
    width:calc(10%);
    height:calc(2%);
    right:0;
  }
  .right_div{
    position:absolute;
    width:calc(80%);
    height:calc(20%);
    text-align: right;
    top:calc(14%);
    right:calc(10%);
    color:white;
  }
  .big_height{
    height:calc(40%);
  }
  .small_height{
    height:calc(30%);
    font-size:calc(75%);
  }
</style>

<template>
  <div class="container">
    <div id="slide" class="slide index-slide" alt="star">

      <div @click="goDetail(item.id)" class="img" v-for="item in project_list">
        <div class="div"><img :src="item.icon"/>
          <div style="display: inline-block;position: absolute;margin-top: calc(16%);padding:0 5px;width:calc(50%)">
            <p style="font-size:18px; text-align: center">{{item.name}}</p>
            <p style="font-size:12px;color:#999;text-align: center">{{item.simple_desc}}</p></div>
        </div>
      </div>
      <div class="slide-bt"></div>

       <!--轮播图片数量可自行增减-->
      <!--<div @click="goDetail" class="img"><div class="div"><img src ="./swim.png"/><div style="display: inline-block;position: absolute;margin-top: calc(18%);"><p style="font-size:18px; text-align: center">游泳</p><p style="font-size:14px;color:#999">悦享活动，触手可及</p></div></div></div>
      <div @click="goDetail" class="img"><div class="div"><img src ="./baseball.png"/><div style="display: inline-block;position: absolute;margin-top: calc(18%);"><p style="font-size:18px; text-align: center">游泳</p><p style="font-size:14px;color:#999">悦享活动，触手可及</p></div></div></div>
      <div @click="goDetail" class="img"><div class="div"><img src ="./pingpang.png"/><div style="display: inline-block;position: absolute;margin-top: calc(18%);"><p style="font-size:18px; text-align: center">游泳</p><p style="font-size:14px;color:#999">悦享活动，触手可及</p></div></div></div>
      <div @click="goDetail" class="img"><div class="div"><img src ="./card_game.png"/><div style="display: inline-block;position: absolute;margin-top: calc(18%);"><p style="font-size:18px; text-align: center">游泳</p><p style="font-size:14px;color:#999">悦享活动，触手可及</p></div></div></div>
      <div class="slide-bt"></div>-->
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
          type:Number
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

  .slide .img {
    overflow: hidden;
    position: absolute;
    transition: width 0.4s, height 0.4s, top 0.4s, left 0.4s, z-index 0.4s;
  }

  /*.slide .img img{
    width: calc(100% - 14px);
    height: calc(100% - 14px);
    margin: 7px;
  }*/
  .slide .img .div {
    background-color: white;
    width: calc(100% - 14px);
    height: calc(100% - 14px);
    margin: 7px;
    border-radius: 10px;
    -webkit-box-shadow: 0 0 10px #ececec;
    -moz-box-shadow: 0 0 10px #ececec;
    box-shadow: 0 0 10px #ececec;
  }

  .slide .img div img {
    height: calc(55%);
    width:calc(30%);
    padding: calc(12%) calc(2%) calc(12%) calc(8%);
  }

  .slide .img1 {
    width: 40%;
    height: 40%;
    top: 30%;
    left: -50%;
    z-index: 1;
  }

  .slide .img2 {
    width: 60%;
    height: 60%;
    top: 5%;
    left: -45%;
    z-index: 2;
  }

  .slide .img3 {
    width: 70%;
    height: 70%;
    top: 0;
    left: 15%;
    z-index: 3;
  }

  .slide .img4 {
    width: 60%;
    height: 60%;
    top: 5%;
    left: 85%;
    z-index: 2;
  }

  .slide .img5 {
    width: 40%;
    height: 40%;
    top: 30%;
    left: 110%;
    z-index: 1;
  }

  .slide-bt {
    position: absolute;
    left: 50%;
    bottom: 13%;
    z-index: 10;
  }

  .slide-bt span {
    width: 24px;
    height: 8px;
    background: #c9caca;
    float: left;
    margin: 5px;
    border-radius: 4px;
  }

  .slide .slide-bt .on {
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
    font-size: 12px;
    color: #999;
    margin-top: calc(28%);
  }
</style>

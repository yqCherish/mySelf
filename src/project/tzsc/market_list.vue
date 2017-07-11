<template>
  <div style="background-color:white;">
    <!--头像，名称，时间-->
    <router-link :to="{path:'market_detail',query:{goods_id:goodsId}}">
      <cell title="123">
        <img slot="icon" width="40" style="display:block;margin-right:5px;border-radius:50%;" src="icon_src">
        <div slot="value">
          <span style="color: red">{{value}}</span>
        </div>
      </cell>
      <!--content-->

      <div class="padding_lr">
        {{content}}
      </div>
    </router-link>
    <div class="padding_lr" >
      <!--<div v-if="length===1">
        <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgwidth"/>
      </div>
      <div v-if="length===2">
        <div :style="imageurl">
          <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgNextWidth"/>
        </div>
        <div :style="imageurl">
          <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgNextWidth"/>
        </div>
      </div>
      <div v-if="length===3">
        <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgwidth"/>
        <div :style="imageurl">
          <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgNextWidth"/>
        </div>
        <div :style="imageurl">
          <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgNextWidth"/>
        </div>
      </div>-->
      <div v-if="length===4">
        <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgwidth"/>
        <div :style="imageurl2">
          <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgthirdHeight"/>
        </div>
        <div :style="imageurl2">
          <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgthirdHeight"/>
        </div>
        <div :style="imageurl2">
          <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgthirdHeight"/>
        </div>
      </div>
      <div v-else>
        <div :style="imageurl2">
          <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgthirdHeight"/>
        </div>
        <div :style="imageurl2">
          <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgthirdHeight"/>
        </div>
        <div :style="imageurl2">
          <img src = "http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg" :style="imgthirdHeight"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Cell,Group} from 'vux';
  export default{
    props: {
      imgs: [],
      icon_width: Number,
      icon_src:String,
      title:String,
      value:String,
      content:String,
      length:Number,
      goodsId:Number
    },
    computed:{
      imageurl(){
        return {"width":(document.body.clientWidth-35)/2+"px","display":"inline-block"}
      },
      imageurl2(){
        return {"width":(document.body.clientWidth-45)/3+"px","display":"inline-block"}
      },
      imgwidth(){
        return{"width":"100%" ,"height":(document.body.clientWidth-50)/2+"px"}
      },
      imgNextWidth(){
          return{
            "width":"100%" ,"height":(document.body.clientWidth-100)/2+"px"
          }
      },
      imgthirdHeight(){
        return{
          "width":"100%" ,"height":(document.body.clientWidth-200)/2+"px"
        }
      }
    },
    components:{
        Cell,Group
    },
    mounted(){
        console.log(this.goodsId);
    }
  }
</script>

<style scoped>
  .padding_lr{
    padding:0 15px 10px 15px;
  }
</style>

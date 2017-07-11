<template>
  <div>
    <!--<loading v-show="loading" style="text-align: center"></loading>-->
    <div style="padding-bottom:48px;">
      <!--房产切换栏-->
      <div class="header">
        <!--<select v-model="fruit">
          <option v-for="option in options" v-bind:value="option.value">
            {{option.text}}
          </option>
        </select>-->
        <div style="text-align: center;position:relative">
          <div style="position:absolute;top:2px;">
            <img width="40" style="margin-right:5px;" src="../common/img/logo.png"/>
          </div>
          <div>
            <div class="f_flex" @click ="showActionsheet"><span style="color:#ffffff">{{currentEstate}}</span><span style="color:#fdd24d">{{currentHouse}}</span><i class="arrow"></i></div>
          </div>
        </div>
      </div>
      <!--广告区-->
      <!--<swiper loop auto :list="demo06_list" :index="demo06_index" :height="swiper_height" @on-index-change="demo06_onIndexChange"></swiper>-->
      <swiper auto :aspect-ratio="400/750">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in demo06_list" :key="index" @click.native="go_link(item.url,item.id)"><img style="height:100%;width:100%;object-fit: cover;" :src="item.picture"></swiper-item>
      </swiper>
      <actionsheet v-model="ac_show" :menus="options" @on-click-menu="click_option"></actionsheet>
      <!--按钮区域-->
      <div style="position:relative">
        <div style="margin-top:4px;margin-bottom:6px;" class="f_flex">
          <!--<router-link :to="{path:'market_index'}">-->
          <div :style="imageurl" class="fkyq common margin_right" @click="go_bsbx">
            <div class="posa" :style="fkyqStyle">
              <img src = "../common/img/repair.png" style="height:100%;width:100%;"/>
            </div>
            <div class="posa color_white" :style="fkyqDiv">
              报事报修
            </div>
          </div>
          <!--</router-link>-->
          <!--<router-link :to="{path:'ts_bs',query:{type:1}}">-->
          <div :style="imageurl" class="bsbx common" @click="go_jf">
            <div class="posa" :style="bsbxStyle">
              <img src = "../common/img/bank_card.png" style="height:100%;width:100%;"/>
            </div>
            <div class="posa color_white" :style="bsbxDiv">
              物业缴费
            </div>
            <!--<img src = "../common/img/repair.png"/>-->
          </div>
        </div>
        <div class="f_flex">
          <!--</router-link>-->
          <!--<router-link :to="{path:'notice_list'}">-->
          <div :style="imageurl" class="jf common margin_right" @click ="go_pzsh">
            <div class="posa" :style="jfStyle">
              <img src = "../common/img/store.png" style="height:100%;width:100%;"/>
            </div>
            <div class="posa color_white" :style="jfDiv">
              品质生活
            </div>
            <!--<img src = "../common/img/bank_card.png"/>-->
          </div>
          <!--</router-link>-->
          <!--<router-link :to="{path:'goods_index'}">-->
          <div :style="imageurl" class="common pzsh" @click="showMore">
            <div class="posa" :style="pzshStyle">
              <img src = "../common/img/more.png" style="height:100%;width:100%;"/>
            </div>
            <div class="posa color_white" :style="bsbxDiv">
              更多服务
            </div>
            <!--<img src = "../common/img/store.png"/>-->
          </div>
        </div>
        <!--</router-link>-->
        <!--<router-link :to="{path:'market_index'}">-->
        <div :style="imageradius" class="znkm" @click = go_smkm>
          <div class="posa" :style="smkmStyle">
            <img src = "../common/img/erweima.png" style="height:100%;width:100%;"/>
          </div>
          <div class="posa color_white sm" :style="smkmDiv">
            扫码开门
          </div>
        </div>
      </div>
      <div class="fresh_news">
        <div class="line_show"></div>
        <div>
          <p style="font-size:20px;">社区新鲜事</p>
          <p style="font-size:12px;margin-top:-5px;">community news</p>
        </div>
        <div class="line_show_n"></div>
      </div>
      <group gutter="5px">
        <!--<cell title="社区新鲜事"></cell>-->

        <div v-for="item in fresh_news">
          <div style="display:flex;border-top:1px solid #ececec">
            <div style="width: 45px;height:45px;margin-left:20px;margin-top:10px;"><img style="border-radius:50%;width: 100%;height:100%;" :src="item.published_img"/></div>
            <div style="margin-left:7px;;margin-top:10px;">
              <div>{{item.published_man}}</div>
              <div><span style="font-size:14px;color:#999;">{{item.fresh_time}}</span><span style="margin-left:10px;font-size:14px;color:#999;">来自</span><span style="font-size:14px;color:#ad7de7">{{item.published_from}}</span></div>
            </div>
          </div>
          <div style="margin:8px 15px;">
            <div style="font-size:14px;margin:10px 0;max-height:40px;overflow:hidden;">
              {{item.published_content}}
            </div>
              <!--<div v-if="item.type===2||item.type===3||item.type===4">
                <img :style="sqhd_rate" v-for="imgs in item.detail_img" :src="imgs"/>
              </div>-->
            <div>
              <div v-if="item.detail_img.length===1">
                <img class="object_fit" :style="sqhd_rate" v-for="imgs in item.detail_img" :src="imgs"/>
              </div>
              <div v-if = "item.detail_img.length===2">
                <img class="object_fit" :style="sqhd_2_rate" v-for="imgs in item.detail_img" :src="imgs"/>
              </div>
              <div v-if = "item.detail_img.length===3">
                <img class="object_fit" v-if="index===0" :style="sqhd_rate" v-for="(imgs,index) in item.detail_img" :src="imgs"/>
                <img class="object_fit" v-if="index!==0" :style="sqhd_2_rate" v-for="(imgs,index) in item.detail_img" :src="imgs"/>
              </div>
              <div v-if="item.detail_img.length===4">
                <img class="object_fit" v-if="index===0" v-for="(imgs,index) in item.detail_img" :style="xxsa_rate" :src="imgs"/>
                <img class="object_fit" v-if="index!==0" v-for="(imgs,index) in item.detail_img" :style="xxs_rate" :src="imgs"/>
              </div>
              <!--<div v-else>
                <img v-for="imgs in item.detail_img" :style="xxs_rate" :src="imgs"/>
              </div>-->
            </div>
            <div style="margin:5px 0 10px;font-size:14px;">
              <span v-if="item.is_stick===1" style="padding:2px 5px;border-radius:5px;border:1px solid yellow;color:yellow;margin-right:5px;">置顶</span>
              <span style="padding:2px 5px;border-radius:5px;border:1px solid #ad7de7;color:#ad7de7;margin-right:5px;">{{item.type_num}}</span>
            </div>
          </div>
        </div>
      </group>
        <!--</router-link>-->
      </div>
    <popup style="background:#ececec;opacity: 0.9;height:100%;" v-model="popup_model">
      <div @click="popup_model=false">
        <div style="position:absolute;padding:50px 30px;color:#615d5d;">
          <div style="font-size:48px;float:left">{{this_day}}</div>
          <div style="float:left;padding:12px;"><div>星期{{this_week}}</div><div>{{this_month+'/'+this_year}}</div></div>
        </div>
        <flexbox style="position:absolute;bottom:81px;" :gutter="0" wrap="wrap" v-if="identity===1">
          <flexbox-item :span="1/4"><div @click="cannot_in" style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/会所.png"/><p style="font-size:14px">会所</p></div></flexbox-item>
          <flexbox-item :span="1/4"><div @click="cannot_in" style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/钥匙管理.png"/><p style="font-size:14px">钥匙管理</p></div></flexbox-item>
          <flexbox-item :span="1/4"><div @click="cannot_in" style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/保洁.png"/><p style="font-size:14px">专业保洁</p></div></flexbox-item>
          <flexbox-item :span="1/4"><div @click="cannot_in" style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/公告.png"/><p style="font-size:14px">公告</p></div></flexbox-item>
          <flexbox-item :span="1/4"><div @click="cannot_in" style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/微装.png"/><p style="font-size:14px">微装</p></div></flexbox-item>
          <flexbox-item :span="1/4"><div @click="cannot_in" style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/资产.png"/><p style="font-size:14px">资产管理</p></div></flexbox-item>
          <flexbox-item :span="1/4"><div @click="cannot_in" style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/跳蚤市场.png"/><p style="font-size:14px">跳蚤市场</p></div></flexbox-item>
          <flexbox-item :span="1/4"><div @click="cannot_in" style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/投诉.png"/><p style="font-size:14px">投诉建议</p></div></flexbox-item>
        </flexbox>
        <flexbox style="position:absolute;bottom:81px;" :gutter="0" wrap="wrap" v-else>
          <flexbox-item :span="1/4"><router-link :to="{path:'area_index'}"><div style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/会所.png"/><p style="font-size:14px">会所</p></div></router-link></flexbox-item>
          <flexbox-item :span="1/4"><router-link :to="{path:'key_manage'}"><div style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/钥匙管理.png"/><p style="font-size:14px">钥匙管理</p></div></router-link></flexbox-item>
          <flexbox-item :span="1/4"><router-link :to="{path:'wz_bj',query:{route_type:1}}"><div style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/保洁.png"/><p style="font-size:14px">专业保洁</p></div></router-link></flexbox-item>
          <flexbox-item :span="1/4"><router-link :to="{path:'notice_list'}"><div style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/公告.png"/><p style="font-size:14px">公告</p></div></router-link></flexbox-item>
          <flexbox-item :span="1/4"><router-link :to="{path:'wz_bj',query:{route_type:2}}"><div style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/微装.png"/><p style="font-size:14px">微装</p></div></router-link></flexbox-item>
          <flexbox-item :span="1/4"><router-link :to="{path:'house_info'}"><div style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/资产.png"/><p style="font-size:14px">资产管理</p></div></router-link></flexbox-item>
          <flexbox-item :span="1/4"><router-link :to="{path:'market_index'}"><div style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/跳蚤市场.png"/><p style="font-size:14px">跳蚤市场</p></div></router-link></flexbox-item>
          <flexbox-item :span="1/4"><router-link :to="{path:'ts_bs/2'}"><div style="text-align: center;padding:10px;"><img :style="icon_style" src = "../common/img/投诉.png"/><p style="font-size:14px">投诉建议</p></div></router-link></flexbox-item>
        </flexbox>
        <div style="text-align: center;border-top: 1px solid rgba(197, 193, 193, 1);position:absolute;left:0;bottom:0;right:0;">
          <span class="vux-close"></span>
        </div>
      </div>
    </popup>
    <tabbar>
        <tabbar-item selected >
          <img slot="icon" src="../common/img/home_choose.png">
          <span slot="label">首页</span>
        </tabbar-item>
        <div style="width:55px;height:55px;border-radius:50%;margin-top:-11px;z-index:10000;text-align: center" @click="showMore"><img style="width:100%;height:100%;" src = "../common/img/flower.png"/></div>
        <tabbar-item link="user_self">
          <img slot="icon" src="../common/img/my.png">
          <span slot="label">个人中心</span>
        </tabbar-item>
      </tabbar>
    <alert v-model="confirm_show" :title="dialog_title"> {{content}}</alert>
    </div>
</template>

<script>

  import loading from '@/components/loading/dataLoading';
  import Scroller from '@/components/scroller_me/scroller';
  import {setTitle} from '@/common/js/common';
  import {Swiper,SwiperItem,Cell,Actionsheet,Tabbar, TabbarItem,Group,Popup,Flexbox,FlexboxItem,Alert} from 'vux'

  export default{
      data(){
          return{
            loading:true,
            demo06_list:[],
            demo06_index:0,
            ac_show:false,
            fruit:'banana',
            currentEstate:'',
            currentHouse:'',
            options:[],
            this_options:[],
            popup_model:false,
            identity:0,
            fresh_news:[],
            fresh_len:0,
            this_year:"",
            this_month:"",
            this_day:"",
            this_week:"",
            confirm_show:false,
            dialog_title:"",
            content:""
          }
      },
      components:{
          loading,Swiper,SwiperItem,Cell,Actionsheet,Tabbar, TabbarItem,Group,Popup,Flexbox,FlexboxItem,Alert
      },
      methods:{
        showMore(){
            this.popup_model=true;
        },
        demo06_onIndexChange (index) {
          this.demo06_index = index
        },
        showActionsheet(){
          this.ac_show=true;
        },
        //切换当前所在房产
        click_option(key){
          this.$http.get(service_url+"/o2o/common/wx/reg/rephouse?houseid="+key).then((data)=>{
            userProfile  = data.body.userProfile;
          });
          for(let i in this.this_options){
            if(this.this_options[i].key==key){        //item 表示Json串中的属性，如'name'
              this.currentEstate=this.this_options[i].estate;
              this.currentHouse=this.this_options[i].house;
            }
          }
        },
        go_bsbx(){
          if(this.identity===1){
            this.cannot_in();
          }else{
            this.$router.push({
              path:'ts_bs/1'
            })
          }
        },
        go_jf(){
          if(this.identity===1){
              this.cannot_in();
          }else{
              this.$router.push({
                path:'my_paylist/1'
              })
          }
        },
        go_pzsh(){
          this.$router.push({
            path:'goods_index'
          })
        },
        go_smkm(){
          if(this.identity===1){
            this.cannot_in();
          }else {
            this.$router.push({
              path: 'my_code'
            })
          }
        },
        go_fkyq(){
          if(this.identity===1){
            this.cannot_in();
          }else {
            this.$router.push({
              path: 'invite_guest'
            })
          }
        },
        cannot_in(){
          this.dialog_title="提示";
          this.content="请先在个人中心-房产管理中去绑定房产";
          this.confirm_show=true;
        },
        /*当前时间的规则，小于1小时都算分钟，小于24小时大于一小时都算小时，大于24小时算天*/
        getFresh(time){
//          let this_time =this.getLocalTime1(time);
//          console.log(this_time);
          let s1= parseInt(time+"000"),
          s2 = new Date(),
          runTime = parseInt((s2.getTime() - s1) / 1000);
          let year = Math.floor(runTime / 86400 / 365);
          runTime = runTime % (86400 * 365);
          let month = Math.floor(runTime / 86400 / 30);
          runTime = runTime % (86400 * 30);
          let day = Math.floor(runTime / 86400);
          runTime = runTime % 86400;
          let hour = Math.floor(runTime / 3600);
          runTime = runTime % 3600;
          let minute = Math.floor(runTime / 60);
          runTime = runTime % 60;
          if(year>0){
              return year+"年前";
          }else{
              if(month>0){
                  return month+"月前";
              }else{
                  if(day>0){
                      return day+"天前";
                  }else{
                      if(hour>0){
                          return hour+"小时前";
                      }else{
                          if(minute>0){
                              return minute+"分钟前";
                          }else{
                              return "刚刚";
                          }
                      }
                  }
              }
          }
        },
        getLocalTime1(nS) {
          return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,17)},
        go_link(url,id){
            if(service_url){
                if(url){
                  this.$http.get(service_url+"/o2o/notice/wx/gclick?nid="+id).then(data=>{
                    if(data.body.statusCode==="ok"){
                      window.location.href=url;
                    }
                  })
                }

            }else{
              window.location.href=url;
            }
        }
      },
      computed:{
        imageurl(){
          return {"height":(document.body.clientWidth-6)/4+"px"}
        },
        imageradius(){
            return {
                "width":(document.body.clientWidth)*0.356+"px",
                "height":(document.body.clientWidth)*0.356+"px",
                "margin-top":-((document.body.clientWidth)*0.356+6)/2+"px",
                "margin-left":-((document.body.clientWidth)*0.356+8)/2+"px"
            }
        },
        fkyqStyle(){
          return{
              "width":35*(document.body.clientWidth)/414+"px",
              "height":35*(document.body.clientWidth)/414+"px",
              "left":51.5*(document.body.clientWidth)/414+"px",
              "top":17*(document.body.clientWidth)/414+"px",
          }
        },
        fkyqDiv(){
          return{
            "left":40*(document.body.clientWidth)/414+"px",
            "top":60*(document.body.clientWidth)/414+"px",
          }
        },
        bsbxStyle(){
          return{
            "width":47*(document.body.clientWidth)/414+"px",
            "height":35*(document.body.clientWidth)/414+"px",
            "right":45.5*(document.body.clientWidth)/414+"px",
            "top":17*(document.body.clientWidth)/414+"px",
          }
        },
        bsbxDiv(){
          return{
            "right":40*(document.body.clientWidth)/414+"px",
            "top":60*(document.body.clientWidth)/414+"px",
          }
        },
        pzshStyle(){
          return{
            "width":40*(document.body.clientWidth)/414+"px",
            "height":40*(document.body.clientWidth)/414+"px",
            "right":49.5*(document.body.clientWidth)/414+"px",
            "top":17*(document.body.clientWidth)/414+"px",
          }
        },
        jfStyle(){
          return{
            "width":47*(document.body.clientWidth)/414+"px",
            "height":35*(document.body.clientWidth)/414+"px",
            "left":45.5*(document.body.clientWidth)/414+"px",
            "top":17*(document.body.clientWidth)/414+"px",
          }
        },
        jfDiv(){
          return{
            "left":40*(document.body.clientWidth)/414+"px",
            "top":60*(document.body.clientWidth)/414+"px",
          }
        },
        smkmStyle(){
          return{
            "width":40.5*(document.body.clientWidth)/414+"px",
            "height":40*(document.body.clientWidth)/414+"px",
            "left":55*(document.body.clientWidth)/414+"px",
            "top":40*(document.body.clientWidth)/414+"px",
          }
        },
        smkmDiv(){
          return{
            "margin-left":-((document.body.clientWidth)*0.356/2)+"px",
            "width":(document.body.clientWidth)*0.356+"px",
          }
        },
        swiper_height(){
            return (document.body.clientWidth)/75*31+"px"
        },
        sqhd_rate(){
            return{
              "height":(document.body.clientWidth)/69*34+"px",
              "width":"100%",
              "object-fit":"cover"
            }
        },
        sqhd_2_rate(){
          return{
            "width":(document.body.clientWidth-40)/2+"px",
            "height":(document.body.clientWidth-40)/2+"px",
            "margin-right":"5px"
          }
        },
        xxs_rate(){
            return{
                "width":(document.body.clientWidth-45)/3+"px",
                "height":(document.body.clientWidth-45)/3+"px",
                "margin-right":"5px"
            }
        },
        xxsa_rate(){
          return{
            "width":document.body.clientWidth-35+"px",
            "height":(document.body.clientWidth-30)/1.916+"px",
          }
        },
        icon_style(){
            return{
                "width":document.body.clientWidth*0.15+"px",
                "height":document.body.clientWidth*0.15+"px",
            }
        }
      },
      mounted(){
          /*会导致其他页面也刷新所以不能用*/
//        window.onresize=function(){
//          location.reload()
//        };
//        document.getElementById("index_loading").style.display="none";
        let oDate = new Date();
        this.this_year=oDate.getFullYear();
        this.this_month=oDate.getMonth()+1;
        this.this_day=oDate.getDate();
        let this_a = new Array("日", "一", "二", "三", "四", "五", "六");
        let week = oDate.getDay();
        this.this_week=this_a[week];
        if((userProfile.atype===2)&&(userProfile.isreg===0)){
          this.identity = 1;//游客
        }
        setTitle("首页v2.0.4");
        let self = this;
        if(service_url){
          this.$http.get(service_url+"/o2o/common/wx/getIndex?pageno=1&pagesize=10").then((data)=>{
            if(data.body.status===0){
                self.currentEstate=data.body.current_option.estate;
                self.currentHouse=data.body.current_option.house;

              let this_options = data.body.options;
              let json_options={};
              for(let i =0;i<this_options.length;i++){
                json_options[this_options[i].key]=this_options[i].estate+this_options[i].house;
              }
              self.options=json_options;
              self.this_options=this_options;

              self.fresh_news = data.body.fresh_news;
              self.fresh_len = data.body.fresh_news.length;
              for(let i=0;i<self.fresh_news.length;i++){

                  self.fresh_news[i].fresh_time=this.getFresh(self.fresh_news[i].published_time);
              }
            }else{
              this.dialog_title="提示";
              this.content=data.body.error_reason;
              this.confirm_show=true;
            }
          })
        }else{
          this.$http.get('/api/qj_index').then((data) => {
            let this_options = data.body.data.options;
            let json_options={};
            for(let i =0;i<this_options.length;i++){
              json_options[this_options[i].key]=this_options[i].estate+this_options[i].house;
            }
            self.options=json_options;
            self.this_options=this_options;
            self.currentEstate=data.body.data.current_option.estate;
            self.currentHouse=data.body.data.current_option.house;
            self.fresh_news = data.body.data.fresh_news;
            self.fresh_len = data.body.data.fresh_news.length;
            for(let i=0;i<self.fresh_news.length;i++){
              self.fresh_news[i].fresh_time=this.getFresh(self.fresh_news[i].published_time);
            }
          });
        }
        if(service_url){
          this.$http.get(service_url+"/o2o/notice/wx/newsIndex?ntype=2&sum=5&itemid=6").then((data)=>{
            /*let newsIndex = data.body.data;
            for(let i in newsIndex){
              this.demo06_list.push(newsIndex[i].picture);
            }*/
            this.demo06_list = data.body.data;
          })
        }else{
          this.$http.get("/api/newsIndex").then((data)=>{
            /*let newsIndex = data.body.data.data;
            for(let i in newsIndex){
              this.demo06_list.push(newsIndex[i].picture);
            }*/
            this.demo06_list=data.body.data.data;
          })
        }
        document.getElementById("index_loading").style.display="none";
      }

  }
</script>

<style scoped>
  .header{
    background-color:#4e4f4f;
    padding:10px 15px;
  }
  select{
    border: 0px;
    border: none;
    outline:none;
  }
  .arrow {
    display: block;
    border-width: 5px 5px 0;
    border-style: solid;
    border-right-color: transparent;
    border-left-color: transparent;
    width: 0;
    height: 0;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    -webkit-transform: rotateZ(0);
    transform: rotateZ(0);
    color:#fdd24d;
  }
  .f_flex{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .common{
    flex:1;
    position:relative;
    display:inline-block;
    margin-bottom:-2px;
  }
  .fkyq{
    background-color:#fbcc5c;
  }
  .fkyq:active{
    background-color:#b99849;
  }
  .jf{
    background-color:#65e2e7;
  }
  .jf:active{
    background-color:#479da0;
  }
  .bsbx{
    background-color:#fe8e8e;
  }
  .bsbx:active{
    background-color:#b56262;
  }
  .pzsh{
    background-color:#ad7de7;
  }
  .pzsh:active{
    background-color: #735892;
  }
  .znkm{
    position:absolute;
    left:50%;
    top:50%;
    border:4px solid white;
    background-color:#6ccafd;
    border-radius:50%;
  }
  .znkm:active{
    background-color:#0f96c3;
  }
  .posa{
    position:absolute;
  }
  .color_white{
    color:white;
  }
  .margin_right{
    margin-right:4px;
  }
  .sm{
    left:50%;
    top:58%;
    text-align:center;
  }
  .vux-close{
    margin-top: 8px;
    margin-bottom: 8px;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    color: #999;
    width: 24px;
    height: 24px;
  }
  .vux-close:before{
    content: '';
    position: absolute;
    left: 0;
    top: 11px;
    width: 24px;
    height: 1px;
    background-color: currentColor;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .vux-close:after{
    content: '';
    position: absolute;
    left: 0;
    top: 11px;
    width: 24px;
    height: 1px;
    background-color: currentColor;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .fresh_news{
    text-align: center;
    color:#ad7de7;
    margin-top:10px;
    position:relative;
  }
  .fresh_news:before{
    content: '';
    position: absolute;
    width: 30px;
    height: 1px;
    background-color: #979797;
    top: 12px;
    left: -38px;
  }
  .line_show{
    content: '';
    position: absolute;
    width: 30%;
    height: 1px;
    top: 20px;
    left: 16px;
    background: #ad7de7;
  }
  .line_show_n{
    content: '';
    position: absolute;
    width: 30%;
    height: 1px;
    top: 20px;
    right: 16px;
    background: #ad7de7;
  }
  .object_fit{
    width:100%;
    height:100%;
    object-fit:cover;
  }
</style>

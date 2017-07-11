<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div style="padding-bottom:48px;">
      <header class="text-center this_header">
        <div>
          <div class="img_circle img_circle_border avatar"><img :src="pic" class="img_circle"/></div>
          <div class="ellipsis"><h4>{{user_name}}</h4></div>
          <div class="ellipsis"><p>{{current_address}}</p></div>
        </div>
      </header>
      <div style="background-color:white;">
        <flexbox :gutter="0" style="border-bottom:1px solid #ececec;">
          <flexbox-item @click.native="go_paylist" :span="1/2"><div class="flex_1_2" style="border-right:1px solid #ececec;"><p style="font-size:20px;color:red;margin-bottom:-5px;">{{arrearage?arrearage:0}}</p><p>欠费</p></div></flexbox-item>
          <flexbox-item @click.native="go_wallet" :span="1/2"><div class="flex_1_2"><p style="font-size:20px;margin-bottom:-5px;">{{extra_money?extra_money:0}}</p><p>余额</p></div></flexbox-item>
        </flexbox>
        <flexbox :gutter="0">
          <flexbox-item style="border-right:1px solid #ececec;" :span="1/4"><div @click="go_service" class="flex_1_2"><div style="position:relative;display: inline-block"><img style="height:28px" src="../common/img/my_service.png"/><sup class="this_sup" v-if="new_service!==0"><span class="vux-badge vux-badge-single">{{new_service}}</span></sup></div><p style="font-size:14px;">我的服务</p></div></flexbox-item>
          <flexbox-item style="border-right:1px solid #ececec;" :span="1/4"><div @click="go_orderlist" class="flex_1_2"><div style="position:relative;display: inline-block"><img style="height:28px" src="../common/img/my_orderlist.png"/><sup class="this_sup" v-if="new_order!==0"><span class="vux-badge vux-badge-single">{{new_order}}</span></sup></div><p style="font-size:14px;">我的订单</p></div></flexbox-item>
          <flexbox-item style="border-right:1px solid #ececec;" :span="1/4"><div @click="go_published" class="flex_1_2"><div style="position:relative;display: inline-block"><img style="height:28px" src="../common/img/my_published.png"/><sup class="this_sup" v-if="new_publish!==0"><span class="vux-badge vux-badge-single">{{new_publish}}</span></sup></div><p style="font-size:14px;">我的发布</p></div></flexbox-item>
          <flexbox-item style="border-right:1px solid #ececec;" :span="1/4"><div @click="go_store" class="flex_1_2"><div style="position:relative;display: inline-block"><img style="height:28px" src="../common/img/my_store.png"/><sup class="this_sup" v-if="new_storeup!==0"><span class="vux-badge vux-badge-single">{{new_storeup}}</span></sup></div><p style="font-size:14px;">购物车</p></div></flexbox-item>
        </flexbox>
      </div>
      <group gutter="10px" v-if="identity===1">
        <cell title="我的关注" @click.native="cannot_in" is-link><img slot="icon" width="20" style="display:block;margin-right:5px;" src="../common/img/star.png"></cell>
        <cell title="房产管理" :link="{path:'housemanage'}" is-link><img slot="icon" width="20" style="display:block;margin-right:5px;" src="../common/img/house.png"></cell>
        <cell title="我的钱包" @click.native="cannot_in" is-link><img slot="icon" width="20" style="display:block;margin-right:5px;" src="../common/img/my_wallet.png"></cell>
        <cell title="我的账单" @click.native="cannot_in" is-link><img slot="icon" width="20" style="display:block;margin-right:5px;" src="../common/img/my_paylist.png"></cell>
        <cell title="个人资料" @click.native="cannot_in" is-link><img slot="icon" width="20" style="display:block;margin-right:5px;" src="../common/img/personal.png"></cell>
        <cell title="个人消息" @click.native="cannot_in" is-link><img slot="icon" width="20" style="display:block;margin-right:5px;" src="../common/img/message.png"></cell>
      </group>
      <group gutter="10px" v-else>
        <cell title="我的关注" :link="{path:'goods_collect'}" is-link><img slot="icon" width="20" style="display:block;margin-right:5px;" src="../common/img/star.png"></cell>
        <cell title="房产管理" :link="{path:'housemanage'}" is-link><img slot="icon" width="20" style="display:block;margin-right:5px;" src="../common/img/house.png"></cell>
        <cell title="我的钱包" :link="{path:'my_wallet'}" is-link><img slot="icon" width="20" style="display:block;margin-right:5px;" src="../common/img/my_wallet.png"></cell>
        <cell title="个人资料" :link="{path:'personal_profile'}" is-link><img slot="icon" width="20" style="display:block;margin-right:5px;" src="../common/img/personal.png"></cell>
        <cell title="个人消息" :link="{path:'my_message'}" is-link><img slot="icon" width="20" style="display:block;margin-right:5px;" src="../common/img/message.png"></cell>
      </group>
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
        <tabbar-item link="index">
          <img slot="icon" src="../common/img/home_page.png">
          <span slot="label">首页</span>
        </tabbar-item>
        <div style="width:55px;height:55px;border-radius:50%;margin-top:-11px;z-index:10000;text-align: center" @click="showMore"><img style="width:100%;height:100%;" src = "../common/img/flower.png"/></div>
        <tabbar-item link="user_self" selected>
          <img slot="icon" src="../common/img/choose_user.png">
          <span slot="label">个人中心</span>
        </tabbar-item>
      </tabbar>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{content}}</alert>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {Group,Cell,Tabbar, TabbarItem,Flexbox, FlexboxItem,Popup,Alert} from 'vux'

  export default{
    data(){
      return{
        loading:true,
        popup_model:false,
        identity:0,
        data:[],
        user_name:"",
        pic:"",
        current_address:"",
        extra_money:"",
        arrearage:"",
        new_service:"",
        new_order:"",
        new_publish:"",
        new_storeup:"",
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
      loading,Cell,Tabbar, TabbarItem,Group,Flexbox, FlexboxItem,Popup,Alert
    },
    computed:{
      icon_style(){
        return{
          "width":document.body.clientWidth*0.15+"px",
          "height":document.body.clientWidth*0.15+"px",
        }
      }
    },
    mounted(){
      setTitle("个人中心");
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
      this.getdata();
    },
    methods:{
      go_paylist(){
        this.$router.push({path:"my_paylist/2"});
      },
      showMore(){
        this.popup_model=true;
      },
      go_service(){
        this.$router.push({
          path:'my_service'
        })
      },
      go_orderlist(){
        this.$router.push({path:'common_order/0',})
      },
      go_published(){
        this.$router.push({path:'my_published'})
      },
      go_store(){
        this.$router.push({path:'store_up',query: {type:2}})
      },
      cannot_in(){
        this.dialog_title="提示";
        this.content="请先在个人中心-房产管理中去绑定房产";
        this.confirm_show=true;
      },
      getdata(){
          let self = this;
          if(service_url){
            this.$http.get(service_url+"/o2o/common/wx/myinfo").then((data)=>{
              self.user_name=data.body.data.name.val;
              self.pic=data.body.data.pic;
            });
            this.$http.get(service_url+"/o2o/common/wx/user_info").then((data)=>{
                if(data.body.status===0){
                  self.current_address=data.body.current_address;
                  self.extra_money=data.body.extra_money?data.body.extra_money:0;
                  self.arrearage=data.body.arrearage;
                  self.new_service=data.body.new_service;
                  self.new_order=data.body.new_order;
                  self.new_publish=data.body.new_publish;
                  self.new_storeup=data.body.new_storeup;
                }else{
                  this.dialog_title="提示";
                  this.content=data.body.error_reason;
                  this.confirm_show=true;
                }
            })
          }else{
            this.$http.get("/api/myinfo").then((data)=>{
              self.user_name=data.body.data.data.name.val;
              self.pic=data.body.data.data.pic;
            });
            this.$http.get("/api/user_info").then((data)=>{
              self.current_address=data.body.data.data.current_address;
              self.extra_money=data.body.data.data.extra_money;
              self.arrearage=data.body.data.data.arrearage;
              self.new_service=data.body.data.data.new_service;
              self.new_order=data.body.data.data.new_order;
              self.new_publish=data.body.data.data.new_publish;
              self.new_storeup=data.body.data.data.new_storeup;
            })
          }
        document.getElementById("index_loading").style.display="none";
      },
      go_wallet(){
          this.$router.push({path:"my_wallet"})
      }
    }
  }
</script>

<style scoped>
  .text-center{
    text-align: center;
  }
  .this_header{
    color:white;
    position:relative;
    padding: 0.5em 0;
    border-bottom:1px solid #ececec;
    background: url(../common/img/bg.png) center center / cover no-repeat rgb(106, 73, 109);
  }
  .avatar{
    margin:0 auto;
  }
  .avatar img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .img_circle{
    border-radius: 50%;
  }
  .img_circle_border{
    margin-top: 10px;
    width: 80px;
    height: 80px;
    border: 4px solid rgba(255, 255, 255, 0.498039);
  }
  .ellipsis{
    text-overflow: ellipsis;
  }
  .ellipsis p{
    font-size:.8em;
  }
  .flex_1_2{
    margin:10px 0 ;
    text-align: center;
  }
  .this_sup{
    position: absolute;
    top: -15px;
    left: 100%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    z-index: 101;
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

</style>

<template>
  <div id="qj_index">
    <v-loading v-if="loading"></v-loading>
    <div v-else>
      <div>
        <h2>品质生活</h2>
        <router-link to="/goods_index">首页</router-link>
        <router-link :to="{path:'common_order',query:{route_type:3}}">订单</router-link>
        <router-link :to="{path:'goods_order_list',query: {type:2}}">收藏夹</router-link>
        <router-link :to="{path:'store_up',query: {type:2}}">购物车</router-link>
      </div>
      <div>
        <h2>跳蚤市场</h2>
        <router-link :to="{path:'market_index'}">首页</router-link>
        <router-link :to="{path:'market_detail',query:{goods_id:1}}">商品详情</router-link>
        <router-link :to="{path:'market_list'}">尝试使用lrc</router-link>
        <router-link :to="{path:'add_market_goods',query:{enter_type:1}}">发布商品</router-link>
        <router-link :to="{path:'my_published'}">我的发布</router-link>
        <router-link :to="{path:'market_list'}">我的商品数据</router-link>
      </div>
      <div>
        <h2>场馆会所</h2>
        <router-link :to="{path:'area_index'}">首页</router-link>
        <router-link :to="{path:'area_detail'}">详情</router-link>
        <router-link :to="{path:'area_choose'}">选择场地</router-link>
        <router-link :to="{path:'area_reserve',query:{route_type:1}}">预约</router-link>
        <router-link :to="{path:'common_order',query:{route_type:0}}">订单</router-link>
        <router-link :to="{path:'area_reserve',query:{route_type:2}}">预订详细</router-link>
        <router-link :to="{path:'area_evaluate',query:{route_type:1}}">评价</router-link>
        <router-link :to="{path:'area_evaluate',query:{route_type:2}}">查看评价</router-link>
        <button @click = "test">测试</button>
      </div>
      <div>
        <h2>报事报修</h2>
        <router-link :to="{path:'ts_bs',query:{type:1}}">首页</router-link>
        <router-link :to="{path:'my_service'}">我的服务</router-link>
        <router-link :to="{path:'service_detail'}">服务详情</router-link>
      </div>
      <div>
        <h2>投诉建议</h2>
        <router-link :to="{path:'ts_bs',query:{type:2}}">首页</router-link>
      </div>
      <div>
        <h2>公告信息</h2>
        <router-link :to="{path:'enroll',query:{notice_id:1}}">报名</router-link>
        <router-link :to="{path:'notice_detail',query:{notice_id:1}}">公告详情</router-link>
        <router-link :to="{path:'notice_list'}">公告列表</router-link>
      </div>
      <div>
        <h2>门禁</h2>
        <router-link :to="{path:'key_manage'}">钥匙管理</router-link>
      </div>
      <div>
        <h2>收房验房</h2>
        <router-link :to="{path:'market_index'}">首页</router-link>
      </div>
      <div>
        <h2>测试的一些东西</h2>
        <router-link :to="{path:'index'}">首页</router-link>
        <router-link :to="{path:'card_switch'}">滑动</router-link>
        <router-link :to="{path:'common_order',query:{route_type:3}}">订单</router-link>
        <router-link :to="{path:'test_upload'}">订单</router-link>
      </div>
    </div>
    <tabbar>
      <tabbar-item link="/">
        <img slot="icon" src="">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item badge="2" link="user_self">
        <img slot="icon" src="">
        <span slot="label">个人中心</span>
      </tabbar-item>
      <tabbar-item badge="2" selected >
        <img slot="icon" src="">
        <span slot="label">测试</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script type="text/ecmascript-6">
  import loading from '@/components/loading/dataLoading'
  import {Tabbar, TabbarItem} from 'vux'

  export default{
    name:'index',
    components:{
      'v-loading': loading, Tabbar, TabbarItem
    },
    data () {
      return {
        loading: true,
      }
    },
    mounted(){
      /*this.$http.get(service_url+'/api/seller').then( ()=> {
        console.log(1);
      },()=>{
        console.log(2);
      });*/
     /* this.$http.get(service_url+'/o2o/shop/wx/indexgetcode.do').then( (data)=> {
        console.log(data);
      });
      */
      this.loading=false;
    },
    methods:{
        test(){
            console.log(service_url+"/o2o/club/wx/login");
            this.$http.get(service_url+"/o2o/club/wx/login").then((data)=>{
                console.log(data);
            })
        }
    }
  }
</script>

<style>

</style>

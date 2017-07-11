import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-resource'
import FastClick from 'fastclick'
/*import Hello from '@/components/Hello'
import One from '@/project/demo/one.vue'
import Second from '@/project/demo/second.vue'*/

Vue.use(Router);
Vue.use(VueRouter);

const routes = [
  {   //当首次进入页面时，页面没有显示任何组件；让页面一加载进来就默认显示first页面
    path:'/qj_index', //重定向，就是给它重新指定一个方向，加载一个组件；
    component:resolve => require(['@/project/qj_index'],resolve)
  },
  /*品质生活*/
  {
    path:'/goods_index',
    component:resolve => require(['@/project/pzsh/goods_index'],resolve)
  },{
    path:'/store_detail',
      component:resolve => require(['@/project/pzsh/store_detail'],resolve)
  },{
    path:'/goods_detail',
      component:resolve => require(['@/project/pzsh/goods_detail'],resolve)
  },{
    path:'/goods_order',
      component:resolve => require(['@/project/pzsh/goods_order'],resolve)
  },{
    path:'/store_up',
      component:resolve => require(['@/project/pzsh/store_up'],resolve)
  },{
    path:'/goods_collect',
      component:resolve => require(['@/project/pzsh/goods_collect'],resolve)
  },{
    path:'/goods_evaluate',
      component:resolve => require(['@/project/pzsh/goods_evaluate'],resolve)
  },{
    path:'/store_detail',
      component:resolve => require(['@/project/pzsh/store_detail'],resolve)
  },
/*跳蚤市场*/
  {
  path:'/market_index',
    component:resolve => require(['@/project/tzsc/market_index'],resolve)
  },{
  path:'/market_detail',
    component:resolve => require(['@/project/tzsc/market_detail'],resolve)
  },{
  path:'/market_list',
    component:resolve => require(['@/project/tzsc/market_list'],resolve)
  },{
  path:'/add_market_goods',
    component:resolve => require(['@/project/tzsc/add_market_goods'],resolve)
  },{
  path:'/my_published',
    component:resolve => require(['@/project/tzsc/my_published'],resolve)
  },{
  path:'/market_list',
    component:resolve => require(['@/project/tzsc/market_list'],resolve)
  },
/*投诉建议，报事报修*/
  {
  path:'/ts_bs/:type',
    component:resolve => require(['@/project/ts_bs/ts_bs'],resolve)
  },{
  path:'/my_service',
    component:resolve => require(['@/project/ts_bs/my_service'],resolve)
  },{
  path:'/service_detail',
    component:resolve => require(['@/project/ts_bs/service_detail'],resolve)
  },
/*公告广告*/
  {
  path:'/notice_detail',
    component:resolve => require(['@/project/ggxx/notice_detail'],resolve)
  },{
  path:'/notice_list',
    component:resolve => require(['@/project/ggxx/notice_list'],resolve)
  },{
  path:'/enroll',
    component:resolve => require(['@/project/ggxx/enroll'],resolve)
  },
  /*首页*/
{
  path:'/',
    component:resolve => require(['@/project/index'],resolve)
},
  {
    path:'/index',
      component:resolve => require(['@/project/index'],resolve)
  },
/*会所场馆*/
  {
    path:'/area_index',
      component:resolve => require(['@/project/hscg/area_index'],resolve)
  },{
  path:'/area_detail',
    component:resolve => require(['@/project/hscg/area_detail'],resolve)
  },{
  path:'/area_choose',
    component:resolve => require(['@/project/hscg/area_choose'],resolve)
  },{
  path:'/area_reserve',
    component:resolve => require(['@/project/hscg/area_reserve'],resolve)
  },{
  path:'/card_switch',
    component:resolve => require(['@/components/card_switch/card_switch'],resolve)
}
,{
  path:'/common_order/:route_type',
    component:resolve => require(['@/project/common/goods_order_list'],resolve)
},{
  path:'/user_self',
    component:resolve => require(['@/project/user_self'],resolve)
},{
  path:'/reserve_success',
    component:resolve => require(['@/project/hscg/reserve_success'],resolve)
},{
  path:'/area_evaluate',
    component:resolve => require(['@/project/hscg/area_evaluate'],resolve)
},{
  path:'/code_share',
    component:resolve => require(['@/project/door/code_share'],resolve)
},{
  path:'/invite_guest',
    component:resolve => require(['@/project/door/invite_guest'],resolve)
},{
  path:'/key_manage',
    component:resolve => require(['@/project/door/key_manage'],resolve)
},{
  path:'/my_code',
    component:resolve => require(['@/project/door/my_code'],resolve)
},
/*房产管理*/
{
  path:'/housemanage',
    component:resolve => require(['@/project/fcgl/housemanage'],resolve)
},
/*个人中心*/
{
  path:'/personal_profile',
    component:resolve => require(['@/project/common/personal_profile'],resolve)
},{
  path:'/my_paylist/:type',
    component:resolve => require(['@/project/common/my_paylist'],resolve)
},{
    path:'/my_wallet',
    component:resolve => require(['@/project/common/my_wallet'],resolve)
  }
  ,{
    path:'/my_message',
    component:resolve => require(['@/project/common/my_message'],resolve)
  }
  ,{
    path:'/error',
    component:resolve => require(['@/project/common/error'],resolve)
  },{
    path:'/test_upload',
    component:resolve => require(['@/project/demo/test_upload'],resolve)
  },{
    path:'/register',
    component:resolve => require(['@/project/common/register'],resolve)
  },
  /*微装保洁*/
  {
    path:'/wz_bj',
    component:resolve => require(['@/project/wz_bj/wz_bj'],resolve)
  },{
    path:'/wb_detail',
    component:resolve => require(['@/project/wz_bj/wb_detail'],resolve)
  },{
    path:'/wb_reserve',
    component:resolve => require(['@/project/wz_bj/wb_reserve'],resolve)
  },

  /*缴费*/
  {
    path:'/wallet_record',
    component:resolve => require(['@/project/common/wallet_record'],resolve)
  },{
    path:'/wallet_pay',
    component:resolve => require(['@/project/common/wallet_pay'],resolve)
  },{
    path:'/wallet_code',
    component:resolve => require(['@/project/common/wallet_code'],resolve)
  },{
    path:'/paylist_pay',
    component:resolve => require(['@/project/common/paylist_pay'],resolve)
  },{
    path:'/my_bankCardList',
    component:resolve => require(['@/project/common/my_bankCardList'],resolve)
  },{
    path:'/binding_card',
    component:resolve => require(['@/project/common/binding_card'],resolve)
  },{
    path:'/bill_page',
    component:resolve => require(['@/project/common/bill_page'],resolve)
  },{
    path:'/open_wallet',
    component:resolve => require(['@/project/common/open_wallet'],resolve)
  },{
    path:'/Alipay',
    component:resolve => require(['@/project/common/Alipay'],resolve)
  },

/*资产管理*/
  {
    path:'/device_info',
    component:resolve => require(['@/project/zcgl/device_info'],resolve)
  },{
    path:'/house_info',
    component:resolve => require(['@/project/zcgl/house_info'],resolve)
  }
  ,{
    path:'/12',
    component:resolve => require(['@/project/demo/12'],resolve)
  }
//这里require组件路径根据自己的配置引入
];

FastClick.attach(document.body);

const router = new Router({
  routes,
});

export default router;


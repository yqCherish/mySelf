import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-resource'
/*import Hello from '@/components/Hello'
import One from '@/project/demo/one.vue'
import Second from '@/project/demo/second.vue'*/

Vue.use(Router);
Vue.use(VueRouter);

const routes = [
  {   //当首次进入页面时，页面没有显示任何组件；让页面一加载进来就默认显示first页面
    path:'/', //重定向，就是给它重新指定一个方向，加载一个组件；
    component:resolve => require(['@/project/qj_index'],resolve)
  },
  {
    path:'/goods_index',
    component:resolve => require(['@/project/pzsh/goods_index'],resolve)
  },
  {
    path:'/user_self',
    component:resolve => require(['@/project/pzsh/user_self'],resolve)
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
    path:'/goods_order_list',
      component:resolve => require(['@/project/pzsh/goods_order_list'],resolve)
  },{
    path:'/goods_evaluate',
      component:resolve => require(['@/project/pzsh/goods_evaluate'],resolve)
  },{
    path:'/store_detail',
      component:resolve => require(['@/project/pzsh/store_detail'],resolve)
  }
//这里require组件路径根据自己的配置引入
];

const router = new Router({
  routes
});

export default router;


<template>
  <div id="qj_index">
    <v-loading v-if="loading"></v-loading>
    <div v-else>
      <router-link to="/goods_index">品质生活首页</router-link>
      <router-link to="/user_self">个人中心</router-link>
      <router-link to="/goods_order">订单</router-link>
      <router-link :to="{path:'goods_order',query: {type:1}}">订单支付</router-link>
      <router-link :to="{path:'goods_order',query: {type:2}}">订单详情</router-link>
      <router-link :to="{path:'goods_order_list',query: {type:1}}">订单列表</router-link>
      <router-link :to="{path:'goods_order_list',query: {type:2}}">收藏夹</router-link>
      <router-link :to="{path:'store_up',query: {type:2}}">购物车</router-link>
      <router-link :to="{path:'goods_evaluate',query: {type:2}}">评价</router-link>
      <router-link to="/store_detail">商铺详情</router-link>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import loading from '@/components/loading/dataLoading'

  export default{
    name:'index',
    components:{
      'v-loading': loading
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
      this.loading=false;
    }
  }
</script>

<style>

</style>

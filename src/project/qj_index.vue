<template>
  <div id="qj_index">
    <v-loading v-if="loading"></v-loading>
    <div v-else>
      <router-link to="/goods_index">首页</router-link>
      <router-link :to="{path:'goods_order_list',query: {type:1}}">订单列表</router-link>
      <router-link :to="{path:'goods_order_list',query: {type:2}}">收藏夹</router-link>
      <router-link :to="{path:'store_up',query: {type:2}}">购物车</router-link>
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

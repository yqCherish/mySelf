<template>
  <div>
      <load-more v-if="goodslist.length===0" :show-loading="false" tip="暂无收藏数据" background-color="#efeff4"></load-more>
      <div v-for="item in goodslist" :key="item">
        <group gutter="10px">
            <div @click="go_store(item.store_id)" style="padding:10px 15px;border-bottom:1px solid #ececec;">{{item.store_name}}</div>
            <goods-show :goods="item.goods" :type="this_type" @on-click-menu="delCollect" :path="path"></goods-show>
        </group>
      </div>

  </div>
</template>

<script>
  import goodsShow from '@/project/pzsh/goods_show';
  import loading from '@/components/loading/dataLoading';
  import { Cell, Group, XInput, XButton, LoadMore} from 'vux';
  import {setTitle} from '@/common/js/common';
  export default{
    name: 'goods_collect',
    components:{
      goodsShow,loading, Group,XButton,LoadMore,Cell
    },
    data(){
      return{
        goodslist:[],
        this_type:'',
        path:'goods_detail'
      }
    },
    mounted(){
      setTitle("我的收藏");
      let self = this;
      this.this_type='3';
      if(service_url){
        this.$http.get(service_url+'/o2o/shop/wx/collection/selectgoods.do').then( (data)=> {
          if(data.body.status===0){
            self.goodslist=data.body.fields.orders;
          }else{
            alert("错误")
          }
        });
      }else{
        this.$http.get('/api/goodsOrderList').then((data) => {
          self.goodslist=data.body.data;
        });
      }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      go_store(id){
          console.log(id);
        this.$router.push({path:'store_detail',query: {store_id:id}})
      },
      /*goToPay(ordernum){
        this.$router.push({ path: '/goods_order',query:{"type":1,"ordernum":ordernum} });
      },
      checkGoodsIn(ordernum){
        const senddata={
          "data":{
            "ordernum":ordernum,
//            "pay_price":50
          }
        };
        this.$http.post(service_url+'/o2o/shop/wx/toconfirmorder.do',senddata).then( (data)=> {
          if(data.body.status===0){
            alert("收货成功");
            for(let i=0;i<goodslist.length;i++){
              if(ordernum===goodslist[i].ordernum){
                goodslist[i].state="已收货";
              }
            }
          }else{
            alert(data.body.fields.error_reason);
          }
        })
      },*/
      delCollect(key){
          let self=this;
        const collectdata={
          "data":{
            goodsid:key
          }
        };
        this.$http.post(service_url+'/o2o/shop/wx/deletecollect.do',collectdata).then( (data)=> {
          if(data.body.status===0){
            alert("取消成功");
            for(let i=0;i<self.goodslist.length;i++){
                for(let j=0;j<self.goodslist[i].goods.length;j++){
                    if(key===self.goodslist[i].goods[j].goods_id){
                      self.goodslist[i].goods.splice(j,1);
                      if(self.goodslist[i].goods.length===0){
                          self.goodslist.splice(i,1);
                      }
                    }
                }
            }
          }else{
            alert(data.body.fields.error_reason);
          }
        });
      }
    }
  }
</script>

<style scoped>
  .text-right{
    text-align: right;
  }
  .float-right{
    float:right;
    font-size:14px;
  }
  .border_bottom_2{
    overflow: hidden;
    border-bottom: 1px solid #ececec;
    padding: 10px;
  }
  .border_bottom_1{
    border-bottom: 1px solid #ececec;
    padding: 5px 10px;
  }
</style>


<template>
  <div>
      <div v-for="item in goodslist" :key="item">
        <group>
          <div style="padding:10px;border-bottom:1px solid #ececec">{{item.store_name}}<span v-if="select_type===1" style="float:right;color:deepskyblue">{{item.this_state}}</span></div>
          <div>
            <goods-show :goods="item.goods" :type="this_type" @on-click-menu="delCollect"></goods-show>
          </div>
          <div v-if="select_type===1" style="margin:5px 10px 10px">
            <div v-if="item.this_state!=='已下单'" class="text-right">共{{item.totalnum}}件商品 合计：<strike>￥{{item.totalprices}}</strike><span style="margin-left:5px;color:red">￥{{item.totalprice}}</span></div>
            <div v-if="item.this_state==='已下单'" class="text-right">共{{item.totalnum}}件商品 合计：￥{{item.totalprices}}</div>
            <div v-if="item.this_state==='已确认'" class="text-right"><x-button mini plain @click.native="goToPay(item.ordernum)">去支付</x-button></div>
            <div v-if="item.this_state==='已发货'" class="text-right"><x-button mini plain @click.native="checkGoodsIn(item.ordernum)">确认收货</x-button></div>
            <div v-if="item.this_state==='已收货'" class="text-right"><x-button mini plain @click.native="goToEva(item.ordernum)">去评价</x-button></div>
            <div v-if="item.this_state==='已评价'" class="text-right"><x-button mini plain @click.native="seeEva(item.ordernum)">查看评价</x-button></div>
          </div>
        </group>
      </div>

  </div>
</template>

<script>
  import goodsShow from '@/project/pzsh/goods_show';
  import loading from '@/components/loading/dataLoading';
  import { Cell, Group, XInput, XButton } from 'vux'
  export default{
    name: 'store_up',
    components:{
      goodsShow,loading, Group,XButton
    },
    data(){
      return{
        loading:true,
        select_type:'',
        goodslist:[],
        this_type:'',
        goods_num:3,
        goods_price:31231
      }
    },
    mounted(){
      this.select_type = this.$route.query.type;
      /*type为1订单列表 2为收藏*/
      if(this.select_type===1){
        this.this_type='1';
        this.$http.get(service_url+'/o2o/shop/wx/orderlist.do').then( (data)=> {
          console.log(data);
          if(data.body.status===0){
            self.goodslist=data.body.fields.orders;
            for(let i=0;i<self.goodslist.length;i++){
              self.goodslist[i].this_state=this.switchState(self.goodslist[i].state);
              self.goodslist[i].totalprices=0;
              self.goodslist[i].totalnum=0;
              for(let j=0;j<self.goodslist[i].goods.length;j++){
                self.goodslist[i].totalprices+=self.goodslist[i].goods[j].price*self.goodslist[i].goods[j].num;
                self.goodslist[i].totalnum+=self.goodslist[i].goods[j].num;
              }
            }
          }else{
            alert("错误")
          }
        });
      }else if(this.select_type===2){
        this.this_type='3';
        this.$http.get(service_url+'/o2o/shop/wx/collection/selectgoods.do').then( (data)=> {
          if(data.body.status===0){
            self.goodslist=data.body.fields.orders;
          }else{
            alert("错误")
          }
        });
      }
      let self = this;
     /* this.$http.get('/api/goodsOrderList').then((data) => {
        console.log(data.body.data);
        self.goodslist=data.body.data;
        for(let i=0;i<self.goodslist.length;i++){
          self.goodslist[i].this_state=this.switchState(self.goodslist[i].state);
        }
      }, () => {
        console.log(2);
      });*/

      this.loading = false;
    },
    methods:{
      goToPay(ordernum){
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
          }else{
            alert(data.body.fields.error_reason);
          }
        })
      },
      goToEva(ordernum){
        this.$router.push({ path: '/goods_evaluate',query:{"type":1,"ordernum":ordernum} });
      },
      seeEva(ordernum){
        this.$router.push({ path: '/goods_evaluate',query:{"type":2,"ordernum":ordernum} });
      },
      switchState(num){
        switch(num){
          case 0:
              return '已下单';
              break;
          case 1:
              return '已确认';
              break;
          case 2:
              return '已支付';
              break;
          case 3:
              return '已发货';
              break;
          case 4:
              return '已收货';
              break;
          case 5:
              return '已评价';
              break;
          case 6:
              return '已取消';
              break;
        }
      },
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
    text-align:right;
  }
</style>


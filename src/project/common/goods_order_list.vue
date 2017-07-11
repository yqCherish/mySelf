<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div>
      <tab :line-width=2 active-color="#ad7de7" v-model="index">
        <tab-item class="vux-center" :selected="click_tab === item" v-for="(item, index) in list2" @click="click_tab = item"
                  :key="index" @on-item-click="onItemClick">{{item}}
        </tab-item>
      </tab>
      <div style="margin-top:-0.77em">
        <div v-if="index==0">
          <load-more v-if="arealist.length===0" :show-loading="false" tip="暂无订单数据" background-color="#efeff4"></load-more>
          <group>
            <goods-show :goods="arealist" type="5" @on-click-menu="delCollect" :path="area_path" route_type="2"></goods-show>
          </group>
        </div>
        <div v-if="index==1">
          <load-more v-if="wz_list.length===0" :show-loading="false" tip="暂无订单数据" background-color="#efeff4"></load-more>
          <group>
            <goods-show :goods="wz_list" type="6" @on-click-menu="delCollect" :path="wb_path" route_type="2"></goods-show>
          </group>
        </div>
        <div v-if="index==2">
          <load-more v-if="bj_list.length===0" :show-loading="false" tip="暂无订单数据" background-color="#efeff4"></load-more>
          <group>
            <goods-show :goods="bj_list" type="6" @on-click-menu="delCollect" :path="wb_path" route_type="1"></goods-show>
          </group>
        </div>
        <div v-if="index==3">
          <load-more v-if="goodslist.length===0" :show-loading="false" tip="暂无订单数据" background-color="#efeff4"></load-more>
          <group v-for="item in goodslist" :key="item" >
            <div style="padding:10px;border-bottom:1px solid #ececec">{{item.store_name}}<span style="float:right;color:deepskyblue">{{item.this_state}}</span></div>
            <div @click="showDetail(item.ordernum)">
              <goods-show :goods="item.goods" :type="this_type" @on-click-menu="delCollect" :path="shop_path"></goods-show>
            </div>
            <div>
              <div class="border_bottom_2">
                <div style="float:left;font-size:14px;">{{item.this_date}}</div>
                <div class="float-right">共{{item.totalnum}}件商品 合计：<span style="color:red">￥{{item.totalprices}}</span></div>
              </div>
              <div class="border_bottom_1" v-if="item.this_state==='已确认'||item.this_state==='已发货'||item.this_state==='已收货'||item.this_state==='已评价'">
                <div v-if="item.this_state==='已确认'" class="text-right"><x-button mini plain @click.native="goToPay(item.ordernum)">去支付</x-button></div>
                <div v-if="item.this_state==='已发货'" class="text-right"><x-button mini plain @click.native="checkGoodsIn(item.ordernum)">确认收货</x-button></div>
                <div v-if="item.this_state==='已收货'" class="text-right"><x-button mini plain @click.native="goToEva(item.ordernum)">去评价</x-button></div>
                <div v-if="item.this_state==='已评价'" class="text-right"><x-button mini plain @click.native="seeEva(item.ordernum)">查看评价</x-button></div>
              </div>
            </div>
          </group>
        </div>
      </div>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{content}}</alert>
  </div>
</template>

<script>
  import {setTitle} from '@/common/js/common';
  import goodsShow from '@/project/pzsh/goods_show';
  import loading from '@/components/loading/dataLoading';
  import {Tab,TabItem,Group,XButton,LoadMore,Alert} from 'vux';

  const list = () => ['会所', '微装',"保洁","购物"];

  export default{
    data(){
      return{
          loading:true,
        click_tab:"会所",
        list2:list(),
        index:0,
        this_type:'1',
        goodslist:[],
        route_type:0,
        shop_path:'/goods_order',
        area_path:'/area_reserve',
        wb_path:'/wb_reserve',
        arealist:[],
        wz_list:[],
        bj_list:[],
        confirm_show:false,
        dialog_title:"",
        content:""
      }
    },
    components:{
      loading,Tab,TabItem,goodsShow,Group,XButton,LoadMore,Alert
    },
    mounted(){
      setTitle("我的订单");
      document.getElementById("index_loading").style.display="none";
      this.get_list();
    },
    watch:{
      '$route':['get_list']
    },
    methods:{
      showDetail(ordernum){
        this.$router.push({
         path:this.shop_path,
         query:{ordernum:ordernum,type:2}
         })
      },
      onItemClick (index) {
        this.route_type=index;
        this.$router.replace({
          path:"/common_order/"+index
        });
//        this.$router.push({params:{
//            route_type:this.route_type
//        }});
//        this.$router.push({path:"common_order",query:{route_type:index}});
//        this.get_list();
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
            this.dialog_title="恭喜";
            this.content="取消成功";
            this.confirm_show=true;
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
            this.dialog_title="提示";
            this.content=data.body.fields.error_reason;
            this.confirm_show=true;
          }
        });
      },
      get_list(){
        this.route_type=parseInt(this.$route.params.route_type);
        switch(this.route_type){
          case 0:
            console.log("会所");
            this.click_tab="会所";
            this.get_area_list();
            break;
          case 1:
            console.log("微装");
            this.click_tab="微装";
            this.get_wz_list();
            break;
          case 2:
            console.log("保洁");
            this.click_tab="保洁";
            this.get_bj_list();
            break;
          case 3:
            console.log("购物");
            this.click_tab="购物";
            this.get_shop_list();
            break;
        }
      },
      get_shop_list(){
        let self = this;
        if(service_url){
          this.$http.get(service_url+'/o2o/shop/wx/orderlist.do').then( (data)=> {
            console.log(data);
            if(data.body.status===0){
              self.goodslist=data.body.fields.orders;
              for(let i=0;i<self.goodslist.length;i++){
                self.goodslist[i].this_state=this.switchState(self.goodslist[i].state);
                self.goodslist[i].this_date=this.getLocalTime(self.goodslist[i].finallytime);
                self.goodslist[i].totalprices=0;
                self.goodslist[i].totalnum=0;
                for(let j=0;j<self.goodslist[i].goods.length;j++){
                  self.goodslist[i].totalprices+=self.goodslist[i].goods[j].price*self.goodslist[i].goods[j].num;
                  self.goodslist[i].totalnum+=self.goodslist[i].goods[j].num;
                }
              }
            }else{
              this.dialog_title="提示";
              this.content=data.body.fields.error_reason;
              this.confirm_show=true;
            }
          });
        }else{
          if(service_url){

          }else{
            this.$http.get('/api/goodsOrderList').then((data) => {
              self.goodslist=data.body.data;
              for(let i=0;i<self.goodslist.length;i++){
                self.goodslist[i].this_state=this.switchState(self.goodslist[i].state);
              }
              console.log(self.goodslist);
            }, () => {
              console.log(2);
            });
          }

        }
      },
      get_area_list(){
        let self = this;
        if(service_url){
          this.$http.get(service_url+'/o2o/club/wx/preList').then((data) => {
            self.arealist=data.body.data;
            for(let i=0;i<self.arealist.length;i++){
              self.arealist[i].state_name = self.switch_state(self.arealist[i].state);
            }
          }, () => {
            console.log(2);
          });
        }else{
          this.$http.get('/api/club_order_list').then((data) => {
            self.arealist=data.body.data.data;
          }, () => {
            console.log(2);
          });
        }
      },
      getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
      },
      switch_state(state){
        let this_state= parseInt(state);
        switch(this_state){
          case 0:
              return "已预订";
            break;
          case 1:
              return "进行中";
            break;
          case 2:
              return "已完成";
            break;
          case 3:
              return "已评价";
            break;
          case 4:
              return "超时取消";
            break;
          case 5:
              return "主动取消";
            break;
        }
      },
      switch_state_wb(state){
        let this_state= parseInt(state);
        switch(this_state){
          case 0:
            return "已预订";
            break;
          case 1:
            return "进行中";
            break;
          case 2:
            return "已完成";
            break;
          case 3:
            return "已取消";
            break;
          case 4:
            return "已评价";
            break;
        }
      },
      get_wz_list(){
        let self = this;
        if(service_url){
          this.$http.get(service_url+'/o2o/reno/wx/list').then((data) => {
            self.wz_list=data.body.data;
            for(let i=0;i<self.wz_list.length;i++){
              self.wz_list[i].state_name = self.switch_state_wb(self.wz_list[i].state);
            }
          }, () => {
            console.log(2);
          });
        }else{
          this.$http.get('/api/wb_order_list').then((data) => {
            self.wz_list=data.body.data.data;
            for(let i=0;i<self.wz_list.length;i++){
              self.wz_list[i].state_name = self.switch_state_wb(self.wz_list[i].state);
            }
          }, () => {
            console.log(2);
          });
        }
      },
      get_bj_list(){
        let self = this;
        if(service_url){
          this.$http.get(service_url+'/o2o/hk/wx/list').then((data) => {
            self.bj_list=data.body.data;
            for(let i=0;i<self.bj_list.length;i++){
              self.bj_list[i].state_name = self.switch_state_wb(self.bj_list[i].state);
            }
          }, () => {
            console.log(2);
          });
        }else{
          this.$http.get('/api/wb_order_list').then((data) => {
            self.bj_list=data.body.data.data;
            for(let i=0;i<self.bj_list.length;i++){
              self.bj_list[i].state_name = self.switch_state_wb(self.bj_list[i].state);
            }
          }, () => {
            console.log(2);
          });
        }
      },
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
            this.dialog_title="恭喜";
            this.content="收货成功";
            this.confirm_show=true;
            for(let i=0;i<goodslist.length;i++){
              if(ordernum===goodslist[i].ordernum){
                goodslist[i].state="已收货";
              }
            }
          }else{
            this.dialog_title="提示";
            this.content=data.body.fields.error_reason;
            this.confirm_show=true;
          }
        })
      },
      goToEva(ordernum){
        this.$router.push({ path: '/goods_evaluate',query:{"type":1,"ordernum":ordernum} });
      },
      seeEva(ordernum){
        this.$router.push({ path: '/goods_evaluate',query:{"type":2,"ordernum":ordernum} });
      },
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

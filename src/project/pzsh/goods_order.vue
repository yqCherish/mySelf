<template>
  <div>
    <!--<loading style="text-align: center;" v-if="loading"></loading>-->
    <div>
      <group title="收货人信息">
        <x-input labelWidth="5em" title="姓名" name="username" placeholder="请输入姓名" is-type="china-name" :value="buyer_name"></x-input>
        <x-input title="手机号码" type="tel" name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile" :value="buyer_tel"></x-input>
        <x-input title="收货地址" name="address" placeholder="请输入收货地址" keyboard="china-name" :value="buyer_address"></x-input>
        <x-input v-if="state===3||state===4||state===5||state===6" name="express_company" keyboard="china-name" :value="express_company" disabled></x-input>
        <x-input v-if="state===3||state===4||state===5||state===6" title="快递单号" name="express_no" keyboard="number" :value="express_no" disabled></x-input>
      </group>
      <group v-if="order_type===1" v-for="items in orders" :key="items" :title="items.store_name">
        <div>
          <goods-show :goods="items.goods" :type="goods_type" :path="path"></goods-show>
          <p style="padding:.4rem 15px;text-align:right;" >共件商品{{items.counts}}件 合计:<span style="color:red;">￥{{items.totalprice}}</span></p>
        </div>
      </group>
      <group v-if="order_type===2" :title="show_title">
        <div>

          <goods-show :goods="goods" :type="goods_type" :path="path"></goods-show>
          <!--<p style="padding:.4rem 15px;text-align:right;" >共件商品{{items.counts}}件 合计:<span style="color:red;">￥{{items.totalprice}}</span></p>-->
        </div>
      </group>
      <div style="text-align: right;padding-right:.8rem;padding-bottom:.4rem">
        <p v-if="order_type===1" style="padding:.4rem 0" >总计:<span style="color:red;">￥{{allprice}}</span></p>
        <p v-if="order_type===2" style="padding:.4rem 0" >总计:<span style="color:red;">￥{{totalprice}}</span></p>
        <!--<p style="padding:.4rem 0">共{{total_num}}件商品 合计:<strike>￥{{total_price}}</strike><span style="margin-left:5px;color:red">￥{{totalprice}}</span></p>-->
      </div>
      <div style="margin:20px 10px 10px"><x-button class="zj_button" v-if="order_type===1" type="primary" @click.native="payList">支付</x-button></div>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
  </div>

</template>

<script>
  import goodsShow from '@/project/pzsh/goods_show'
  import loading from '@/components/loading/dataLoading'
  import { Cell, Group, XInput, XButton, Alert} from 'vux'
  import {setTitle} from '@/common/js/common';
  export default{
    name: 'goods_detail',
    components:{
      goodsShow,loading,Cell, Group, XInput,XButton,Alert
    },
    data(){
        return{
            loading:true,
            goods:[],
            store_name:"",
            store_id:"",
            buyer_name:"",
            buyer_tel:"",
            buyer_address:"",
            goods_type:'2',
            order_type:1,
            express_company:'',
            state:'',
            state_name:'',
            show_title:'',
            express_no:'',
            ordernum:[],
            path:'/goods_detail',
            total_num:'',
            total_price:'',
            totalprice:'',
            confirm_show:false,
            dialog_title:"",
            confirm_content:"",
            orders:[],
          allprice:0
        }
    },
    mounted(){
      this.order_type = parseInt(this.$route.query.type);
      this.order_type===1?setTitle("订单支付"):setTitle("订单详情");
      this.ordernum=this.$route.query.ordernum;
      console.log(this.ordernum);
      let self = this;
      if(service_url){
        const senddata={
            "ordernums":this.ordernum
        };

        if(this.order_type===1){

          this.$http.post(service_url+'/o2o/shop/wx/topayorder.do',senddata).then( (data)=> {
            if(data.body.status===0){
//            self.goods = data.body.fields.orders.goods;
              self.orders = data.body.fields.orders;
              self.allprice = data.body.allprice;
              self.store_name = data.body.fields.orders.store_name;
              self.store_id = data.body.fields.orders.store_id;
              self.buyer_name = data.body.fields.orders[0].buyer_name;
              self.buyer_tel = data.body.fields.orders[0].buyer_tel;
              self.buyer_address = data.body.fields.orders[0].buyer_address;
//            self.express_company = data.body.fields.orders[0].orders.express_company;
//            self.express_no = data.body.fields.orders[0].orders.express_no;
              self.state = data.body.fields.orders.state;
              self.state_name=self.switchState(parseInt(self.state));
              self.totalprice = parseFloat(data.body.allprice);
              self.show_title='<div style="display:inline-block">'+self.store_name+'</div><div style="float:right;color:deepskyblue">'+self.state_name+'</div>';
//            let totalNum=0;
//            let total_price=0;
              /*for(let i=0;i<self.orders.length;i++){
               for(let j =0;j<self.orders[i].goods.length;j++){
               self.orders[i].totalNum+=parseFloat(self.orders[i].goods[j].num);
               self.orders[i].total_price+=parseFloat(self.orders[i].goods[j].totalNum*self.orders[i].goods[j].price);
               }
               }*/
//            self.total_num=totalNum;
//            self.total_price=total_price;
            }else{
              this.dialog_title="提示";
              this.confirm_content=data.body.error_reason;
              this.confirm_show=true;
            }

          });
        }else{
          this.$http.post(service_url+'/o2o/shop/wx/orderdetail.do',senddata).then( (data)=> {
            if(data.body.status===0){
            self.goods = data.body.fields.orders.goods;
//              self.orders = data.body.fields.orders;
//              self.allprice = data.body.allprice;
              self.store_name = data.body.fields.orders.store_name;
              self.store_id = data.body.fields.orders.store_id;
              self.buyer_name = data.body.fields.orders.buyer_name;
              self.buyer_tel = data.body.fields.orders.buyer_tel;
              self.buyer_address = data.body.fields.orders.buyer_address;
              self.express_company = data.body.fields.orders.express_company;
              self.express_no = data.body.fields.orders.express_no;
              self.state = data.body.fields.orders.state;
              self.state_name=self.switchState(parseInt(self.state));
              self.totalprice = parseFloat(data.body.fields.orders.totalprice);
              self.show_title='<div style="display:inline-block">'+self.store_name+'</div><div style="float:right;color:deepskyblue">'+self.state_name+'</div>';
//            let totalNum=0;
//            let total_price=0;
              /*for(let i=0;i<self.orders.length;i++){
               for(let j =0;j<self.orders[i].goods.length;j++){
               self.orders[i].totalNum+=parseFloat(self.orders[i].goods[j].num);
               self.orders[i].total_price+=parseFloat(self.orders[i].goods[j].totalNum*self.orders[i].goods[j].price);
               }
               }*/
//            self.total_num=totalNum;
//            self.total_price=total_price;
            }else{
              this.dialog_title="提示";
              this.confirm_content=data.body.error_reason;
              this.confirm_show=true;
            }

          });
        }

      }else{
        this.$http.get('/api/goodsOrder').then((data) => {
//         self.goods = data.body.data.goods;
         self.orders = data.body.data.orders;
         self.store_name = data.body.data.store_name;
         self.store_id = data.body.data.store_id;
         self.buyer_name = data.body.data.buyer_name;
         self.buyer_tel = data.body.data.buyer_tel;
         self.buyer_address = data.body.data.buyer_address;
         self.express_company = data.body.data.express_company;
         self.totalprice = data.body.data.totalprice;
         self.express_no = data.body.data.express_no;
         self.state = data.body.data.state;
         self.show_title='<div style="display:inline-block">'+self.store_name+'</div><div style="float:right;color:deepskyblue">'+self.state+'</div>';
          let totalNum=0;
          let total_price=0;
          for(let i=0;i<self.goods.length;i++){
            totalNum+=parseInt(self.goods[i].num);
            total_price+=parseInt(self.goods[i].num*self.goods[i].price);
          }
          self.total_num=totalNum;
          self.total_price=total_price;
         }, () => {
         console.log(2);
         });
      }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      payList(){
        /*const senddata={
          "data":{
            "ordernum":this.ordernum,
//            "pay_price":50
          }
        };
          this.$http.post(service_url+'/o2o/shop/wx/payorder.do',senddata).then( (data)=> {
            if(data.body.status===0){
              alert("支付成功");
              this.$router.push({ path: '/goods_order_list',query:{"type":1} });
            }else{
              alert(data.body.fields.error_reason);
            }
          })*/
        this.$http.post(service_url+"/o2o/assetsv2/wx/detail/shopCreate").then((data)=>{
          if(data.body.status===0){
            this.$router.replace({path:"wallet_pay",query:{order_id:data.body.data,type:3,pay_num:this.allprice}});
          }else{
              this.confirm_show=true;
              this.confirm_content=data.body.msg;
              this.dialog_title="提示";
          }
        });

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
    }
  }
</script>

<style scoped>
  .abs_button{
    position:fixed;
    bottom:0;
  }
  .text_right{
    text-align: right;
  }
</style>

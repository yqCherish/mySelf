<template>
  <div>
    <!--<loading v-if="loading" style="text-align:center"></loading>-->
    <div>
      <!--头部区域-->
      <div style="background-color:#ad7de7;padding:30px 15px">
        <div style="color:white;float:left">历史未缴费用合计</div><div style="float:right;color:white" @click="go_add">账户充值</div>
        <div @click="pay_all" style="clear:both;color:white;text-align: center"><span style="font-size:30px;">￥{{total_price}}</span>元</div>
      </div>
      <!--列表区域-->
      <div style="margin:10px;" v-for="(item,index) in items" :key = "item">
        <x-table :cell-bordered="false" style="background-color:#fff;border-radius: 10px;box-shadow: 0 0 10px #ececec;">
          <thead>
          <tr>
            <th colspan="4" style="text-align: left;padding-left:10px;font-size:18px;color:#ad7de7;">{{item.title}}</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>项目</td>
            <td>应缴日期</td>
            <td>应缴费用</td>
            <td>未缴费用</td>
          </tr>
          <tr v-for="list in item.price_list">
            <td>{{list.name}}</td>
            <td>{{list.date}}</td>
            <td>￥{{parseFloat(list.price).toFixed(2)}}</td>
            <td>￥{{parseFloat(list.unpaid).toFixed(2)}}</td>
          </tr>
          <tr>
            <td colspan="4" style="text-align: right;padding-right:10px;color:red;">合计：￥{{parseFloat(item.total).toFixed(2)}}</td>
          </tr>
          </tbody>
        </x-table>

        <div v-if="index===0" style="text-align: center;padding:15px 80px 20px 80px;"><x-button  @click.native="go_pay(item.item_id,item.title,parseFloat(item.total).toFixed(2))" style="background-color:#ad7de7" type="primary">缴纳费用</x-button></div>
        <div v-if="index!==0" style="text-align: center;padding:15px 80px 20px 80px;"><x-button @click.native="cannot_in" style="background-color:#ad7de7" type="primary">缴纳费用</x-button></div>
      </div>
      <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
    </div>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {XTable,XButton,Alert} from 'vux';

  export default{
    data(){
      return{
        loading:true,
        total_price:"",
        items:[],
        confirm_show:false,
        confirm_content:"",
        dialog_title:"提示",
        type:0  //type:1 差所有物业缴费数据   type:2 只差欠费的记录
      }
    },
    components:{
      loading,XTable,XButton,Alert
    },
    mounted(){
      setTitle("物业缴费");
      this.type = parseInt(this.$route.params.type);
      this.type===1?setTitle("物业缴费"):setTitle("欠费");
      let self = this;
      if(service_url){
          this.$http.get(service_url+"/o2o/assetsv2/wx/my_paylist.do?type="+this.type).then((data)=>{
            self.total_price = data.body.total_price.toFixed(2);
            self.items = data.body.items;
          });
      }else{
          this.$http.get("/api/my_paylist").then((data)=>{
            self.total_price = parseFloat(data.body.data.data.total_price).toFixed(2);
            self.items = data.body.data.data.items;
          })
      }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      go_pay(item_id,title,price){
        this.$router.replace({path:"/wallet_pay",query:{order_id:item_id,type:2,pay_type:title,pay_num:price}});
      },
      cannot_in(){
        this.confirm_show=true;
        this.confirm_content="您需要先缴纳上季度费用";
      },
      go_add(){

      },
      pay_all(){

      }
    }
  }
</script>

<style scoped>
  .vux-table:after{
    border:0;
  }
</style>

<template>
  <div>
    <group title="我的银行卡">
      <radio :options="radio003" @on-change="change" v-model="choose"></radio>
      <divider v-if="radio003.length===0">暂无银行卡</divider>
    </group>
    <div style="padding:20px 10px">
      <x-button v-if="show===1" type="primary" class="zj_button" @click.native="go_pay">支付</x-button>
      <x-button @click.native="add_card">添加银行卡</x-button>
    </div>
    <div id="hidden_div"></div>
    <alert v-model="confirm_show" :title="dialog_title"> {{content}}</alert>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {Group,Radio,XButton,Divider,Alert} from 'vux'

  export default{
    data(){
      return{
        radio003: [],
        choose:'',
        pay:'',
        confirm_show:false,
        dialog_title:"",
        order_id:0,
        content:"",
        show:""  //是否显示支付按钮
      }
    },
    components:{
      loading,Group,Radio,XButton,Divider,Alert
    },
    mounted(){
      setTitle("我的银行卡");
      this.pay=this.$route.query.pay;
      this.type=parseInt(this.$route.query.type);
      this.show=parseInt(this.$route.query.show);
      this.order_id=parseInt(this.$route.query.order_id);
      document.getElementById("index_loading").style.display="none";
      if(service_url){
        this.$http.get(service_url+"/o2o/assetsv2/wx/bank_card_list.do").then((data)=>{
          if(data.body.status===0){
            let this_data= data.body.data;
            for(let i in this_data){
              this_data[i].value = this_data[i].name+"("+this_data[i].value+")";
            }
            this.radio003=this_data;
            if(this.radio003.length>0){
              this.choose=this.radio003[0].key;
            }
          }else{
            this.dialog_title="提示";
            this.content=data.body.error_reason;
            this.confirm_show=true;
          }
        })
      }else{
        for(let i in this.radio003){
          this.radio003[i].value = this.radio003[i].name+"("+this.radio003[i].value+")";
        }
      }
    },
    methods:{
      change(value){
        console.log('change:', value);
        this.choose=value;
      },
      go_pay(){
        let self = this;
        if(!this.choose||this.choose===''){
          this.dialog_title="提示";
          this.content="请选择银行卡";
          this.confirm_show=true;
            return;
        }
        /*type为1的时候生成order_id */
        if(this.type===1){
          const items={
            emoney:this.pay
          };
          this.$http.post(service_url+"/o2o/assetsv2/wx/get_orderid.do",items).then((data)=>{
            if(data.body.status===0){
              let order_id=data.body.data.order_id;
              const item = {
                orderId:order_id,
                accNo:self.choose
              };
              self.$http.post(service_url+"/o2o/assetsv2/wx/unionpay/pay",item).then((data=>{
                document.getElementById("hidden_div").innerHTML=data.body.data;
                document.all.pay_form.submit();
              }))
            }
          });
        }else{
          const item = {
            orderId:this.order_id,
            accNo:this.choose
          };
          self.$http.post(service_url+"/o2o/assetsv2/wx/unionpay/pay",item).then((data=>{
            document.getElementById("hidden_div").innerHTML=data.body.data;
            document.all.pay_form.submit();
          }))
        }
      },
      add_card(){
        this.$router.push({path:'binding_card'});
      }
    }
  }
</script>

<style scoped>

</style>

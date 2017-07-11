<template>
  <div class="body">
    <div v-for="item in goods">
      <group :title="item.name">
        <cell title="商品评分">
          <rater v-model="item.eva_score" slot="value" star="✩" active-color="#FF9900" :margin="4"></rater>
        </cell>
      </group>
      <group gutter="0">
        <x-textarea :max="100" v-model="item.eva_content" :placeholder="placeholder" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')"></x-textarea>
      </group>
    </div>
    <div style="margin:20px 10px 10px;">
      <x-button v-if="type===1" type="primary" class="zj_button"  @click.native="insertcomment">提交</x-button>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
  </div>
</template>

<script>
  import { Rater, Group, Cell, XTextarea, Panel, XButton, Alert} from 'vux'
  import {setTitle} from '@/common/js/common';

  export default {
    components: {
      Rater,
      Group,
      Cell,
      XTextarea,
      Panel,
      XButton,
      Alert
    },
    data () {
      return {
        placeholder:'请输入评价详细内容',
        ordernum:'',
        goods:[],
        type:1,
        confirm_show:false,
        dialog_title:"",
        confirm_content:""
      }
    },
    methods:{
      onEvent (event) {
        console.log('on', event)
      },
      insertcomment(){
        const arr=[];
        for(let i=0;i<this.goods.length;i++){
            const obj = {"goods_id":this.goods[i].goods_id,"eva_score":this.goods[i].eva_score,"eva_content":this.goods[i].eva_content};
          arr.push(obj);
        }
        const senddata = {
          "ordernum":this.ordernum,
          "data":arr
        };
        this.$http.post(service_url+'/o2o/shop/wx/insertcomment.do',senddata).then( (data)=> {
          if(data.body.status===0){
            this.dialog_title="提示";
            this.confirm_content="评价成功";
            this.confirm_show=true;
            this.$router.push({ path: '/goods_order_list',query:{"type":1} });
          }else{
            this.dialog_title="提示";
            this.confirm_content=data.body.error_reason;
            this.confirm_show=true;
          }
        });
      }
    },
    mounted(){
      setTitle("商品评价");
      let self = this;
      document.getElementById("index_loading").style.display="none";
      this.type=parseInt(this.$route.query.type);
      console.log(this.type===2);
      this.ordernum=this.$route.query.ordernum;
      const senddata = {
        "data":{
            "ordernum":this.ordernum
        }
      };
      /*this.$http.get('/api/goodsDetails').then((data) => {
       self.evaluate = data.body.data.evaluate;
       }, () => {
       console.log(2);
       });*/
      if(this.type===1){
        this.$http.post(service_url+'/o2o/shop/wx/tocomment.do',senddata).then( (data)=> {
          if(data.body.status===0){
            self.goods = data.body.fields.orders.goods;
            for(let i =0;i<self.goods.length;i++){
                self.goods[i].eva_score=0;
                self.goods[i].eva_content="";
            }
          }else{
            this.dialog_title="提示";
            this.confirm_content=data.body.error_reason;
            this.confirm_show=true;
          }
        });
      }else if(this.type===2){
        this.$http.post(service_url+'/o2o/shop/wx/selectshopcomment.do',senddata).then( (data)=> {
          if(data.body.status===0){
            self.goods = data.body.fields;
          }else{
            this.dialog_title="提示";
            this.confirm_content=data.body.error_reason;
            this.confirm_show=true;
          }
        });
      }
      this.loading = false;
    },
  }
</script>

<style scoped>
  .body{
    padding-bottom: 44px;
  }

</style>

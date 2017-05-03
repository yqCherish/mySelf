<template>
  <div>
    <div class="outer_padding">
      <div class="body_white" style="border-bottom:1px solid #ececec" v-for="order in orders" track-by="$index">
        <div class="weui_flex border_bottom_2 weui_check_two">
          <!--checkbox-->
          <div class="weui-cell__hd weui_check_two" @click="checkboxtwo(order,orders.length)">
            <input :id="'store'+order.store_id" type="checkbox" class="weui-check" name="checkbox">
            <i class="weui-icon-checked"></i>
          </div>
          <div class="width_30 text_ellipsis">
            {{order.store_name}}
          </div>
        </div>
        <!--商品区域-->
        <div class="weui_flex border_bottom_2" v-for="item in order.goods" track-by="$index">
          <div class="weui-cell__hd weui_check_single" @click="checkboxsingle(item.goods_id,order.goods.length)">
            <input :id="'goods'+item.goods_id" type="checkbox" class="weui-check" name="checkbox">
            <i class="weui-icon-checked"></i>
          </div>
          <div class="img_div">
            <img class="object_fit" :src ="item.img"/>
          </div >
          <div class="ui_describe flex_1 font_14 posr">
            <div style="max-height:42px;overflow: hidden">{{item.name}}</div>
            <div class="text_ellipsis width_13">规格: {{item.property}}</div>
            <div class="text_ellipsis width_13">数量：<span class="mark_span">X</span><span
              class="num_span">{{item.num}}</span></div>
            <div class="color_red"><span class="mark_span">￥</span><span class="price_span">{{item.price}}</span></div>
            <x-button mini plain type="primary" style="font-size:10px;position:absolute;right:0;bottom:0" @click="removeTodo($index,order.goods,$parent.$index)">删除商品</x-button>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed_bottom">
      <div class="weui_flex">
        <!--checkbox-->
        <div class="weui-cell__hd" @click="checkboxall()">
          <input id="checkboxall" type="checkbox" class="weui-check" name="checkbox">
          <i class="weui-icon-checked"></i>
        </div>
        <!--商品详细区域-->
        <div class="flex_1">
          <span>全选</span>
          <p style="float:right">合计: <span class="color_red"> ￥{{sum}}</span></p>
        </div>
        <div class="buy_button">结算</div>
      </div>
    </div>
  </div>
</template>
<script>
  import {XButton} from 'vux'
  import $ from 'jquery';
  export default{
    mounted(){
      this.order_type = this.$route.query.type;
      let self = this;
      this.$http.get('/api/goodsOrderList').then((data) => {
        self.orders = data.body.data;
      }, () => {
        console.log(2);
      });
      this.loading = false;
    },
    data(){
      return {
        loading:true,
        orders:[],
        sum:0,
        check:true
      }
    },
    components:{
      XButton
    },
    methods:{
      checkboxall(){
        if(this.check){
          $("input[name='checkbox']").prop("checked","true");
          this.check=false;
        }else{
          $("input[name='checkbox']").removeAttr("checked");
          this.check=true;
        }
        this.checkPrice();
      },
      checkboxtwo(order,length){
        let this_obj=$("#store"+order.store_id);
        let goods=order.goods;
        if(this_obj.prop("checked")){
          this_obj.removeAttr("checked");
          $("#checkboxall").removeAttr("checked");
          for(let i=0;i<goods.length;i++){
            $("#goods"+goods[i].goods_id).removeAttr("checked");
          }
        }else{
          this_obj.prop("checked","true");
          if($(".weui_check_two").find(":checked").length==length){
            $("#checkboxall").prop("checked","true");
          }
          for(let i=0;i<goods.length;i++){
            $("#goods"+goods[i].goods_id).prop("checked","true");
          }
        }
        this.checkPrice();
      },
      checkboxsingle(id,length){
        let this_obj=$("#goods"+id);
        if(this_obj.prop("checked")){
          this_obj.removeAttr("checked");
          $(e.target).parent().siblings(".weui_check_two").find(":checkbox").removeAttr("checked");

        }else{
          this_obj.prop("checked","true");
          let len=this_obj.parent().parent().siblings().find(":checked").length+1;
          console.log(len);
          if(len==length){
            this_obj.parent().parent().siblings(".weui_check_two").find(":checkbox").prop("checked","true");
          }
        }
        this.checkPrice();
      },
      removeTodo(index,goods,parentIndex){
        goods.splice(index,1);
        if(goods.length==0){
          this.orders.splice(parentIndex,1);
        }
        this.checkPrice();
      },
      checkPrice(){
        let checked_obj = $(".weui_check_single").find(":checked");
        this.sum=0;
        for(let i = 0;i<checked_obj.length;i++){
          let siblings=$(checked_obj[i]).parent().next().next();
          let price = parseInt(siblings.find(".price_span").html());
          let num = parseInt(siblings.find(".num_span").html());
          let this_price = price*num;
          this.sum+=this_price;
        }
      }
    }
  }
</script>
<style scoped>
  .outer_padding{
    padding-bottom:44px;
  }
  .body_white{
    background: white;
  }
  .weui_flex{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    outline: 0;
    -webkit-align-items: center;
    align-items: center;
  }
  .border_bottom_2{
    border-bottom:1px solid #ececec;
  }
  .weui_flex .weui_cells_checkbox{
    margin-right:10px;
  }
  .posr{
    position:relative;
  }
  .width_30{
    width:30rem;
  }
  .font_14 {
    font-size: 13px;
  }

  .img_div {
    height: 100px;
    width: 100px;
  }

  .object_fit {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .weui_flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    outline: 0;
    -webkit-align-items: center;
    align-items: center;
  }

  .border_bottom_2 {
    border-bottom: 1px solid #ececec;
    padding: 10px;
  }

  .weui_flex .ui_describe {
    margin-left: 10px;
    height: 100px;
  }

  .flex_1 {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }

  .posr {
    position: relative;
  }

  .width_13 {
    width: 140px;
    font-size: 13px;
  }

  .text_ellipsis {
    text-overflow: ellipsis; /*文字隐藏后添加省略号*/
    white-space: nowrap; /*强制不换行*/
    overflow: hidden; /*自动隐藏文字*/
  }

  .color_red {
    color: red;
  }

  .mark_span {
    font-size: 13px;
  }

  .price_span {
    font-size: 13px;
  }
  .fixed_bottom{
    position:fixed;
    bottom:0;
    left:0;
    right:0;
  }
  .fixed_bottom .weui_flex{
    padding-left: .8rem;
    border-top: 1px solid #ececec;
  }
  .buy_button{
    cursor:pointer;
    padding:10px 30px;
    background-color:#f06600;
    color:white;
    margin-left:.5rem;
  }
  .weui-check{
    position: absolute;
    left: -9999em;
  }
  [class^="weui-icon-"], [class*=" weui-icon-"] {
    display: inline-block;
    vertical-align: middle;
    font: normal normal normal 14px/1 "weui";
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
  }
  .weui-check:checked + .weui-icon-checked:before {
    content: '\EA06';
    color: #09BB07;
  }
  .weui-icon-checked:before {
    content: '\EA01';
    color: #C9C9C9;
    font-size: 23px;
    display: block;
  }
  .weui-cell__hd{
    margin-right:10px;
  }
</style>

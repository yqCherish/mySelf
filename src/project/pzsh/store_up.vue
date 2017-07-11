<template>
  <div>
    <load-more v-if="this.orders.length===0" :show-loading="false" tip="暂无数据" background-color="#efeff4"></load-more>
    <div v-else>
      <div class="outer_padding">
        <Group>
          <div class="body_white" style="border-bottom:1px solid #ececec" v-for="(order,index1) in orders">
            <div class="weui_flex border_bottom_2 weui_check_two">
              <!--checkbox-->
              <div class="weui-cell__hd weui_check_two" @click="checkboxtwo(order,orders.length)">
                <input :id="'store'+order.store_id" type="checkbox" class="weui-check" name="checkbox">
                <i class="weui-icon-checked"></i>
              </div>
              <div class="width_30 text_ellipsis" @click="go_store(order.store_id)">
                {{order.store_name}}
              </div>
            </div>
            <!--商品区域-->
            <div  class="weui_flex border_bottom_2" v-for="(item,index2) in order.goods">
              <div class="weui-cell__hd weui_check_single" @click="checkboxsingle(item.modelid,order.goods.length)">
                <input :id="'goods'+item.modelid" type="checkbox" class="weui-check" name="checkbox">
                <i class="weui-icon-checked"></i>
              </div>
              <div @click="go_detail(item.goods_id)" class="img_div">
                <img class="object_fit" :src ="item.img"/>
              </div >
              <div @click="go_detail(item.goods_id)" class="ui_describe flex_1 font_14 posr">
                <div style="max-height:42px;overflow: hidden">{{item.name}}</div>
                <div class="text_ellipsis width_13">规格: {{item.modelname}}</div>
                <div class="text_ellipsis width_13">数量：<span class="mark_span">X</span><span
                  class="num_span">{{item.num}}</span></div>
                <div class="color_red" style="position:absolute;left:0;bottom:0"><span class="mark_span">￥</span><span class="price_span" style="font-size:20px;">{{item.price}}</span></div>
                <x-button mini plain type="primary" style="font-size:10px;position:absolute;right:0;bottom:0" @click.native.stop="removeTodo(index2,order.goods,index1,item.goods_id,item.order_id,item.num,item.price,item.modelid)">删除商品</x-button>
              </div>
            </div>
          </div>
        </Group>

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
          <div class="buy_button" @click="placeOrder">下单</div>
        </div>
      </div>
    </div>
    <loading v-model="isLoading" :text="alert_text"></loading>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
    <div v-transfer-dom>
      <confirm v-model="show"
               title="提示"
               @on-confirm="onConfirm">
        <p style="text-align:center;">{{confirm_text}}</p>
      </confirm>
    </div>
    <toast v-model="show_toast">{{toast_text}}</toast>
  </div>
</template>
<script>
  import {XButton,Group,LoadMore,Alert,Loading,TransferDomDirective as TransferDom,Confirm,Toast} from 'vux'
  import $ from 'jquery';
  import {setTitle} from '@/common/js/common';
  export default{
    mounted(){
      setTitle("购物车");
      let self = this;
      if(service_url){
        this.$http.get(service_url+'/o2o/shop/wx/car/selectgoods.do').then( (data)=> {
//              this.$router.push({ path: '/store_up',query:{"type":1} });
          if(data.body.status===0){
            self.orders = data.body.fields.orders;
          }else{
            this.dialog_title="提示";
            this.confirm_content=data.body.fields.error_reason;
            this.confirm_show=true;
          }
        });
      }else{
        this.$http.get('/api/goodsOrderList').then((data) => {
         self.orders = data.body.data;
         }, () => {
         console.log(2);
         });
      }
      this.loading = false;
    },
    data(){
      return {
        isLoading:false,
        alert_text:"",
        orders:[],
        sum:0,
        check:true,
        senddatas:[],
        confirm_show:false,
        dialog_title:"",
        confirm_content:"",
        confirm_text:"",
        show:false,
        show_toast:false,
        toast_text:"",
        c_index:0,
        c_goods:[],
        c_parentIndex:0,
        c_goods_id:0,
        c_order_id:0,
        c_model_id:0,
        c_num:0,
        c_price:0,
        _arr:[]
      }
    },
    directives: {
      TransferDom
    },
    components:{
      XButton,Group,LoadMore,Alert,Confirm,Toast,Loading
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
            $("#goods"+goods[i].modelid).removeAttr("checked");
          }
        }else{
          this_obj.prop("checked","true");
          if($(".weui_check_two").find(":checked").length==length){
            $("#checkboxall").prop("checked","true");
          }
          for(let i=0;i<goods.length;i++){
            $("#goods"+goods[i].modelid).prop("checked","true");
          }
        }
        this.checkPrice();
      },
      checkboxsingle(id,length){
        let this_obj=$("#goods"+id);
        if(this_obj.prop("checked")){
          this_obj.removeAttr("checked");
          this_obj.parent().parent().siblings(".weui_check_two").find(":checkbox").removeAttr("checked");
        }else{
          this_obj.prop("checked","true");
          let len=this_obj.parent().parent().siblings().find(":checked").length+1;
          if(len==length){
            this_obj.parent().parent().siblings(".weui_check_two").find(":checkbox").prop("checked","true");
          }
        }
        this.checkPrice();
      },
      removeTodo(index,goods,parentIndex,goods_id,order_id,num,price,modelid){
          this.c_index=index;
          this.c_goods=goods;
          this.c_parentIndex=parentIndex;
          this.c_goods_id=goods_id;
          this.c_order_id=order_id;
          this.c_num=num;
          this.c_price=price;
          this.c_model_id=modelid;
          this.show=true;
          this.confirm_text="是否在购物车中删除该商品";

//        this.checkPrice();
      },
      checkPrice(){
        let checked_obj = $(".weui_check_single").find(":checked");
        this.sum=0;
        let _arr=[];
        for(let k = 0;k<checked_obj.length;k++){
          let siblings=$(checked_obj[k]).parent().next().next();
          let price = parseInt(siblings.find(".price_span").html());
          let num = parseInt(siblings.find(".num_span").html());
          let this_price = price*num;
          _arr.push($(checked_obj[k]).attr("id"));
          this.sum+=this_price;
          /*for(let i=0;i<self.orders.length;i++){
            for(let j=0;j<self.orders[i].goods.length;j++){
              let this_id="goods"+self.orders[i].goods[j].modelid;
              if($(checked_obj[k]).attr("id")===this_id){
                  if(_arr.indexOf(this_id)===-1){
                    _arr.push(this_id);
                    self.senddatas.push(self.orders[i].goods[j]);
                  }
              }
            }
          }*/
        }
        console.log(_arr);
        this._arr=_arr;
      },
      placeOrder(){
          if(this.sum===0){
            this.dialog_title="提示";
            this.confirm_content="请至少选择一件商品";
            this.confirm_show=true;
            return;
          }
          this.isLoading=true;
          this.alert_text="保存中";
          console.log(this._arr);
          for(let i = 0;i<this.orders.length;i++){
              for(let j =0;j<this.orders[i].goods.length;j++){
                  console.log("goods"+this.orders[i].goods[j].modelid);
                  console.log(this._arr.indexOf("goods"+this.orders[i].goods[j].modelid));
                  if(this._arr.indexOf("goods"+this.orders[i].goods[j].modelid)!==-1){
                      this.senddatas.push(this.orders[i].goods[j]);
                  }
              }
          }
          console.log(this.senddatas);
//          return;
        const senddata = {
          "data": this.senddatas
        };
        if(service_url){
          this.$http.post(service_url+'/o2o/shop/wx/downorder.do',senddata).then( (data)=> {
            this.isLoading=false;
//              this.$router.push({ path: '/store_up',query:{"type":1} });
            if(data.body.status===0){
              this.toast_text="下单成功";
//              return;
              this.show_toast=true;
              this.$router.push({path:"goods_order",query:{type:1,ordernum:data.body.ordernums}});
            }else{
              this.dialog_title="提示";
              this.confirm_content=data.body.error_reason;
              this.confirm_show=true;
            }
          });
        }else{
          this.isLoading=false;
          this.toast_text="下单成功";
          this.show_toast=true;
//          setTimeout(this.go_next,1000);
          this.$router.push({path:"goods_order",query:{type:1}});
        }

      },
      go_next(){
        this.$router.push({ path: '/common_order/3' });
      },
      go_detail(id){
          this.$router.push({
            path:"goods_detail",query:{
                id:id
            }
          })
      },
      go_store(id){
          this.$router.push({path:"store_detail",query:{store_id:id}})
      },
      onConfirm(){
        this.isLoading=true;
        this.alert_text="删除中";
        const cardata={
          "data":{
            goodsid:this.c_goods_id,
            orderid:this.c_order_id,
            modelid:this.c_model_id
          }
        };
        if(service_url){
          this.$http.post(service_url+'/o2o/shop/wx/deletecar.do',cardata).then( (data)=> {
            this.isLoading=false;
            if(data.body.status===0){
              this.toast_text="删除成功";
              this.show_toast=true;
              let this_obj = $("#goods"+this.c_goods_id);
              if(this_obj.prop("checked")){
                this.sum=this.sum-this.c_num*this.c_price;
              }
              this.c_goods.splice(this.c_index,1);
              if(this.c_goods.length===0){
                this.orders.splice(this.c_parentIndex,1);
              }
            }else{
              this.dialog_title="提示";
              this.confirm_content=data.body.fields.error_reason;
              this.confirm_show=true;
            }
          });
        }else{
          this.isLoading=false;
          this.toast_text="删除成功";
          this.show_toast=true;
          let this_obj = $("#goods"+this.c_goods_id);
          if(this_obj.prop("checked")){
            this.sum=this.sum-this.c_num*this.c_price;
          }
          this.c_goods.splice(this.c_index,1);
          if(this.c_goods.length===0){
            this.orders.splice(this.c_parentIndex,1);
          }
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
  .buy_button:active{
    background-color:#ab7044;
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

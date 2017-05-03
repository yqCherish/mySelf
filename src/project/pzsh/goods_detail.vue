<template>
  <div class="body_background">
    <loading style="text-align: center;" v-if="loading"></loading>
    <div v-else>
      <div class="padding_bottom">
        <Swiper :list="swiper_imgs" :index="swiper_index" @on-index-change="swiperChange" height="300px"></Swiper>
        <div class="describe body_white">
          <p class="font_name">{{goods_name}}</p>
          <p><span class="font_price">￥{{this_price}}</span><span class="font_sale">已销{{sale_num}}件</span></p>
        </div>
        <div class="body_white margin_top">
          <cell @click.native="showActionsheet(0)" :title="cell_title" is-link></cell>
        </div>
        <div class="body_white margin_top">
          <div>
            <tab :line-width=2 active-color="#fc378c" v-model="index">
              <tab-item class="vux-center" :selected="click_tab === item" v-for="(item, index) in list2" @click="click_tab = item"
                        :key="index">{{item}}
              </tab-item>
            </tab>
            <div v-if="index==0">
              <div class="tw_detail">
                <div class="w_detail margin_bottom">
                  {{desc}}
                </div>
                <div><img v-for="item in detailimgs" :src="item" class="object_fit"/></div>
              </div>
            </div>
            <div v-else>
              <div class="pj_detail" v-for="item in evaluate">
                <div class="f_flex" style="font-size:13px;">
                  <div class="pj_img_div">
                    <img :src="item.img"/>
                  </div>
                  <div class="flex_1">
                    <div><p class="pj_name text_ellipsis">{{item.name}}</p><p style="color:red;float:right;">{{item.eva_mark}}分</p></div>
                    <div style="color:#999">{{item.eva_time}}<span style="margin-left:.5em;">{{item.model}}</span></div>
                    <div>{{item.eva_content}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-transfer-dom>
          <popup v-model="popup_model" position="bottom" style="background-color:white">
            <div class="img_border">
              <div style="width:90px;height:90px;"><img
                class="object_fit"
                src="http://pic.qiantucdn.com/58pic/14/59/28/74A58PICIrd_1024.jpg"/>
              </div>
            </div>
            <div style="display:inline-block;vertical-align: top;padding:10px;font-size:13px">
              <div style="font-size:14px;color:red">￥{{select_price?select_price:min_price+'~'+max_price}}</div>
              <div>库存{{select_stock?select_stock:sale_num}}件</div>
              <div>{{choose_item?choose_item:'请选择规格'}}</div>
            </div>
            <div style="padding:0 0 10px;margin:0 10px;">
              <p style="padding: 5px;color:black">规格</p>
              <checker
                default-item-class="demo4-item"
                selected-item-class="demo4-item-selected"
                disabled-item-class="demo4-item-disabled">
                <checker-item  v-for="item in models" style="margin-bottom: 5px;" :key="item.name" :value="item.name" @on-item-click="itemclick">{{item.name}}</checker-item>
              </checker>
            </div>
            <hr/>
            <x-number :title="num_title" v-model="roundValue" :min="1" @on-change="change"></x-number>
            <hr/>
            <div v-if="click_button!==0" class="confirm_button" @click="confirm_buy(0)">确定</div>
            <div v-else class="f_flex" style="margin-top:10px;">
              <a class="common_button flex_1 color_orange" @click="addCar">加入购物车</a>
              <a class="common_button flex_1 color_orangered" @click="goBuy">立即下单</a>
            </div>
          </popup>
        </div>
      </div>
      <div class="fixed_bottom">
        <div class="weui_flex" style="padding:0;text-align:center;height:44px;">
          <a style="flex:2;border-right:1px solid #ececec;"><router-link :to="{path:'store_detail',query: {store_id:store_id}}"><div style="height: 22px"><img style="height: 25px" src="./店铺.png"/></div><p style="font-size:12px">店铺</p></router-link></a>
          <a :href="'tel:'+tel" style="flex:2;border-right:1px solid #ececec;"><div style="height: 22px"><img style="height: 25px" src="./电话.png"/></div><p style="font-size:12px">电话</p></a>
          <a style="flex:2;border-right:1px solid #ececec;" @click="collect"><div style="height: 22px"><img style="height: 25px" src="./收藏.png"/></div><p style="font-size:12px">收藏</p></a>
          <a @click="showActionsheet(2)" class="cz_button" style="flex:4;background-color:#f06600;color:white">加入购物车</a>
          <a @click="showActionsheet(1)" class="cz_button" style="flex:4;background-color:#e9582a;color:white">立即下单</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Loading from '@/components/loading/dataLoading'
  import {
    Tab,
    TabItem,
    SwiperItem,
    TransferDom,
    Popup,
    Swiper,
    Group,
    Cell,
    Actionsheet,
    Checker,
    CheckerItem,
    XNumber
  } from 'vux'

  const list = () => ['图文描述', '评价内容']

  export default{
    name: 'goods_detail',
    data(){
      return {
        loading: true,//加载
        swiper_imgs: [],//商品图片
        swiper_index: 0,//当前切换到哪张图片
        cell_title: "选择规格和数量",
        popup_model: false,//购物车弹出
        roundValue: 1,
        num_title: "购买数量",
        index: 0,
        click_tab: '图文描述',
        list2: list(),
        goods_name:'',
        max_price:'',
        min_price:'',
        sale_num:'',
        models:[],
        desc:'',
        evaluate:[],
        detailimgs:'',
        store_id:'',
        goods_id:'',
        tel:'',
        trolley:'',
        choose_item:'',
        select_price:'',
        select_stock:'',
        click_button:'',
        model_id:'',
        this_price:0
      }
    },
    mounted(){
      let self = this;
      this.goods_id=this.$route.query.id;
      /*this.$http.get('/api/goodsDetails').then((data) => {
        self.swiper_imgs = data.body.data.wximgs;
        self.goods_name = data.body.data.name;
        self.max_price = data.body.data.max_price;
        self.min_price = data.body.data.price;
        self.sale_num = data.body.data.sale_num;
        self.models = data.body.data.models;
        self.evaluate = data.body.data.evaluate;
        self.desc = data.body.data.desc;
        self.detailimgs = data.body.data.detailimgs;
        self.store_id = data.body.data.store_id;
        self.goods_id = data.body.data.goods_id;
        self.tel = data.body.data.tel;
        self.trolley = data.body.data.trolley;
      }, () => {
        console.log(2);
      });*/
      const senddata = {
        "goods_id":this.goods_id
      };
      this.$http.post(service_url+'/o2o/shop/wx/goodinfo.do',senddata).then((data) => {
        self.swiper_imgs = data.body.fields.wximgs;
        self.goods_name = data.body.fields.name;
        self.max_price = data.body.fields.max_price;
        self.min_price = data.body.fields.price;
        self.sale_num = data.body.fields.sale_num;
        self.models = data.body.fields.models;
        self.evaluate = data.body.fields.evaluate;
        self.desc = data.body.fields.desc;
        self.detailimgs = data.body.fields.detailimgs;
        self.store_id = data.body.fields.store_id;
//        self.goods_id = data.body.fields.goods_id;
        self.tel = data.body.fields.tel;
        self.trolley = data.body.fields.trolley;
        if(self.max_price===self.min_price){
          self.this_price=self.max_price;
        }else{
          self.this_price=self.min_price+'~'+self.max_price;
        }
      });

      this.loading = false;
    },
    directives: {
      TransferDom
    },
    components: {
      Loading, Group, Cell, Actionsheet, Popup, Checker, CheckerItem, XNumber, Tab, TabItem, Swiper, SwiperItem
    },
    methods: {
      swiperChange(index){
        this.swiper_index = index
      },
      showActionsheet(mark){
          console.info(mark);
        this.popup_model = true;
        this.click_button=mark;
      },
      change (val) {
        console.log('change', val)
      },
      itemclick(val){
          this.choose_item=val;
          for(let i = 0;i<this.models.length;i++){
              if(val===this.models[i].name){
                this.select_stock=this.models[i].stock;
                this.select_price=this.models[i].price;
                this.model_id=this.models[i].modelid;
              }
          }
      },
      addCar(){
          this.confirm_buy(2);
      },
      goBuy(){
          this.confirm_buy(1);
      },
      collect(){
          this.click_button=0;
          this.confirm_buy(3);
      },
      confirm_buy(num){
          console.log(num);
        if(num!==3&&!this.choose_item){
            alert("请选择规格");
        }else{
          const senddata = {
            "data": [{
                  "goodsid":this.goods_id,
                  "modelid":this.model_id,
                  "counts":this.roundValue,
                  "price":this.select_price,
                }]
          };
          const insertData={
              "data":{
                "goodsid":this.goods_id,
                "modelid":this.model_id,
                "counts":this.roundValue,
                "price":this.select_price,
              }
          };
          const collectData={
              "data":{
                  "goodsid":this.goods_id
              }
          };
          /* click_button 1下单  2加入购物车  0选择商品*/
          console.log(this.click_button);
          if(this.click_button===1||num===1){
            this.$http.post(service_url+'/o2o/shop/wx/downorder.do',senddata).then( (data)=> {
//              this.$router.push({ path: '/store_up',query:{"type":1} });
              if(data.body.fields.status===0){
                alert("下单成功");
              }else{
                  alert(data.body.fields.error_reason);
              }
            })
          }else if(this.click_button===2||num===2){
            this.$http.post(service_url+'/o2o/shop/wx/insertcar.do',insertData).then( (data)=> {
              if(data.body.fields.status===0){
                alert("加入购物车成功");
              }else{
                alert(data.body.fields.error_reason);
              }
            })
          }else if(num===3){
            this.$http.post(service_url+'/o2o/shop/wx/insertcollection.do',collectData).then( (data)=> {
              if(data.body.fields.status===0){
                alert("收藏成功");
              }else{
                alert(data.body.fields.error_reason);
              }
            })
          }
          this.popup_model = false;
        }
      },

    }
  }
</script>

<style scoped>
  .body_background {
    background-color: #efeff4;
  }

  .body_white {
    background-color: white;
  }

  .describe {
    padding: 10px 20px;
  }

  .font_price {
    font-size: 18px;
    color: #f81706;
  }

  .font_name {
    font-size: 15px;
  }

  .font_sale {
    font-size: 13px;
    color: #999;
    margin-left: 5px;
  }

  .position-vertical-demo {
    background-color: #ffe26d;
    color: #000;
    text-align: center;
    padding: 15px;
  }

  .demo4-item {
    background-color: rgba(221, 221, 221, 0.38);
    color: #222;
    font-size: 13px;
    padding: 5px 10px;
    margin-right: 10px;
    line-height: 16px;
    border-radius: 15px;
  }

  .demo4-item-selected {
    background-color: #FF3B3B;
    color: #fff;
  }

  .demo4-item-disabled {
    color: #999;
  }

  .margin_top {
    margin-top: 10px;
  }

  .margin_bottom {
    margin-bottom: 10px;
  }

  .tw_detail {
    padding: .6rem .8rem;
  }

  .tw_detail .w_detail {
    border-radius: 6px;
    border: 1px solid purple;
    padding: .8rem;
    background-color: rgba(234, 213, 104, 0.18);
  }

  .object_fit {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .pj_detail {
    padding: 10px;
  }

  .pj_img_div {
    width: 45px;
    height: 45px;
    margin-right: 1rem;
  }

  .pj_img_div img {
    border-radius: 50%;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .pj_name {
    display: inline-block;
    width: 130px;
    line-height:13px;
  }

  .f_flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }

  .text_ellipsis {
    text-overflow: ellipsis; /*文字隐藏后添加省略号*/
    white-space: nowrap; /*强制不换行*/
    overflow: hidden; /*自动隐藏文字*/
  }

  .flex_1 {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }

  .confirm_button {
    width: 100%;
    text-align: center;
    padding: 10px 0;
    background-color: orangered;
    color: white;
    margin-top: 10px;
  }
  .common_button{
    text-align: center;
    padding: 10px 0;
    color: white;
  }
  .color_orangered{
    background-color: orangered;
  }
  .color_orange{
    background-color: orange;
  }
  .weui-cell:before {
    border-top: none;
  }

  hr {
    margin: 0 10px;
    height: 1px;
    border: none;
    border-top: 1px solid #D9D9D9;
  }
  .img_border{
    padding:3px;
    margin-left:10px;
    display:inline-block;
    margin-top:-10px;
    background-color:white;
    border:1px solid #ececec;
    border-radius: 5px
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
  .cz_button{
    line-height:44px;
  }
  .padding_bottom{
    padding-bottom:44px;
  }
</style>

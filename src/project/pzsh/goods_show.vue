<template>
  <div>
      <div :key="item" v-for="item in goods">
        <div class="weui_flex border_bottom_2" @click="showDetail(item.goods_id||item.order_id||item.id||item.ordernum,item.state)">
          <div class="img_div">
            <img class="object_fit" :src="item.img||item.goods_img||item.area_img"/>
          </div>

          <div class="ui_describe flex_1 posr font_14">
            <template v-if="type === '1'">
              <div style="max-height:45px;overflow: hidden">{{item.name}}</div>
              <div class="text_ellipsis width_13">规格: {{item.modelname}}</div>

              <!--<div class="color_red"><span class="mark_span">￥</span><span class="price_span">{{item.price}}</span><x-button mini plain type="primary" style="font-size:10px;float:right">删除商品</x-button></div>-->
              <div class="color_red" style="position:absolute;left:0;bottom: 0;"><span class="mark_span">￥</span><span class="price_span">{{item.price}}</span></div>
              <div style="position:absolute;right:0;bottom: 0;"><span class="mark_span">X</span><span style="font-size:16px;">{{item.num}}</span></div>
            </template>
            <template v-if="type === '2'">
              <div style="max-height:42px;overflow: hidden">{{item.name}}</div>
              <div class="text_ellipsis width_13">规格: {{item.model_name||item.modelname}}</div>
              <div class="color_red font_1_4" style="position:absolute;left:0;bottom:0">￥{{item.price}}</div>
              <div style="font-size:10px;position:absolute;right:0;bottom:0"><span class="mark_span">X</span><span
                class="price_span">{{item.num}}</span></div>
            </template>
            <template v-if="type === '3'">
              <div style="max-height:42px;overflow: hidden">{{item.name}}</div>
              <div class="color_red" style="position:absolute;left:0;bottom:0">￥{{item.price}}</div>
              <x-button mini plain type="primary" style="font-size:10px;position:absolute;right:0;bottom:0" @click.native="onDeleteClick(item.goods_id)">取消收藏</x-button>
            </template>
            <template v-if="type === '4'">
              <div style="max-height:47px;font-size:17px;overflow: hidden"><span style="font-size:14px;padding:2px 5px;border-radius:5px;border:1px solid #ad7de7;color:#ad7de7;margin-right:5px;vertical-align: text-bottom;">{{item.state_name}}</span>{{item.name}}</div>
              <div class="text_ellipsis width_13">发布日期: {{item.goods_date}}<span style="float:right;">{{item.quality}}成新</span></div>
              <div class="color_red font_1_4" style="position:absolute;left:0;bottom:0">￥{{item.price}}</div>
              <x-button v-if="item.status===3" mini plain type="primary"  style="font-size:10px;position:absolute;right:0;bottom:0;color:#ad7de7;border-color:#ad7de7" @click.native.stop="goods_down(item.id,item.status)">下架</x-button>
              <x-button v-if="item.status===1||item.status===2" mini plain type="primary"  style="font-size:10px;position:absolute;right:0;bottom:0;color:#ad7de7;border-color:#ad7de7" @click.native.stop="goods_on(item.id,item.status)">上架</x-button>
            </template>
            <template v-if="type === '5'">
              <div>{{item.project_name}}<span style="float:right;color:#ad7de7">{{item.state_name}}</span></div>
              <div>场地: {{item.area_name}}</div>
              <div>日期: {{item.area_date}}</div>
              <div class="color_red font_1_4" style="position:absolute;left:0;bottom:0">￥{{item.price}}元</div>
              <x-button v-if="item.state===0" mini plain type="primary"  style="font-size:10px;position:absolute;right:0;bottom:0;color:#ad7de7;border-color:#ad7de7" @click.native.stop="cancelReserve(item.order_id)">取消预约</x-button>
              <x-button v-if="item.state===1" mini plain type="primary"  style="font-size:10px;position:absolute;right:0;bottom:0;color:#ad7de7;border-color:#ad7de7" @click.native="showDetail(item.order_id,item.state)">详细</x-button>
              <x-button v-if="item.state===2" mini plain type="primary"  style="font-size:10px;position:absolute;right:0;bottom:0;color:#ad7de7;border-color:#ad7de7" @click.native="showDetail(item.order_id,item.state)">评价</x-button>
              <x-button v-if="item.state===3" mini plain type="primary"  style="font-size:10px;position:absolute;right:0;bottom:0;color:#ad7de7;border-color:#ad7de7" @click.native="showDetail(item.order_id,item.state)">查看评价</x-button>
            </template>
            <template v-if="type === '6'">
              <div>{{item.name}}<span style="float:right;color:#ad7de7">{{item.state_name}}</span></div>
              <div>订单号: {{item.order_num}}</div>
              <div>期望日期: {{item.hope_reserve}}</div>
              <div class="color_red font_1_4" style="position:absolute;left:0;bottom:0">￥{{item.price}}</div>
              <x-button v-if="item.state===0" mini plain type="primary"  style="font-size:10px;position:absolute;right:0;bottom:0;color:#ad7de7;border-color:#ad7de7" @click.native.stop="cancelReserve(item.order_id)">取消预订</x-button>
              <x-button v-if="item.state===1" mini plain type="primary"  style="font-size:10px;position:absolute;right:0;bottom:0;color:#ad7de7;border-color:#ad7de7" @click.native="showDetail(item.order_id,item.state)">详细</x-button>
              <x-button v-if="item.state===2" mini plain type="primary"  style="font-size:10px;position:absolute;right:0;bottom:0;color:#ad7de7;border-color:#ad7de7" @click.native.stop="goEvaluate(item.order_id)">评价</x-button>
              <x-button v-if="item.state===4" mini plain type="primary"  style="font-size:10px;position:absolute;right:0;bottom:0;color:#ad7de7;border-color:#ad7de7" @click.native.stop="seeEvaluate(item.order_id)">查看评价</x-button>
            </template>
          </div>
        </div>
      </div>
      <div v-transfer-dom>
        <confirm v-model="show"
                 title="提示"
                 @on-cancel="onCancel"
                 @on-confirm="onConfirm"
                 @on-show="onShow"
                 @on-hide="onHide">
          <p style="text-align:center;">{{confirm_text}}</p>
        </confirm>
      </div>
    <toast v-model="show_toast">{{toast_text}}</toast>
  </div>
</template>

<script>
  import {XButton,Alert,Confirm,Toast,TransferDomDirective as TransferDom} from 'vux'
  export default{
    props: {
      goods: Array,
      path:{
        type: String,
      },
      route_type:{
        type:String
      },
      type: {
        type: String,
        default: '1'
      },
    },
    directives: {
      TransferDom
    },
    components: {
      XButton,Alert,Confirm,Toast
    },
    data(){
        return{
          confirm_text:"",
          show:false,
          show_toast:false,
          toast_text:"",
          mark:0,   //用来标识是哪个按钮点击的  1.上架 2.下架 3.取消收藏 4.取消预约
          this_id:0,  //正在操作的那条数据的id
          status:0,   //当前操作的数据的状态
        }
    },
    methods:{
      onCancel () {
        console.log('on cancel')
      },
      onConfirm () {
        switch(this.mark){
          case 1:
            let url = service_url+"/o2o/flea/wx/shelves?orderid="+this.this_id;
            let this_url = this.status===1?url+"&shelvestype=1":url+"&shelvestype=0";
            let this_status_name = this.status===1?"待审核":"转让中";
            let this_status = this.status===1?0:3;
            if(service_url){
              this.$http.get(this_url).then((data)=>{
                if(data.body.result.status===0){
                  this.show_toast=true;
                  this.toast_text="上架成功";
                  for(let i = 0;i<this.goods.length;i++){
                    if(this.this_id===this.goods[i].id){
                      this.goods[i].state_name=this_status_name;
                      this.goods[i].status=this_status;
                    }
                  }
                }
              })
            }else{
              this.show_toast=true;
              this.toast_text="上架成功";
              for(let i = 0;i<this.goods.length;i++){
                  if(this.this_id===this.goods[i].id){
                      this.goods[i].state_name=this_status_name;
                      this.goods[i].status=this_status;
                  }
              }
            }
              break;
          case 2:
            if(service_url){
              this.$http.get(service_url+"/o2o/flea/wx/shelf?orderid="+this.this_id).then((data)=>{
                if(data.body.result.status===0){
                  this.show_toast=true;
                  this.toast_text="下架成功";
                  for(let i = 0;i<this.goods.length;i++){
                    if(this.this_id===this.goods[i].id){
                      this.goods[i].state_name="已下架";
                      this.goods[i].status=2;
                    }
                  }
                }
              })
            }else{
              this.show_toast=true;
              this.toast_text="下架成功";
              for(let i = 0;i<this.goods.length;i++){
                if(this.this_id===this.goods[i].id){
                  this.goods[i].state_name="已下架";
                  this.goods[i].status=2;
                }
              }
            }
              break;
          case 3:
              break;
          case 4:
            let self = this;
            if (service_url) {
              const item = {
                order_id: this.this_id
              };
              let get_url;
              if (this.type === '6') {
                if (this.route_type == 1) {
                  get_url = service_url + "/o2o/hk/wx/cancel?id=" + this.this_id;
                } else if (this.route_type == 2) {
                  get_url = service_url + "/o2o/reno/wx/cancel?id=" + this.this_id;
                }
                this.$http.get(get_url).then((data) => {
                  if (data.body.status === 0) {
                    this.show_toast=true;
                    this.toast_text="取消预订成功";
                    for(let i = 0;i<this.goods.length;i++){
                      if(this.this_id===this.goods[i].order_id){
                        this.goods[i].state_name="已取消";
                        this.goods[i].state=3;
                      }
                    }
//                    self.$router.push({path: '/reserve_success', query: {route_type: next_type, type: type}});
                  }
                })
              } else if (this.type === '5') {
                get_url = service_url + "/o2o/club/wx/preCancel";
                this.$http.post(get_url, item).then((data) => {
                  if (data.body.status === 0) {
                    this.show_toast=true;
                    this.toast_text="取消预订成功";
                    for(let i = 0;i<this.goods.length;i++){
                      if(this.this_id===this.goods[i].order_id){
                        this.goods[i].state_name="已取消";
                        this.goods[i].state=4;
                      }
                    }
//                    self.$router.push({path: '/reserve_success', query: {route_type: next_type, type: type}});
                  }
                })
              }

            } else {
//              this.$router.push({path: '/reserve_success', query: {route_type: 10, type: 1}});
              this.show_toast=true;
              this.toast_text="取消预订成功";
              for(let i = 0;i<this.goods.length;i++){
                if(this.this_id===this.goods[i].order_id){
                  this.goods[i].state_name="已取消";
                  this.goods[i].state=3;
                }
              }
            }
              break;
        }
      },
      onHide () {
        console.log('on hide')
      },
      onShow () {
        console.log('on show')
      },
      onDeleteClick(key){
        this.emitEvent('on-click-menu', key)
      },
      emitEvent (event, menu, shouldClose = true) {
        if (event === 'on-click-menu' && !/.noop/.test(menu)) {
          this.$emit(event, menu)
          this.$emit(`${event}-${menu}`)
          shouldClose && (this.show = false)
        }
      },
      goEvaluate(order_id){
          let route_url;
          let route_num;
          if(this.type==='5'){
            route_num=7;
            route_url="/o2o/club/wx/addEvaluate";
          }else if(this.type==='6'){
              if(this.route_type==1){
                route_url="/o2o/hk/wx/addEvaluate";
              }else{
                route_url="/o2o/reno/wx/addEvaluate";
              }
            route_num=11;
          }
        this.$router.push({
          path:'/area_evaluate',
          query:{route_type:1,order_id:order_id,route_url:route_url,route_num:route_num}
        })
      },
      cancelReserve(order_id){
        /*let self = this;
        if(service_url){
          const item = {
            order_id:order_id
          };

          let get_url;
          let next_type;
          let type;
          if(this.type==='6'){
            console.log("进入type");
              if(this.route_type==1){
                console.log("进入保洁");
                get_url = service_url+"/o2o/hk/wx/cancel?id="+order_id;
                type=1;
              }else if(this.route_type==2){
                console.log("进入微装");
                get_url = service_url+"/o2o/reno/wx/cancel?id="+order_id;
                type=2;
              }
            next_type=10;
            this.$http.get(get_url).then((data)=>{
              if(data.body.status===0){
                  self.$router.push({path:'/reserve_success',query:{route_type:next_type,type:type}});
              }
            })
          }else if(this.type==='5'){
            get_url = service_url+"/o2o/club/wx/preCancel";
            next_type=6;
            type=2;
            this.$http.post(get_url,item).then((data)=>{
              if(data.body.status===0){
                self.$router.push({path:'/reserve_success',query:{route_type:next_type,type:type}});
              }
            })
          }

        }else{
          this.$router.push({path:'/reserve_success',query:{route_type:10,type:1}});
        }*/
        this.show=true;
        this.confirm_text="是否取消预约？";
        this.mark=4;
        this.this_id=order_id;
      },
      showDetail(order_id,state){
          if(this.type==='1'){
            /*this.$router.push({
              path:this.path,
              query:{ordernum:order_id,type:2}
            })*/
          }
        if(this.type==='3'){
          this.$router.push({
            path:this.path,
            query:{id:order_id,type:2}
          })
        }
          if(this.type==='4'){
            this.$router.push({
              path:this.path,
              query:{goods_id:order_id}
            })
          }
          if(this.type==='5'){
            this.$router.push({
              path:this.path,
              query:{route_type:2,order_id:order_id,route_state:state}
            })
          }else if(this.type==='6'){
            this.$router.push({
              path:this.path,
              query:{route_type:this.route_type,wb_type:2,order_id:order_id,route_state:state}
            })
          }

      },
      seeEvaluate(order_id){
        let route_url;
        if(this.type==='5'){
          route_url="/o2o/club/wx/preEvaluate";
        }else if(this.type==='6'){
          if(this.route_type==1){
            route_url="/o2o/hk/wx/preEvaluate";
          }else{
            route_url="/o2o/reno/wx/preEvaluate";
          }

        }
        this.$router.push({
          path:'/area_evaluate',
          query:{route_type:2,order_id:order_id,route_url:route_url}
        })
      },
      /*shelvestype  1是未通过再上架  0是手动下架再上架*/
      goods_on(id,status){
        this.show=true;
        this.confirm_text="确定上架吗";
        this.mark = 1;
        this.this_id=id;
        this.status= status;
      },
      goods_down(id,status){
        this.show=true;
        this.confirm_text="确定下架吗";
        this.mark = 2;
        this.this_id=id;
        this.status= status;
      }
    }
  }
</script>

<style scoped>
  .font_14 {
    font-size: 14px;
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
    font-size: 13px;
    margin-top:3px;
    color:#999;
  }

  .text_ellipsis {
    text-overflow: ellipsis; /*文字隐藏后添加省略号*/
    white-space: nowrap; /*强制不换行*/
    overflow: hidden; /*自动隐藏文字*/
  }

  .color_red {
    font-size:16px;
    color: red;
  }

  .mark_span {
    font-size: 13px;
  }

  .price_span {
    font-size: 20px;
  }



</style>

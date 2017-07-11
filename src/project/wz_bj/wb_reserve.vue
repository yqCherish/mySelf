<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center;"></loading>-->
    <loading v-model="isLoading" :text="alert_text"></loading>
    <div>
      <group :title="this_title">
        <x-input v-if="wb_type!==2" labelWidth="5em" title="姓名" placeholder="请输入姓名" v-model="user_name" :show-clear="false"></x-input>
        <x-input v-if="wb_type===2" labelWidth="5em" title="姓名" placeholder="请输入姓名" v-model="user_name" :show-clear="false" disabled></x-input>
        <div style="display:flex;align-items: center;padding:5px 10px 5px 0;margin-left:15px;border-top:1px solid #ececec;">
          <div style="width:5em">性别</div>
          <checker
            v-model="sex"
            default-item-class="demo5-item"
            selected-item-class="demo5-item-selected"
          >
            <checker-item v-show="sex==item.name" style="font-size:14px;" v-for="item in models" :key="item.name" :value="item.name" @on-item-click="itemclick" disabled>{{item.name}}</checker-item>
          </checker>
        </div>
          <!--<checker v-model="sex"
                   default-item-class="demo4-item"
                   selected-item-class="demo4-item-selected"
                   disabled-item-class="demo4-item-disabled">
            <checker-item  v-for="item in models" style="margin-bottom: 5px;" :key="item.name" :value="item.name" @on-item-click="itemclick" disabled>{{item.name}}</checker-item>
          </checker>-->

        <x-input v-if="wb_type!==2" title="手机" labelWidth="5em" placeholder="请输入手机号" v-model="user_tel" :show-clear="false"></x-input>
        <x-input type="tel" v-if="route_type===1&&wb_type!==2" :title="price_title" labelWidth="5em" placeholder="请输入数量" v-model="area" :show-clear="false" @input.native="change"></x-input>
        <x-input type="tel" v-if="route_type===1&&wb_type===2" :title="price_title" labelWidth="5em" v-model="area" :show-clear="false" disabled></x-input>
        <!--<x-number v-if="route_type===1" align="left" title="<p style='width:5em'>面积(平米)</p>" v-model="area" button-style="round" width="70px" :min="0" fillable @on-change="change"></x-number>-->
        <x-input v-if="route_type===1" title="总价(元)" labelWidth="5em" v-model="total_price" :show-clear="false" disabled></x-input>
        <x-textarea v-if="wb_type!==2" title="详细地址" :show-counter="false" :rows="3" v-model="user_address" autosize></x-textarea>
        <x-textarea v-if="wb_type===2" title="详细地址" :show-counter="false" :rows="3" v-model="user_address" autosize readonly></x-textarea>
        <x-textarea v-if="wb_type!==2" title="详细描述" placeholder="请输入" :show-counter="false" :rows="3" v-model="content" autosize></x-textarea>
        <x-textarea v-if="wb_type===2" title="详细描述" placeholder="请输入" :show-counter="false" :rows="3" v-model="content" autosize readonly></x-textarea>
        <datetime v-if="wb_type!==2" v-model="wishdate" placeholder="请选择期望时间" :start-date="startDate" format="YYYY-MM-DD HH:mm" @on-change="setBegin" title="期望时间" year-row="{value}年" month-row="{value}月" day-row="{value}日" confirm-text="完成" cancel-text="取消"></datetime>
        <cell v-if="wb_type===2" title="期望时间" :value="wishdate"></cell>
      </group>
      <div v-if="wb_type===2&&state!==0">
        <timeline>
          <timeline-item :key="item" v-for = "item in time_line">
            <h4>{{item.desc}}</h4>
            <p>{{item.lastUpdateTime}}</p>
          </timeline-item>
        </timeline>
      </div>
      <div v-if="wb_type===2&&state===0" style="padding:20px 10px"><x-button  type="primary" class="zj_button" @click.native="cancel_reserve">取消预订</x-button></div>
      <div v-if="wb_type===1" style="padding:20px 10px"><x-button type="primary" class="zj_button" @click.native="save_msg">提交</x-button></div>
    </div>
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
  import {setTitle} from '@/common/js/common';
  import {XInput,Group,Cell,Checker,CheckerItem,XTextarea,Datetime,XButton,Timeline, TimelineItem,Loading,Alert,XNumber,Toast,Confirm,TransferDomDirective as TransferDom} from 'vux';
  export default{
    data(){
      return{
        user_name:"",
        user_tel:"",
        user_address:"",
        models:[
          {
              name:"男"
          },{
            name:"女"
          }
        ],
        sex:"",
        content:"",
        wishdate:"",
        date_mark:0,
        route_type:0,//1保洁 2微装
        wb_type:0,//1预订，2详细
        order_id:0,//订单id
        time_line:[],
        id:"",
        state:-1,
        this_title:"",
        startDate:"",
        endDate:"",
        isLoading:false,
        alert_text:"",
        confirm_show:false,
        dialog_title:"",
        confirm_content:"",
        area:0,
        show_toast:false,
        toast_text:"",
        confirm_text:"",
        show:false,
        total_price:0,
        unitprice:0,
        price_title:""
      }
    },
    directives: {
      TransferDom
    },
    components:{
      XInput,Group,Cell,Checker,CheckerItem,XTextarea,Datetime,XButton,Timeline, TimelineItem,Loading,Alert,XNumber,Toast,Confirm
    },
    mounted(){
      let self = this;
      let oDate = new Date();
      this.startDate=oDate.getFullYear()+"-"+(oDate.getMonth()+1)+"-"+oDate.getDate();
      this.route_type=parseInt(this.$route.query.route_type);
      this.wb_type=parseInt(this.$route.query.wb_type);
      if(service_url){
          if(this.wb_type===1){
            this.id=parseInt(this.$route.query.id);
            this.this_title="预约服务";
            setTitle("预约服务");
            if(this.route_type===1){
              this.$http.get(service_url+"/o2o/hk/wx/userinfo?id="+this.id).then((data)=>{
                self.user_name = data.body.data.name;
                self.user_tel = data.body.data.tel;
                self.user_address = data.body.data.address;
                self.unitprice = data.body.data.unitprice;
                self.price_title = "数量("+data.body.data.calunit.substring(2)+")";
                let sex = parseInt(data.body.data.sex);
                self.sex=sex?"女":"男";
//              self.sex = data.body.data.sex;
//                self.time_line = data.body.data.time_line;
              })
            }else{
              this.$http.get(service_url+"/o2o/reno/wx/userinfo?id="+this.id).then((data)=>{
                self.user_name = data.body.data.name;
                self.user_tel = data.body.data.tel;
                self.user_address = data.body.data.address;
                let sex = parseInt(data.body.data.sex);
                self.sex=sex?"女":"男";
//              self.sex = data.body.data.sex;
//                self.time_line = data.body.data.time_line;
              })
            }
          }else{
            this.order_id=parseInt(this.$route.query.order_id);
            this.this_title="预约详情";
            setTitle("预约详情");
            if(this.route_type===1){
              this.$http.get(service_url+"/o2o/hk/wx/orderdetails?id="+this.order_id).then((data)=>{
                self.user_name = data.body.data.user_name;
                self.user_tel = data.body.data.user_tel;
                self.user_address = data.body.data.user_address;
                self.total_price = data.body.data.price;
                let sex = parseInt(data.body.data.sex);
                self.price_title = "数量("+data.body.data.calunit.substring(2)+")";
                self.sex=sex?"女":"男";
                self.time_line = data.body.data.time_line;
                self.content = data.body.data.content;
                self.area = data.body.data.number;
                self.wishdate = data.body.data.hope_reserve;
                self.state = data.body.data.state;
                self.loading = false;
              });
            }else{
              this.$http.get(service_url+"/o2o/reno/wx/orderdetails?id="+this.order_id).then((data)=>{
                self.user_name = data.body.data.user_name;
                self.user_tel = data.body.data.user_tel;
                self.user_address = data.body.data.user_address;
                let sex = parseInt(data.body.data.sex);
                self.sex=sex?"女":"男";
                self.time_line = data.body.data.time_line;
                self.content = data.body.data.content;
                self.wishdate = data.body.data.hope_reserve;
                self.state = data.body.data.state;
                self.loading = false;
              });
            }

          }
      }else{
        this.$http.get("/api/wb_reserve").then((data)=>{
          self.user_name = data.body.data.data.name;
          self.user_tel = data.body.data.data.tel;
          self.unitprice = data.body.data.data.unitprice;
          self.user_address = data.body.data.data.address;
          self.sex = data.body.data.data.sex;
          self.content = data.body.data.data.content;
          self.wishdate = data.body.data.data.hope_reserve;
          self.time_line = data.body.data.data.time_line;
          self.total_price = data.body.data.data.price;
          self.area = data.body.data.data.number;
          self.price_title = "数量("+data.body.data.data.calunit.substring(2)+")";
          self.loading = false;
        })
      }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      getLocalTime1(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,17)
      },
      setBegin(value){
        let owishdate = this.getownTime(value);
        if(owishdate <= Date.parse(new Date())){
          this.dialog_title="提示";
          this.confirm_content="开始时间应该大于当前时间";
          this.confirm_show=true;
          this.date_mark=0;
        }else{
          let timestamp2 = Date.parse(new Date(value));
          timestamp2=timestamp2/1000;
          this.wishdate=timestamp2;
          this.date_mark=1;
        }

      },
      getownTime(time){
        var arr = time.split(/[- :]/);

        return (new Date(arr[0], arr[1]-1, arr[2],arr[3],arr[4])).getTime();
      },
      itemclick(){

      },
      save_msg(){

        if(this.route_type===1&&!this.area){
          this.dialog_title="提示";
          this.confirm_content="需要填写数量信息";
          this.confirm_show=true;
          return;
        }
        if(!this.wishdate){
          this.dialog_title="提示";
          this.confirm_content="需要填写期望时间";
          this.confirm_show=true;
          return;
        }
        if(!this.date_mark){
          this.dialog_title="提示";
          this.confirm_content="请正确选择期望时间";
          this.confirm_show=true;
          return;
        }
          this.isLoading=true;
          this.alert_text="保存中";
          const item = {
              "name":this.user_name,
              "sex":this.sex,
              "tel":this.user_tel,
              "address":this.user_address,
              "id":this.id,
              "content":this.content,
              "hope_reserve":this.wishdate
          };
          const item2={
            "name":this.user_name,
            "sex":this.sex,
            "tel":this.user_tel,
            "address":this.user_address,
            "id":this.id,
            "content":this.content,
            "hope_reserve":this.wishdate,
            "number":this.area,
            "total_price":this.total_price
          };
          if(service_url){
            if(this.route_type===1){
              this.$http.post(service_url+"/o2o/hk/wx/save",item2).then((data)=>{
                this.isLoading=false;
                if(data.body.status===0){
                  this.show_toast=true;
                  this.toast_text="保存成功";
                  setTimeout(this.go_next,1000);
                  /*this.$router.push({
                   path:"reserve_success",query:{
                   route_type:9,type:1
                   }
                   })*/
                }else{
                  this.dialog_title="提示";
                  this.confirm_content=data.body.error_reason;
                  this.confirm_show=true;
                }
              })
            }else{
              this.$http.post(service_url+"/o2o/reno/wx/save",item).then((data)=>{
                this.isLoading=false;
                if(data.body.status===0){
                  this.show_toast=true;
                  this.toast_text="保存成功";
                  setTimeout(this.go_next,1000);
                  /*this.$router.push({
                   path:"reserve_success",query:{
                   route_type:9,type:2
                   }
                   })*/
                }else{
                  this.dialog_title="提示";
                  this.confirm_content=data.body.error_reason;
                  this.confirm_show=true;
                }
              })
            }
          }else{
            this.isLoading=false;
            this.show_toast=true;
            this.toast_text="保存成功";
            setTimeout(this.go_next,1000);
          }
      },
      go_next(){
        if(this.route_type===1){
          this.$router.push({path:"common_order/2"})
        }else if(this.route_type===2){
          this.$router.push({path:"common_order/1"})
        }
      },
      cancel_reserve(){
        this.show=true;
        this.confirm_text="是否取消预约？";
      },
      onConfirm(){
        this.isLoading=true;
        this.alert_text="取消中";
        let get_url;
        if(this.route_type===1){
          get_url = service_url+"/o2o/hk/wx/cancel?id="+this.order_id;
        }else{
          get_url = service_url+"/o2o/reno/wx/cancel?id="+this.order_id;
        }
        if(service_url){
          this.$http.get(get_url).then((data)=>{
            this.isLoading=false;
            if(data.body.status===0){
              this.show_toast=true;
              this.toast_text="取消预约成功";
              setTimeout(this.go_back,1000);
//            self.$router.push({path:'/reserve_success',query:{route_type:10,type:type}});
            }
          })
        }else{
          this.isLoading=false;
          this.show_toast=true;
          this.toast_text="取消预约成功";
          setTimeout(this.go_back,1000);
        }
      },
      go_back(){
          this.$router.go(-1);
      },
      change(){
        this.total_price=this.area*this.unitprice;
        console.log(this.total_price);
      }
    }
  }
</script>

<style scoped>
  .demo5-item {
    border: 1px solid #ad7de7;
    border-radius:5px;
    padding: 2px 15px;
    margin:5px;
  }
  .demo5-item-selected {
    /*background: #ffffff url(../assets/demo/checker/active.png) no-repeat right bottom;*/
    color:white;
    background-color:#ad7de7;
  }
</style>

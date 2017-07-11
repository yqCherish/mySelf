<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div>
      <group title="会所预约">
        <datetime :start-date="start_date" :end-date="end_date" v-model="area_time" @on-change="change" title="预约日期"></datetime>
        <cell title="选择场地" :value="area_value" is-link @click.native="chooseArea"></cell>
      </group>
      <group title="场次">
        <tab :line-width=2 active-color="#ad7de7" v-model="index">
          <tab-item class="vux-center" :selected="click_tab === item" v-for="(item, index) in list2" @click="click_tab = item"
                    :key="index">{{item}}
          </tab-item>
        </tab>
        <div style="padding:10px 5px;">
          <div v-if="index==0">
            <checker
              v-model="demo6"
              type="checkbox"
              default-item-class="demo5-item"
              selected-item-class="demo5-item-selected"
              disabled-item-class="demo5-item-disabled"
            >
              <checker-item style="font-size:14px;" v-for="item in morning" :key="item.key" :value="item.section" :disabled="item.status!==100" @on-item-click="itemclick">{{item.section}}</checker-item>
            </checker>
          </div>
          <div v-if="index==1">
            <checker
              v-model="demo6"
              type="checkbox"
              default-item-class="demo5-item"
              selected-item-class="demo5-item-selected"
              disabled-item-class="demo5-item-disabled"
            >
              <checker-item style="font-size:14px;" v-for="item in afternoon" :key="item.key" :value="item.section" :disabled="item.status!==100" @on-item-click="itemclick">{{item.section}}</checker-item>
            </checker>
          </div>
          <div v-if="index==2">
            <checker
              v-model="demo6"
              type="checkbox"
              default-item-class="demo5-item"
              selected-item-class="demo5-item-selected"
              disabled-item-class="demo5-item-disabled"
            >
              <checker-item style="font-size:14px;" v-for="item in night" :key="item.key" :value="item.section" :disabled="item.status!==100" @on-item-click="itemclick">{{item.section}}</checker-item>
            </checker>
          </div>
        </div>

      </group>
      <!--底部文字-->
      <div style="padding:15px;font-size:14px;">
        <p style="color:#ad7de7">为了保障服务，相关不明事项请咨询服务台</p>
      </div>
      <!--下一步按钮-->
      <div style="padding:20px 10px;">
        <x-button class="zj_button" type="primary" @click.native="goNext">下一步</x-button>
      </div>
      <!--弹出栏-->
      <actionsheet v-model="show_ac" :menus="area_list" @on-click-menu="click_area"></actionsheet>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle,GetDateStr} from '@/common/js/common';
  import {Group,Cell,Datetime,Tab, TabItem, Checker, CheckerItem,XButton,Actionsheet,Alert} from 'vux';

  const list = () => ['上午', '下午',"晚上"];

  export default{
    data(){
      return{
        start_date:"",
        end_date:"",
        loading:true,
        area_value:"",
        area_time:"",
        click_tab:"上午",
        index:0,
        list2:list(),
        demo6: [],
        time_list:[],
        show_ac:false,
        area_list:[],
        choose_key:'',
        project_id:"",
        choose_item:"",
        morning:[],
        afternoon:[],
        night:[],
        choose_time_key:[],
        confirm_show:false,
        dialog_title:"",
        confirm_content:""
      }
    },
    components:{
      loading,Group,Cell,Datetime,Tab, TabItem,Checker,CheckerItem,XButton,Actionsheet,Alert
    },
    mounted(){
      setTitle("场地选择");
      this.project_id=this.$route.query.project_id;
      let d = new Date();
      this.start_date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
      const item = {
        project_id:this.project_id
      };
      if(service_url){
        this.$http.post(service_url+'/o2o/club/wx/preDay',item).then((data)=>{
          this.end_date=GetDateStr(data.body.data.can_reserve_data);
          this.start_date=GetDateStr(data.body.data.close_reserve_data);
        })
      }else{
        this.$http.get('/api/area_choose_date').then((data) => {
          let period = data.body.data.data.can_reserve_data;
          this.end_date=GetDateStr(period);
        });
      }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      chooseArea(){
          if(this.area_list.length!==0){
            this.show_ac=true;
          }else{
            this.dialog_title="提示";
            this.confirm_content="请先选择时间";
            this.confirm_show=true;
          }


      },
      change (value) {
          let self = this;
          if(value){
            self.area_time = value;
              const senddata = {
                "project_id":this.project_id,
                "choose_date":self.area_time,
              };
              if(service_url){
                this.$http.post(service_url+'/o2o/club/wx/preSite',senddata).then((data) => {
                  let area_list = data.body.data;
                  let json_area={};
                  for(let i=0;i<area_list.length;i++){
                    json_area[area_list[i].key]=area_list[i].value;
                  }
                  self.area_list = json_area;
                })
              }else{
                this.$http.get('/api/area_choose_area').then((data) => {
                  let area_list = data.body.data.data;
                  let json_area={};
                  for(let i=0;i<area_list.length;i++){
                    json_area[area_list[i].key]=area_list[i].value;
                  }
                  self.area_list = json_area;
                });
              }
          }
      },
      goNext(){
        /*const arr=[];
        const arr_1={
          label:"预订场地",
          value:this.area_value
        };
        const arr_2={
          "label":"预约日期",
          "value":this.area_time
        };
        let this_sum=0;
        arr.push(arr_1);
        arr.push(arr_2);
        for(let i =0;i<this.demo6.length;i++){
          if(i===0){
            arr.push({
              "label":"预约时间",
              "value":this.demo6[i]
            })
          }else{
            arr.push({
              "label":"",
              "value":this.demo6[i]
            })
          }
          this_sum+=parseInt(this.getPrice(this.demo6[i]));
        }
        const arr_3={
          "label":"预计费用",
          "value":this_sum+"元"
        };
        arr.push(arr_3);
        const send_arr=[];
        send_arr.push(arr);*/
        let time_arr=[];
        let this_sum=0;
        let first_time="";
        for(let i =0;i<this.demo6.length;i++){
            /*for(this.demo6[i] in this.time_list){
                this.choose_time_key.push(this.time_list.key);
            }*/
            for(let j=0;j<this.time_list.length;j++){
                if(this.demo6[i]===this.time_list[j].section){
                  this.choose_time_key.push(this.time_list[j].key);
                }
            }
            if(i===0){
              first_time=this.demo6[i];
            }else{
              time_arr.push(this.demo6[i]);
            }
          this_sum+=parseInt(this.getPrice(this.demo6[i]));
        }
        const obj={
          area_value:this.area_value,
          area_time:this.area_time,
          first_time:first_time,
          time_arr:time_arr,
          this_sum:this_sum
        };
        let send_str = JSON.stringify(obj);
        this.$router.replace({path: 'area_reserve',query:{"list":send_str,"route_type":1,"choose_time_key":this.choose_time_key,"area_key":this.choose_key,"choose_date":this.area_time}})
      },
      click_area(key){
          this.choose_key=key;
          for(let i in this.area_list){
              if(i===key){
                this.area_value=this.area_list[i];
                let self = this;
                const senddata = {
                  "project_id":self.project_id,
                  "choose_date":self.area_time,
                  "choose_key":self.choose_key,
                };
                if(service_url){
                  this.$http.post(service_url+"/o2o/club/wx/preSPeriod",senddata).then((data) => {
                    self.time_list=data.body.data;
                    for(let i=0;i<self.time_list.length;i++){
                      let end_str=parseInt(self.split_hour(self.time_list[i].end_time));
                      if(end_str<=12){
                        self.morning.push(self.time_list[i]);
                      }else if(12<end_str&&end_str<=18){
                        self.afternoon.push(self.time_list[i]);
                      }else if(end_str>18){
                        self.night.push(self.time_list[i]);
                      }
                    }
                  })
                }else{
                  this.$http.get('/api/area_choose_time').then((data) => {
                    self.time_list=data.body.data.data;
                    for(let i=0;i<self.time_list.length;i++){
                      let end_str=parseInt(self.split_hour(self.time_list[i].end_time));
                      if(end_str<=12){
                        self.morning.push(self.time_list[i]);
                      }else if(12<end_str&&end_str<=18){
                        self.afternoon.push(self.time_list[i]);
                      }else if(end_str>18){
                        self.night.push(self.time_list[i]);
                      }
                    }
                  });
                }
              }
          }
      },
      itemclick(val){
        this.choose_item=val;
      },
      getPrice(time){
          for(let i =0;i<this.time_list.length;i++){
              if(this.time_list[i].section===time){
                return this.time_list[i].price
              }
          }
      },
      split_hour(time){
          let strs=[];
          let strs2=[];
          strs=time.split(":");
          strs2=strs[0].split("");
          if(strs2[0]==0){
              return strs2[1];
          }else{
              return strs[0];
          }
      }
    }
  }
</script>

<style scoped>
  .demo5-item {
    border: 1px solid #ad7de7;
    border-radius:5px;
    padding: 5px 15px;
    margin:5px;
  }
  .demo5-item-selected {
    /*background: #ffffff url(../assets/demo/checker/active.png) no-repeat right bottom;*/
    color:white;
    background-color:#ad7de7;
  }
  .demo5-item-disabled{
    color: #888;
    background-color: #dfdfdf;
    border: 1px solid #bfbfbf;
  }
</style>

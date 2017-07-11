<template>
  <div>
    <div>
      <tab :line-width=2 active-color="#ad7de7" v-model="list_index">
        <tab-item class="vux-center" :selected="click_tab === item" v-for="(item, index) in tabList" @click="click_tab = item"
                  :key="index" @on-item-click="onItemClick">{{item}}
        </tab-item>
      </tab>
      <div style="background-color:white;" v-if="list_index==0">
        <cell
          title="公共"
          is-link
          :border-intent="false"
          :arrow-direction="showContent ? 'up' : 'down'"
          @click.native="showContent = !showContent"></cell>
        <checklist class="slide" :class="showContent?'animate':''" :options="commonList" v-model="common_choose" @on-change="common_change"></checklist>
        <cell
          title="单元"
          is-link
          :border-intent="false"
          :arrow-direction="showContent2 ? 'up' : 'down'"
          @click.native="showContent2 = !showContent2"></cell>
        <!--<checklist class="slide" :class="showContent2?'animate':''" :options="opersonList" v-model="person_choose" @on-change="common_change"></checklist>-->
        <!--<checklist class="slide padding" :class="showContent2?'animate':''" :key="item.name" v-for="item in personList" v-model="val2"  :title="item.name" :options="item.cell" @on-change="personal_change"></checklist>-->
        <div class="slide" :class="showContent2?'animate':''">
          <div style="padding:10px 15px;border-top:1px solid #ececec;" v-for = "(items,index1) in personList">
            <div style="color:#999;">{{items.name}}</div>
            <div @click="choose_checkbox(index1,index2)" class="weui_flex" style="border-top:1px solid #ececec;padding:10px 0;" v-for="(item,index2) in items.cell">
              <div class="weui-cell__hd">
                <input :id="'house_'+index1+'_'+index2" type="checkbox" class="weui-check" name="checkbox">
                <i class="weui-icon-checked"></i>
                <div style="display:none;" :id="'desc_'+index1+'_'+index2">{{item.alldesc}}</div>
                <div style="display:none;" :id="'id_'+index1+'_'+index2">{{item.val}}</div>
              </div>
              <div>{{item.desc}}</div>
            </div>
          </div>
        </div>
        <cell :border-intent="false" title="已选门" style="border-bottom:1px solid #ececec"></cell>
        <checker style="padding:5px 10px;"
          default-item-class="demo5-item"
          >
          <checker-item  v-for="item in pubdesc" style="font-size:14px;" :key="item" :value="item">{{item}}</checker-item>
          <checker-item  v-for="item in perdesc" style="font-size:14px;" :key="item" :value="item">{{item}}</checker-item>
        </checker>
        <x-textarea v-model="remark" :max="20" placeholder="请填写申请说明"></x-textarea>
        <div style="padding:20px 10px">
          <x-button type="primary" class="zj_button" @click.native="qxsq_comfirm">确认</x-button>
        </div>
      </div>
      <div style="background-color:white;" v-if="list_index==1">
        <cell
          title="选择租户"
          is-link
          :arrow-direction="showContent3 ? 'up' : 'down'"
          @click.native="showContent3 = !showContent3"></cell>
        <checklist class="slide" :class="showContent3?'animate':''" :options="tenantList" v-model="tenant_choose" @on-change="change3"></checklist>
        <cell
          title="开通门禁范围"
          is-link
          :arrow-direction="showContent4 ? 'up' : 'down'"
          @click.native="showContent4 = !showContent4"></cell>
        <checklist class="slide" :class="showContent4?'animate':''" :options="rangeList" v-model="range_choose" @on-change="change3"></checklist>
        <datetime v-model="startdate" placeholder="请选择权限开通时间" :min-year=2017 :max-year=2019 format="YYYY-MM-DD" @on-change="setStart" title="权限开通时间" year-row="{value}年" month-row="{value}月" day-row="{value}日" confirm-text="完成" cancel-text="取消"></datetime>
        <datetime v-model="enddate" placeholder="请选择权限失效时间" :min-year=2017 :max-year=2019 format="YYYY-MM-DD" @on-change="setEnd" title="权限失效时间" year-row="{value}年" month-row="{value}月" day-row="{value}日" confirm-text="完成" cancel-text="取消"></datetime>
        <div style="padding:20px 10px">
          <x-button type="primary" class="zj_button" @click.native="zhsq_comfirm">确认</x-button>
        </div>
      </div>
      <div v-if="list_index==2">
        <div class="weui_panel weui_cells">
          <a class="weui_cell second_font" style="padding: 2px 15px;"  v-for="item in familyList">
            <div class="this_flex_2 this_paddng"><p>{{item.name.val}}</p>
              <p>电话：{{item.phone.val}}</p>
            </div>
            <div class="this_flex_1 text_right">
              <div><x-button mini type="primary" v-if="item.status.val==0" @click.native="agree(item.id.val)">同意</x-button></div>
              <div><x-button mini type="warn" @click.native="delete_this(item.id.val)">删除</x-button></div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <alert v-model="confirm_show" :title="dialog_title" @on-show="onShow" @on-hide="onHide"> {{content}}</alert>
  </div>
</template>

<script>
  import {setTitle} from '@/common/js/common';
  import {Tab,TabItem,Checker,Cell,Checklist,CheckerItem,XTextarea,Datetime,XButton,Alert} from 'vux';
  import $ from 'jquery';

  const list = () => ['权限申请', '租户授权','家人授权'];
  export default{
    data(){
      return{
        confirm_show:false,
        dialog_title:'',
        content:'',
        click_tab:'权限申请',
        route_type:0,
        tabList:list(),
        list_index:0,
        showContent:false,
        showContent2:false,
        showContent3:false,
        showContent4:false,
        commonList: [],
        common_choose: [],
        personList:[],
        person_choose:[],
        pubdesc:[],
        tenantList:[],
        tenant_choose:[],
        rangeList:[],
        range_choose:[],
        wishdate:"",
        familyList:[{
          name:{val:'张三',"desc":1},
          phone:{val:'18271645897',desc:1},
          status:{val:0,desc:1},
          id:{val:1,desc:1},
        },{
          name:{val:'张三',desc:1},
          phone:{val:'18271645897',desc:1},
          status:{val:1,desc:1},
          id:{val:1,desc:1},
        }],
        startdate:"",
        ostartdate:"",
        enddate:"",
        oenddate:"",
        perdesc:[],
        per_demo:[],
        val2:[],
        remark:""
      }
    },
    components:{
      Tab,TabItem,Checker,Cell,Checklist,CheckerItem,XTextarea,Datetime,XButton,Alert
    },
    mounted(){
      setTitle("钥匙管理");
      this.get_list();
    },
    methods:{
      setStart(){
        var ostartdate = this.getownTime(this.startdate);
        var time = new Date(new Date().toLocaleDateString()).getTime();
        if(ostartdate < time){
          this.content="开通时间应该在当前时间之后";
          this.title="确认";
          this.startdate="";
          /*self.$set("oenddate",oenddate)*/
        }else{
          this.ostartdate=ostartdate
        }
      },
      setEnd(){
        let oenddate = this.getownTime(this.enddate)+24*60*60*1000-1;
        let startdate = this.startdate;
        let enddate = this.enddate;
        let arr = startdate.split(/[- :]/);
        let arr2 = enddate.split(/[- :]/);
        let this_arr2_0 = Number(arr2[0]);
        let this_arr2_1 = Number(arr2[1]);
        let this_arr2_2 = Number(arr2[2]);
        let this_arr_0 = Number(arr[0]);
        let this_arr_1 = Number(arr[1]);
        let this_arr_2 = Number(arr[2]);
        if(this_arr_1>9){
          this_arr_0=this_arr_0+1;
          this_arr_1=this_arr_1-9;
        }else{
          this_arr_1=this_arr_1+3;
        }
        if(oenddate <= self.ostartdate){
          this.content="失效时间应该在开通时间之后";
          this.button="确认";
          this.dialog_show=true;
          this.enddate="";
          return;
          /*self.$set("oenddate",oenddate)*/
        }
        if(this_arr2_0>this_arr_0||(this_arr2_0==this_arr_0&&this_arr2_1>this_arr_1)||(this_arr2_0==this_arr_0&&this_arr2_1==this_arr_1&&this_arr2_2>this_arr_2)){
          this.content="授权时间最多三个月";
          this.button="确认";
          this.dialog_show=true;
          this.enddate="";
          return;
        }
        this.oenddate=oenddate;
      },
      getownTime(time){
        var arr = time.split(/[- :]/);
        return (new Date(arr[0], arr[1]-1, arr[2])).getTime();
      },
      onItemClick (index) {
        this.route_type=index;
        this.get_list();
      },
      common_change (val) {
        console.log('change', val);
        this.common_choose=val;
        let arr = this.common_choose;
        console.log(arr);
        let list = this.commonList;
        let desc = [];
        for(let i in  arr){
          for(let j in  list){
            if(arr[i] ==list[j].val){
              desc.push(list[j].desc)
            }
          }
        }
        this.pubdesc=desc;
      },
      contains(arr, obj) {
        let i = arr.length;
        while (i--) {
          if (arr[i] === obj) {
            return true;
          }
        }
        return false;
      },
      get_list(){
        let self = this;
        switch (this.route_type){
          case 0:
              if(service_url){
                this.$http.get(service_url+"/o2o/door/wx/door/doorlist").then((data)=>{
                    if(data.body.statusCode==="ok"){
                        if(data.body.status==="OK"){
                          self.commonList=data.body.data.public;
                          self.personList=data.body.data.person;
                        }else{
                          this.dialog_title="提示";
                          this.content="请确定您当前有可用的门禁权限！";
                          this.confirm_show=true;
                        }
                    }else{
                      this.dialog_title="提示";
                      this.content=data.body.message;
                      this.confirm_show=true;
                    }
                });
              }else{
                this.$http.get('/api/door_list').then((data)=>{
                  self.commonList=data.body.data.data.public;
                  self.personList=data.body.data.data.person;
                });
              }
            document.getElementById("index_loading").style.display="none";
              break;
          case 1:
              if(service_url){
                this.$http.get(service_url+"/o2o/door/wx/door/tenant/getinfo").then((data)=>{
                  self.tenantList=data.body.data.tenant;
                  self.rangeList=data.body.data.range;
                });
              }else{
                this.$http.get('/api/tenant_list').then((data)=>{
                  self.tenantList=data.body.data.data.tenant;
                  self.rangeList=data.body.data.data.range;
                });
              }
            document.getElementById("index_loading").style.display="none";
            break;
          case 2:
            if(service_url){
              this.$http.get(service_url+"/o2o/door/wx/door/family/getinfo").then((data)=>{
                self.familyList=data.body.data.data;
              });
            }else{
              this.$http.get('/api/family_list').then((data)=>{
                self.tenantList=data.body.data.data.tenant;
                self.rangeList=data.body.data.data.range;
              });
            }
            document.getElementById("index_loading").style.display="none";
            break;
        }
      },
      agree(id){
        let self = this;
        this.$http.get(service_url+"/o2o/door/wx/door/family/agree?id="+id).then((data)=>{
          self.content=data.body.message;
          self.dialog_title="恭喜";
          self.get_list();
        })
      },
      delete_this(id){
        let self = this;
        this.$http.get(service_url+"/o2o/door/wx/door/family/reject?id="+id).then((data)=>{
          self.content=data.body.message;
          self.dialog_title="确认";
          self.get_list();
        })
      },
      zhsq_comfirm(){
        var self = this;
        if(self.ostartdate==""){
          self.content="权限开始时间不能为空";
          self.button="确认";
          self.dialog_show=true;
          return;
        }
        if(self.oenddate==""){
          self.content="权限结束时间不能为空";
          self.button="确认";
          self.dialog_show=true;
          return;
        }
        this.$http.get(service_url+"/o2o/door/wx/door/tentant/timecheck?starttime="+self.ostartdate+"&endtime="+self.oenddate).then((data)=>{
          let items = {
            "data": {
              "tenant":self.tenant_choose,//
              "range":self.range_choose,//
              "starttime":self.ostartdate,//
              "endtime":self.oenddate,//
            }
          };
          if(data.body.statusCode==="ok"){
            this.$http.post(service_url+"/o2o/door/wx/door/tenant/submit",items).then((odata)=>{
              self.dialog_title="恭喜";
              self.content=odata.body.message;
            })
          }else{
            self.dialog_title="确认";
            self.content="请求失败";
          }
        })
      },
      qxsq_comfirm(){
        if(!this.common_choose.length&&!this.val2.length){
          this.content="请至少选择一个门";
          this.dialog_title="确认";
          return;
        }
        let self = this;
        let person = [];
        for(let x in this.val2){
            person.push(this.val2[x].substring(1));
        }
        let items = {
          "data": {
            "remark": self.remark,
            "public":self.common_choose,//公区门id
            "person":person,//单元门id
          }
        };
        this.$http.post(service_url+"/o2o/door/wx/door/tenant/submit",items).then((odata)=>{
          self.dialog_title="恭喜";
          self.content=odata.body.message;
          self.common_choose=[];
        })
      },
      change3(val){
        console.log(val);
      },
      choose_checkbox(index1,index2){
        let obj = $("#house_"+index1+"_"+index2);
        let per_desc = $("#desc_"+index1+"_"+index2).html();
        let per_id = $("#id_"+index1+"_"+index2).html();
        if(obj.prop("checked")){
          obj.removeAttr("checked");
          this.perdesc.splice(per_desc,1);
          this.val2.splice("a"+per_id,1);
        }else{
          obj.prop("checked","true");
          this.perdesc.push(per_desc);
          this.val2.push("a"+per_id);
        }
      },
      onShow(){

      },
      onHide(){
        this.$router.push({path:"index"});
      }
    }
  }
</script>

<style scoped>
  @import "../../common/css/menjin.css";
  .slide {
    overflow: hidden;
    max-height: 0;
    transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
  }
  .padding{
    padding:0 10px;
    /*border-top:1px solid #ececec;*/
  }
  .animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }
  .demo5-item {
    border: 1px solid #ad7de7;
    border-radius:5px;
    padding: 2px 5px;
    margin:5px;
  }
  .demo5-item-selected {
    /*background: #ffffff url(../assets/demo/checker/active.png) no-repeat right bottom;*/
    color:white;
    background-color:#ad7de7;
  }
  .weui_panel {
    background-color: #fff;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
  }
  .weui_cells {
    background-color: #fff;
    line-height: 1.41176471;
    font-size: 17px;
    overflow: hidden;
    position: relative;
    margin-top:0;
  }
  .weui_cell {
    padding: 10px 15px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    color:black;
    border-top: 1px solid #e5e5e5;
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
</style>

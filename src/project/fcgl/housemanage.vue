<template>
  <div id="wrapper">
    <!--<loading v-if="loading" style="text-align: center;"></loading>-->
    <div class="bd" style="padding:0px 20px;position:relative;">
      <div v-for="item in data">
        <div class="weui_cells WEUI_CELLS">
          <div style="width:20%;float:left;">
            <div style="width:50px;height:50px;position:absolute;left:6px;top:18px;">
              <input type="radio" name="housetab" :value="item.position.val" @click="bind(item.position.val)" v-if="(item.position.val == houseid)"  checked>
              <input type="radio" name="housetab" :value="item.position.val" @click="bind(item.position.val)" v-if="!(item.position.val == houseid)" >
            </div>
            <img class="erweima" src="./erweima.png"/>
          </div>
          <div style="width:65%;float:left;margin-left:20%;">
            <div class="qjss weui_cell_primary">{{item.position.desc}}</div>
            <div class="qjss1 weui_cell_primary">户型：{{item.type.val}}</div>
            <div class="qjss1 weui_cell_primary" style="margin-bottom:10px;">面积：{{item.area.val}}平方米</div>
          </div>
          <div class="pass" @click="unbind(item.position.val)">取消绑定</div>
        </div>
        <div class="weui_cells house_family_list"  v-if="item.isowner==1">
          <!--<div class="weui_cell">
            <ul class="house_family_ul">
              <li class="house_family_li">
                <div class="img">
                  <img :src="item.pic" alt="">
                </div>
              </li>
              <li class="nameli">
                <h3 class="nameh3">{{item.owner.val}}</h3>
                <a href="javascript:;" class="idcard weui_btn weui_btn_mini weui_btn_plain_primary">业主</a>
              </li>
              <li></li>
            </ul>
          </div>-->
          <div class="pj_detail" v-if="item.isowner==1">
            <div class="f_flex" style="font-size:13px;">
              <div class="pj_img_div">
                <img :src="item.pic"/>
              </div>
              <div class="flex_1">
                <div style="font-size:18px;">{{item.owner.val}}</div>
                <div style="margin-top:10px;font-size:14px;padding:0 5px;border-radius:5px;border:1px solid #ad7de7;display:inline-block;">业主</div>
              </div>
            </div>
          </div>
          <div class="pj_detail" v-for="i in item.family">
            <div class="f_flex" style="font-size:13px;">
              <div class="pj_img_div">
                <img :src="item.pic"/>
              </div>
              <div class="flex_1">
                <div style="font-size:18px;">{{i.name}}</div>
                <div style="margin-top:10px;font-size:14px;padding:0 5px;border-radius:5px;border:1px solid #ad7de7;display:inline-block;">{{i.isowner===1?"家属":"租客"}}</div>
              </div>
              <div style="float:right;">
                <div><x-button v-if="i.ischecked==1" mini type="primary" style="font-size:12px;margin-bottom:10px;" @click.native.stop="agree(item.position.val,i.val)">同意</x-button></div>
                <div><x-button mini type="warn"  style="font-size:12px" @click.native.stop="reject(item.position.val,i.val)">解除</x-button></div>
              </div>
            </div>
          </div>
          <!--<div class="weui_cell" v-for="i in item.family">
            <ul class="house_family_ul">
              <li class="house_family_li">
                <div class="img"><img src="" alt=""></div>
              </li>
              <li class="nameli">
                <h3 class="nameh3">{{i.name}}</h3>
                <a href="javascript:;" class="idcard weui_btn weui_btn_mini weui_btn_plain_primary">
                  <span v-if="i.isowner==1">家属</span>
                  <span v-if="i.isowner==2">租客</span>
                </a>
              </li>
              <li class="caozuo">
                <a href="javascript:;" class="ok weui_btn weui_btn_primary" v-if="i.ischecked==1"  @click="agree(item.position.val,i.val)">同意</a>
                <a href="javascript:;" class="delete weui_btn weui_btn_warn" v-else @click="reject(item.position.val,i.val)">解除绑定</a>
              </li>
            </ul>
          </div>-->
        </div>
      </div>
      <div style="height:60px;padding:10px 0;" v-if="data.length>0">
        <h4 style="color: #45ADF6;line-height:30px;font-size:14px;">*点击右边圈圈切换房产</h4>
        <h4 style="color: #45ADF6;line-height:30px;font-size:14px;">*点击房产查看房产下账号</h4>
      </div>
      <div style="padding:10px 0;" v-if="data.length==0">
        <h4 style="color: #45ADF6;line-height:30px;font-size:14px;">*当前无房产信息，请点击以下按钮添加房产</h4>
      </div>
      <x-button type="primary" class="zj_button" @click.native="go_register">添加房产</x-button>
      <!--<span class="golink" v-link="{ path: '/register'}">添加房产</span>-->

    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{content}}</alert>
  </div>
</template>

<script>
  import {setTitle} from '@/common/js/common';
  import Loading from '@/components/loading/dataLoading';
  import {XButton,Alert} from 'vux';

  export default{
      data(){
          return{
            loading:true,
            data: [],
            houseid:0,
            confirm_show:false,
            dialog_title:"",
            content:""
          }
      },
    components:{
      Loading,XButton,Alert
    },
      mounted(){
        setTitle("房产管理");
        this.getdata();
        if(userProfile.houseid){
            this.houseid=userProfile.houseid;
        }
      },
    methods:{
      bind(houseid){
        let self = this;
        this.$http.get(service_url+"/o2o/common/wx/reg/rephouse?houseid="+houseid).then((data)=>{
          this.dialog_title="恭喜";
          this.content="操作成功！";
          this.confirm_show=true;
          userProfile  = data.body.userProfile;
          if(userProfile.houseid){
            self.houseid=userProfile.houseid;
          }
          self.$router.push({path: "index"});
        },()=>{
          console.log("访问失败");
        });
      },
      unbind(houseid){
        let self = this;
        this.$http.get(service_url+"/o2o/common/wx/reg/reject/self?houseid="+houseid).then((data)=>{
          this.dialog_title="恭喜";
          this.content="操作成功！";
          this.confirm_show=true;
          self.getdata();
        },()=>{
          console.log("操作失败");
        });
      },
      agree(houseid,memberid){
        let self = this;
        this.$http.get(service_url+"/o2o/common/wx/reg/agree?houseid="+houseid+"&memberid="+memberid).then((data)=>{
          this.dialog_title="恭喜";
          this.content="操作成功！";
          this.confirm_show=true;
          self.getdata();
        },()=>{
          console.log("操作失败");
        });
      },
      reject(houseid,memberid){
        let self = this;
        this.$http.get(service_url+"/o2o/common/wx/reg/reject?houseid="+houseid+"&memberid="+memberid).then((data)=>{
          this.dialog_title="恭喜";
          this.content="操作成功！";
          this.confirm_show=true;
          self.getdata();
        },()=>{
          console.log("操作失败");
        });
      },
      getdata(){
        let self = this;
        if(service_url){
          this.$http.get(service_url+"/o2o/common/wx/myhouse").then((data)=>{
            self.data = data.body.data;
          });
        }else{
          this.$http.get("/api/myhouse").then((data)=>{
            self.data = data.body.data.data;
          });
        }
        document.getElementById("index_loading").style.display="none";
      },
      go_register(){
        this.$router.push({path:'register'});
      }
    }
  }
</script>

<style scoped>
  .weui_cells{
    margin-top: 1.17647059em;
    background-color: #FFFFFF;
    line-height: 1.41176471;
    font-size: 17px;
    overflow: hidden;
    position: relative;
  }
  .WEUI_CELLS {margin-top:10px;margin-bottom:0px;border:1px solid #1098F7;border-radius:5px;padding:10px;background: url("./house_bg.jpg") no-repeat;}
  .img{overflow: hidden;width:80px;height:80px;border-radius:50%;background: #aaa;}
  .house_family_list{margin-top:-2px;box-shadow:0 0 2px 2px #ddd inset;display:block;}
  .house_family_ul{width:100%;height:100%;padding:0;margin:0;list-style: none;overflow: hidden;}
  .house_family_li{float:left;padding:0 10px;}
  .idcard{border:1px solid #0273ff;color:#0273ff;}
  .nameh3{line-height:50px;font-weight: bold;}
  .nameli{float:left;height:80px;padding:0 10px;}
  .weui_btn.ok{font-size:16px;background:#28E080;}
  .weui_btn.delete{font-size:16px;margin-top:5px;}
  .caozuo{float:right;width:100px;height:80px;padding:0 10px;}
  .pass{width:20%;position:absolute;right:0;top:0;background:red;color:white;line-height:7;height:100%;text-align: center}
  .qjss{color:#42A6F5;font-weight:bold;margin-top:10px;}
  .qjss1{color:#696969;font-size:14px;padding:5px 0;font-weight:bold;}
  .erweima{width:50px;height:50px;position:absolute;left:10px;bottom:11px; }
  @media screen and (max-width: 380px) {
    .img{width:50px;height:50px;}
    .nameh3{line-height:30px;font-size:14px;}
    .nameli{height:60px;}
    .weui_btn.idcard{padding-left:8px;padding-right:8px;font-size:13px;}
    .weui_btn.ok{font-size:14px;background:#28E080;}
    .weui_btn.delete{font-size:14px;margin-top:5px;}
    .caozuo{height:60px;padding:0;}
    .caozuo>a.weui_btn{line-height:1.8;padding-left:10px;padding-right:10px;}
    .pass{font-size: 13px;line-height:9;}
    .qjss{font-size:14px;}
    .qjss1{font-size:13px;}
    .erweima{width:40px;height:40px;}
  }
  .pj_detail {
    border-top: 1px solid #e5e5e5;
    padding: 10px 10px 10px 0;
    margin-left:15px;
  }
  .f_flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .pj_img_div {
    width: 60px;
    height: 60px;
    margin-right: 1rem;
  }
  .pj_img_div img {
    border-radius: 50%;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  .flex_1{
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
</style>

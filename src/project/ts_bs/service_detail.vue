<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div>
      <div style="padding:10px 15px;background-color:white;border-bottom:1px solid #ececec">
        当前订单状态:<span style="color:red">{{status.desc}}</span>
      </div>
      <cell-form-preview style="background-color:white;border-bottom:1px solid #ececec" :list="list"></cell-form-preview>
      <flexbox :gutter="0" style="background-color:white;margin:10px 0;" wrap="wrap">
        <flexbox-item v-for="(item, index) in picurls" :key="item" :span="1/3"><div style="text-align: center;margin-top:5px;"><img class="previewer-demo-img" @click="show(index)" style="width:100px;height:100px;" :src="item.src"/></div></flexbox-item>
        <!--<flexbox-item :span="1/3"><div style="text-align: center;"><img style="width:100px;height:100px;" src="../../common/img/user_self.png"/></div></flexbox-item>-->
        <!--<flexbox-item :span="1/3"><div style="text-align: center;"><img style="width:100px;height:100px;" src="../../common/img/user_self.png"/></div></flexbox-item>-->
        <!--<flexbox-item :span="1/3"><div style="text-align: center;"><img style="width:100px;height:100px;" src="../../common/img/user_self.png"/></div></flexbox-item>-->
        <previewer :list="picurls"  ref="previewer" :options="options"></previewer>
        <!--<flexbox-item :span="1/3"><div style="text-align: center;"><img style="width:100px;height:100px;" src="../../common/img/user_self.png"/></div></flexbox-item>-->
      </flexbox>
      <div style="border-top:1px solid #ececec;">
        <tab :line-width=2 active-color="#fc378c" v-model="index">
          <tab-item class="vux-center" :selected="click_tab === item" v-for="(item, index) in list2" @click="click_tab = item"
                    :key="index">{{item}}
          </tab-item>
        </tab>
        <div v-if="index==0" style="background-color:white">
          <timeline>
            <timeline-item :key="item" v-for = "item in servicehistorys">
              <h4>{{item.desc}}</h4>
              <p>{{item.lastUpdateTime}}</p>
            </timeline-item>
            <!--<timeline-item>
              <h4 class="recent">【广东】 广州市 已发出</h4>
              <p class="recent">2016-04-17 12:00:00</p>
            </timeline-item>
            <timeline-item>
              <h4> 申通快递员 广东广州 收件员 xxx 已揽件</h4>
              <p>2016-04-16 10:23:00</p>
            </timeline-item>
            <timeline-item>
              <h4> 商家正在通知快递公司揽件</h4>
              <p>2016-04-15 9:00:00</p>
            </timeline-item>-->
          </timeline>
        </div>
        <div v-if="index==1">
          <div v-if="cost_item.length!==0">
            <x-table :cell-bordered="false" :content-bordered="false" style="background-color:#fff;">
              <thead>
              <tr style="background-color: #F7F7F7">
                <th>服务和材料费</th>
                <th>金额（元）</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in cost_item">
                <td>{{item.name}}</td>
                <td>{{item.amount}}</td>
              </tr>
              <tr style="border-top:1px solid #ececec">
                <td></td>
                <td></td>
                <td>{{cost_total}}</td>
              </tr>
              </tbody>
            </x-table>
            <div style="padding:20px 10px">
              <x-button style="background-color:#ad7de7;color:white;" @click.native="go_pay">支付</x-button>
            </div>
          </div>
          <div v-else>
            <load-more :show-loading="false" tip="暂无费用" background-color="#efeff4"></load-more>
          </div>
        </div>
        <div v-if="index==2">
          <div v-if="xstate==='COMP'">
            <x-switch title="是否及时" v-model="isontime"></x-switch>
            <cell title="服务评分">
              <rater v-model="score" slot="value" star="✩" active-color="#FF9900" :margin="4"></rater>
            </cell>
            <x-textarea title="详细描述" placeholder="请输入评价" :rows="3" v-model="reason" ></x-textarea>
            <x-textarea title="意见反馈" placeholder="请输入意见反馈" :rows="3" v-model="feedback"></x-textarea>
            <div style="padding:20px 10px;"><x-button class="zj_button" type="primary" @click.native="submit_access">提交评价</x-button></div>
          </div>
          <div v-if="xstate=='EVALUATE'">
            <x-switch title="是否及时" v-model="isontime" disabled></x-switch>
            <cell title="服务评分">
              <rater v-model="score" slot="value" star="✩" active-color="#FF9900" :margin="4" disabled></rater>
            </cell>
            <x-textarea title="评价内容" placeholder="请输入评价" :rows="3" v-model="reason" readonly></x-textarea>
            <x-textarea title="意见反馈" placeholder="请输入意见反馈" :rows="3" v-model="feedback" readonly></x-textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {Group,Cell,CellFormPreview,Flexbox, FlexboxItem,Tab,TabItem,Timeline, TimelineItem,XTable,XSwitch,Rater,XTextarea,XButton,Previewer,LoadMore} from 'vux'

  export default{
    data(){
      return{
          type:0,
        loading:true,
        status:{},
        list:[],
        list2:[],
        index:0,
        click_tab:"服务动态",
        srid:{},
        location:{},
        createtime:{},
        detaildesc:{},
        picurls: [],
        servicehistorys:[],
        servicecost:{},
        assess:{},
        iscancel:{},
        isontime:false,
        hopetime:{},
        cost_item:[],
        feedback:"",
        order_id:"",
        reason:"",
        score:0,
        xstate:"",  //CLOSED  COMP
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    components:{
      loading,Group,Cell,CellFormPreview,Flexbox, FlexboxItem,Tab,TabItem,Timeline, TimelineItem,XTable,XSwitch,Rater,XTextarea,XButton,Previewer,LoadMore
    },
    mounted(){
      setTitle("服务详情")
        let self =this;
        this.srid = this.$route.query.srid;
        this.xstate = this.$route.query.xstate;
        this.type = parseInt(this.$route.query.type);
      if(this.$route.query.tab ==="dt"){
          this.click_tab="服务动态";
      }else if(this.$route.query.tab ==="pj"){
        this.click_tab="服务评价";
      }
      if(this.xstate!=="COMP" && this.xstate!=="EVALUATE"){
        this.list2=['服务动态','服务费用'];
      }else{
        this.list2=['服务动态','服务费用','服务评价'];
      }
      if(service_url){
        let get_url = this.type?service_url+"/o2o/suggest/wx/detail?srid="+this.srid+"&vid="+userProfile.vid:service_url+"/o2o/affair/wx/detail?srid="+this.srid+"&vid="+userProfile.vid;
        this.$http.get(get_url).then((data)=>{
          self.isontime=data.body.assess.ontime;
          self.isdelaytime=data.body.isdelaytime;
          self.score=data.body.assess.score;
          self.feedback=data.body.assess.feedback;
          self.createtime=data.body.createtime;
          self.detaildesc=data.body.detaildesc;
          self.hopetime=data.body.hopetime;
          self.iscancel=data.body.iscancel;
          self.location=data.body.location;
          let picurls=data.body.picurls;
          let _arr_pic=[];
          for(let i=0;i<picurls.length;i++){
            let obj_pic={};
            obj_pic.src = picurls[i].ori;
            console.log(obj_pic.src);
            this.imgLoadEvent(function (obj) {
              obj_pic.w=obj["w"];
              obj_pic.h=obj["h"];
            }, picurls[i].ori);
            _arr_pic.push(obj_pic);
            console.log(_arr_pic)
          }

          self.picurls=_arr_pic;
          self.servicecost=data.body.servicecost;
          self.cost_item=data.body.servicecost.items;
          self.cost_total=data.body.servicecost.total;
          self.servicehistorys=data.body.servicehistorys;
          self.status=data.body.status;
//          self.cost_item=data.body.items;
//          self.cost_total=data.body.total;
          if(self.hopetime){
            self.list=[
              {
                label:"报修位置",
                value:self.location.desc
              },{
                label:"期望时间",
                value:self.hopetime.desc
              },{
                label:"保修问题",
                value:self.detaildesc.desc
              }
            ]
          }
        })
      }else{
          let self = this;
          this.$http.get("/api/service_detail").then((data)=>{
              self.isontime=data.body.data.isontime;
              self.isdelaytime=data.body.data.isdelaytime;
              self.score=data.body.data.score;
              self.feedback=data.body.data.feedback;
              self.createtime=data.body.data.createtime;
              self.detaildesc=data.body.data.detaildesc;
              self.hopetime=data.body.data.hopetime;
              self.iscancel=data.body.data.iscancel;
              self.location=data.body.data.location;
              self.picurls=data.body.data.picurls;
              self.servicecost=data.body.data.servicecost;
              self.servicehistorys=data.body.data.servicehistorys;
              self.status=data.body.data.status;
              self.cost_item=data.body.data.servicecost.items;
              self.cost_total=data.body.data.servicecost.total;
              self.list=[
                {
                  label:"报修位置",
                  value:self.location.desc
                },{
                  label:"期望时间",
                  value:self.hopetime.desc
                },{
                  label:"保修问题",
                  value:self.detaildesc.desc
                }
              ]
          })
      }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      submit_access(){
        let get_url = this.type?service_url+"/o2o/suggest/wx/comment?srid=" +this.srid+ "&vid="+userProfile.vid+"&openid="+userProfile.openid:service_url+"/o2o/affair/wx/comment?srid=" + this.srid + "&vid="+userProfile.vid+"&openid="+userProfile.openid;
        const item = {
          data:{
            score:  this.score,
            ontime:this.isontime,
            feedback:this.feedback,
            reason:this.reason
          }
        };
        this.$http.post(get_url,item).then((data)=>{
          if(data.body.statusCode === "ok"){
            this.$router.push({path:'my_service'})
          }else{
            alert(data.body.message);
          }
        })
        },
      show (index) {
        this.$refs.previewer.show(index)
      },
      GetImgInfo(url) {
          let self = this;
        this.imgLoadEvent(function (obj) {
//          alert("w=" + obj["w"] + ",h=" + obj["h"]);

        }, url);
      },
      imgLoadEvent(callback, url) {//圖片事件加載
        var img = new Image();
        img.onreadystatechange = function () {
          if (this.readyState == "complete") {
            callback({ "w": img.width, "h": img.height });
          }
        }
        img.onload = function () {
          if (this.complete == true) callback({ "w": img.width, "h": img.height });
        }

        img.onerror = function () {
          callback({ "w": 0, "h": 0 });
          //current.autoSetImgSize(current,img,obj);
        }
        img.src = url;
      },
      go_pay(){
        this.$router.replace({path:"wallet_pay",query:{order_id:this.order_id,type:4,pay_type:this.detaildesc.desc,pay_num:this.cost_total}});
      }
    }
  }
</script>

<style scoped>

</style>

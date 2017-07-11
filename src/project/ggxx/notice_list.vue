<template>
  <div>
    <!--<loading style="text-align: center;" v-if="loading"></loading>-->
    <div>
      <Scroller style="margin-top:-44.8px;" :on-refresh="onRefresh" :on-infinite="onInfinite">
        <swiper auto :aspect-ratio="400/750">
          <swiper-item class="swiper-demo-img" v-for="(item, index) in demo06_list" :key="index" @click.native="go_link(item.url,item.id)"><img style="height:100%;width:100%;object-fit: cover;" :src="item.picture"></swiper-item>
        </swiper>
        <!--<div>
          <div class="nth" style="padding:5px 10px 5px 20px;" v-for="item in noticelists" @click="goDetail(item.noticeid.val)">
            <div style="overflow: hidden"><p style="float:left;font-size:16px;">{{item.title.val}}</p><span style="float:right;color:red;font-size:13px;">{{item.isnotice.val==='1'?'公告':'活动'}}</span></div>
            <div style="font-size:13px;margin:10px 0">{{item.content.val}}</div>
            <div style="overflow: hidden"><p style="float:left;color:#999;font-size:12px">发布：{{ getDate(item.startdate.val) }}</p><span style="float:right;color:#999;font-size:12px">{{item.createby.desc}}</span></div>
          </div>
        </div>-->
        <group v-for="(item,index) in noticelists" key="item" @click.native="goDetail(item.noticeid.val)" gutter="0">
          <div style="padding:15px;overflow: hidden">
            <div style="float:left;">{{item.title.val}}</div>
            <div style="float:right;font-size:13px;padding:2.5px 0;color:#ad7de7">{{item.isnotice.val==='1'?'社区公告':'社区活动'}}</div>
            <div style="clear:both;"></div>
            <div style="font-size:14px;margin:10px 0;max-height:40px;overflow:hidden;"><pre>{{item.content.val}}</pre></div>
            <!--<div style="overflow: hidden;color:#999;font-size:12px"><span>{{item.createby.desc}}</span><span style="margin-left:5px;">{{ getDate(item.startdate.val) }}</span></div>-->
          </div>
        </group>
      </Scroller>
    </div>
  </div>
</template>

<script>
  import Loading from '@/components/loading/dataLoading'
  import Scroller from '@/components/scroller_me/scroller';
  import {setTitle} from '@/common/js/common';
  import {
    Swiper,
    Group,
    Cell,CellBox,SwiperItem
  } from 'vux'

  export default{
      data(){
          return{
            demo06_list:[],
            swiper_index:0,
            loading:true,
            noticelists:[],
            lastid:""
          }
      },
    components:{
      Swiper,Loading,Group,Cell,CellBox,SwiperItem,Scroller
    },
    methods:{
      getDate (datetime) {
        let dateObj = new Date(parseInt(datetime));
        if (Object.prototype.toString.call(dateObj) == '[object Date]') {
          if (isNaN(dateObj.getTime())) {
            return '';
          } else {
            const   year = dateObj.getFullYear(),
              month = dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1,
              day = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate(),
              hour = dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours(),
              minute = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes(),
              second = dateObj.getSeconds() < 10 ? '0' + dateObj.getSeconds() : dateObj.getSeconds();
            return year + '-' + month + '-' + day + '  ' + hour + ':' + minute;
//            alert(year + '-' + month + '-' + day + '  ' + hour + ':' + minute)
          }
        } else {
          return '';
        }
      },
      swiperChange(index){
        this.swiper_index = index
      },
      goDetail(id){
        this.$router.push({ path: 'notice_detail',query:{"notice_id":id} });
      },
      go_link(url,id){
        if(service_url){
          this.$http.get(service_url+"/o2o/notice/wx/gclick?nid="+id).then(data=>{
            if(data.body.statusCode==="ok"){
              window.location.href=url;
            }
          })
        }else{
          window.location.href=url;
        }
      },
      onInfinite(done){
        console.log("onInfinite");
        if(!this.lastid){
          this.$el.querySelector('.load-more').style.display = 'none';
          return;
        }else{
          this.$http.get(service_url+"/o2o/notice/wx/getlist?lastid="+this.lastid+"&vid="+userProfile.vid).then((data) => {
            this.lastid=data.body.lastid;
            /*let noticelists = data.body.items;
            for(let i =0;i<noticelists.length;i++){
              this.noticelists.push(noticelists[i]);
            }*/
            this.noticelists = data.body.items;
            done();
          });
        }
      },
      onRefresh(done) {
//        this.lastid="";
        console.log("onRefresh")
        done() // call done
      },
    },
    mounted(){
      setTitle("公告活动");
      document.getElementById("index_loading").style.display="none";
      let self = this;
      if(service_url){
        this.$http.get(service_url+"/o2o/notice/wx/getlist?lastid=&vid="+userProfile.vid).then((data) => {
          self.lastid=data.body.lastid;
          self.noticelists=data.body.items;
        });
      }else{
        this.$http.get("/api/notice_list").then((data) => {
          self.noticelists=data.body.data.items;
          self.swiper_imgs=data.body.data.picurls;
        });
      }
      if(service_url){
        this.$http.get(service_url+"/o2o/notice/wx/newsIndex?ntype=2&sum=5&itemid=5").then((data)=>{
          /*let newsIndex = data.body.data;
          for(let i in newsIndex){
            this.demo06_list.push(newsIndex[i].picture);
          }*/
          this.demo06_list = data.body.data;
        })
      }else{
        this.$http.get("/api/newsIndex").then((data)=>{
          /*let newsIndex = data.body.data.data;
          for(let i in newsIndex){
            this.demo06_list.push(newsIndex[i].picture);
          }*/
          this.demo06_list=data.body.data.data;
        })
      }
    }
  }
</script>

<style scoped>
  .nth:nth-child(even){
    background-color:#ececec;
  }
</style>

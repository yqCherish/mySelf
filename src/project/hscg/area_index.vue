<template>
  <div class="body">
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div>
      <!--切换会所区-->
      <div class="header">
        <div style="text-align: center;position:relative">
          <div style="position:absolute;top:2px;">
            <img width="40" style="margin-right:5px;" src="../../common/img/logo.png"/>
          </div>
          <div>
            <div class="f_flex" @click ="showActionsheet"><span style="color:#ffffff">{{currentClub}}</span><i class="arrow"></i></div>
          </div>
        </div>
      </div>
      <!--广告区-->
      <swiper auto :aspect-ratio="400/750">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in demo06_list" :key="index" @click.native="go_link(item.url,item.id)"><img style="height:100%;width:100%;object-fit: cover;" :src="item.picture"></swiper-item>
      </swiper>
      <actionsheet v-model="ac_show" :menus="options" @on-click-menu="click_option"></actionsheet>
      <!--项目卡区-->
      <cardswitch style="padding-top:5px;" v-if="all_len!=0" :project_list="all_project" :slideNub="all_len"></cardswitch>
      <!--热门项目-->
      <div style="margin-top:-55px;" v-if="hot_project!==null">
        <p style="text-align: center;font-size:18px;">热门项目</p>
        <div style="position:relative;margin-top:5px;" @click="choose_area">
          <!--<img style="width:100%;height:200px;" src = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495189850144&di=1bba5897af47c8934e3f78f40fc1ca6e&imgtype=0&src=http%3A%2F%2Fpic1.nipic.com%2F2008-11-05%2F200811512426547_2.jpg"/>-->
          <img :style="img_height" :src = "hot_project.img"/>
          <div style="width:100%;position:absolute;bottom:5px;color:white; box-shadow: 0 6px 12px rgba(0, 0, 0, .175);-webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);background-color: rgba(50, 30, 30, 0.3);"><div style="padding:5px 10px;">{{hot_project.name}}</div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import Cardswitch from '@/components/card_switch/card_switch'
  import {Swiper,SwiperItem,Actionsheet} from 'vux';

  export default{
    data(){
        return{
          loading:true,
          currentClub:"",
          currentKey:"",
          demo06_list:[],
          demo06_index:0,
          ac_show:false,
          options:[],
          hot_project:{},
          all_project:[],
          all_len:0
        }
    },
    components:{
      loading, Swiper,Actionsheet,Cardswitch,SwiperItem
    },
    mounted(){
      setTitle("会所首页");
      let self = this;
      if(service_url){
          const items={
              clubid:0
          };
        this.getSwiper();
        this.$http.post(service_url+"/o2o/club/wx/index",items).then((data)=>{
            console.log(data);
          self.hot_project=data.body.data.hot_project;
          self.all_project=data.body.data.all_project;
          self.all_len=data.body.data.all_project.length;
          console.log(self.all_len);
          let this_options = data.body.data.club;
          let json_options={};
          for(let i =0;i<this_options.length;i++){
            json_options[this_options[i].key]=this_options[i].name;
            if(this_options[i].checked){
              self.currentClub=this_options[i].name;
            }
          }
          self.options=json_options;
        });
      }else{
        this.getSwiper();
        this.$http.get('/api/area_index').then((data) => {
          let this_options = data.body.data.data.club;
          let json_options={};
          for(let i =0;i<this_options.length;i++){
            json_options[this_options[i].key]=this_options[i].name;
          }
          self.options=json_options;
          self.hot_project=data.body.data.data.hot_project;
          self.all_project=data.body.data.data.all_project;
          self.all_len=data.body.data.data.all_project.length;
        });
      }
      document.getElementById("index_loading").style.display="none";
    },
    computed:{
      swiper_height(){
        return (document.body.clientWidth)/75*31+"px"
      },
      img_height(){
        return{
          "width":"100%",
          "height":(document.body.clientWidth)/15*8+"px"
        }
      }
    },
    methods:{
      getSwiper(){
        if(service_url){
          this.$http.get(service_url+"/o2o/notice/wx/newsIndex?ntype=2&sum=5&itemid=7").then((data)=>{
            /*let newsIndex = data.body.data;
            for(let i in newsIndex){
              this.demo06_list.push(newsIndex[i].picture);
            }*/
            this.demo06_list=data.body.data;
          })
        }else{
          this.$http.get("/api/newsIndex").then((data)=>{
            /*let newsIndex = data.body.data.data;
            for(let i in newsIndex){
              this.demo06_list.push(newsIndex[i].picture);
            }*/
            this.demo06_list = data.body.data.data;
          })
        }
      },
      demo06_onIndexChange(index){
        this.demo06_index = index
      },
      showActionsheet(){
        this.ac_show=true;
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
      click_option(key){
          let self = this;
          this.currentKey = key;
          const items = {
            clubid:key
          };
        this.$http.post(service_url+"/o2o/club/wx/index",items).then((data)=>{
          console.log(data);
          self.hot_project=data.body.data.hot_project;
          self.all_project=data.body.data.all_project;
          self.all_len=data.body.data.all_project.length;
          console.log(self.all_len);
          let this_options = data.body.data.club;
          let json_options={};
          for(let i =0;i<this_options.length;i++){
            json_options[this_options[i].key]=this_options[i].name;
          }
          self.options=json_options;
        });
        for(let i in this.options){
          if((parseInt(i))==key){        //item 表示Json串中的属性，如'name'
            let jValue=this.options[i];//key所对应的value
            this.currentClub=jValue;
          }
        }
      },
      choose_area(){
        this.$router.push({path: 'area_detail', query: {"project_id": this.hot_project.id}});
      }
    }
  }
</script>

<style scoped>
  .header{
    background-color:#4e4f4f;
    padding:10px 15px;
  }
  select{
    border: 0px;
    border: none;
    outline:none;
  }
  .arrow {
    margin-left:3px;
    display: block;
    border-width: 5px 5px 0;
    border-style: solid;
    border-right-color: transparent;
    border-left-color: transparent;
    width: 0;
    height: 0;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    -webkit-transform: rotateZ(0);
    transform: rotateZ(0);
    color:#ffffff;
  }
  .f_flex{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

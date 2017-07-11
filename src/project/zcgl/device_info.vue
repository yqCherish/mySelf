<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div>
      <tab :line-width=2 active-color="#ad7de7" v-model="index">
        <tab-item class="vux-center" :selected="click_tab === item" v-for="(item, index) in list2" @click="click_tab = item"
                  :key="index" @on-item-click="onItemClick">{{item}}
        </tab-item>
      </tab>
      <div v-if="index==0">
        <group gutter="0">
          <cell style="font-size:14px;" title="房屋地址" :value = "data1.position"></cell>
          <cell style="font-size:14px;" title="套内面积" :value = "data1.area"></cell>
          <cell style="font-size:14px;" title="使用年限起" :value = "data1.starttime"></cell>
          <cell style="font-size:14px;" title="使用年限止" :value = "data1.endtime"></cell>
        </group>
        <div style="padding:20px 10px;"><x-button type="primary" class="zj_button" @click.native="go_fcgl">房产管理</x-button></div>
      </div>
      <div v-if="index==1">
        <load-more v-if="data2.length===0" :show-loading="false" tip="暂无附属设施" background-color="#efeff4"></load-more>
        <group gutter="0">
          <ul style="font-size:14px;" class="r-s-middle" >
            <li class="li1" v-for="(lists,index1) in data2" @click.stop.prevent="show1(index1)" v-bind:class="{ current: (oindex ==index1) }">
              <div class="first top content_mid" >{{lists.name}}</div>
              <ul class="r-s-middle my-s-middle"  v-if="oindex ==index1">
                <li class="li2" v-for="(item,index2) in lists.items" @click.stop.prevent="show2(index2)" v-bind:class="{ current: (oindex2 ==index2) }">
                  <div class="second  content_mid"  >{{item.name}}</div>
                  <dl style="display: block;padding-left:25px;color:#999;font-size:14px;border-bottom:1px solid #ececec;" v-if="oindex2 ==index2" >
                    <div class="my_height">{{item.brand}}</div>
                    <div class="my_height">{{item.time}}</div>
                  </dl>
                </li>
              </ul>
            </li>
          </ul>
        </group>
      </div>
    </div>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {Tab,TabItem,Cell,Group,XButton,LoadMore} from 'vux';
  import $ from 'jquery'

  const list = () => ['基本信息', '附属设施'];
  $('.r-s-middle li .first').click(function() {

  });
  $('.r-s-middle li .second').click(function() {
    var index = $(this).index();
    $(this).eq(index).parents('.r-s-middle .li2').toggleClass('current').siblings().removeClass('current');
    $(this).eq(index).next().slideToggle();
    $(this).eq(index).parents('.r-s-middle .li2').siblings().children('dl').slideUp();
  });
  export default{
    data(){
      return{
        loading:true,
        list2: list(),
        index: 0,
        data1:[],
        click_tab:"基本信息",
        data2:[],
        oindex:-1,
        oindex2:-1
      }
    },
    components:{
      loading,Tab,TabItem,Cell,Group,XButton,LoadMore
    },
    mounted(){
      setTitle("基础设施");
      this.getList(this.index);
    },
    methods:{
      onItemClick(index){
          this.index= index;
          this.getList(index);
      },
      show1(index){
        if(this.oindex===-1){
          this.oindex=index;
        }else{
          this.oindex=-1;
        }
      },
      show2(index){
        if(this.oindex2===-1){
          this.oindex2=index;
        }else{
          this.oindex2=-1;
        }
      },
      go_fcgl(){
        this.$router.push({path:"house_info"});
      },
      getList(index){
          let self = this;
        switch(index){
          case 0:
              if(service_url){
                this.$http.get(service_url+"/o2o/asset/wx/houseinfo?houseid="+userProfile.houseid).then((data)=>{
                  self.data1=data.body.data;
                })
              }else{
                this.$http.get("/api/houseinfo").then((data)=>{
                  self.data1=data.body.data.data;
                })
              }
              break;
          case 1:
            if(service_url){
              this.$http.get(service_url+"/o2o/asset/wx/devicelist?houseid="+userProfile.houseid).then((data)=>{
                self.data2=data.body.data;
              })
            }else{
              this.$http.get("/api/devicelist").then((data)=>{
                self.data2=data.body.data.data;
              })
            }
        }
        document.getElementById("index_loading").style.display="none";
      }
    }
  }
</script>

<style scoped>
  .r-s-middle li .top {
    position: relative;
    border-bottom: 1px solid #eee;
    line-height: 40px !important;
    /*font-size: 1.4rem;*/
    color: #444;
    padding:0 15px;
  }
  .r-s-middle li .top:before {
    content: "";
    position: absolute;
    border-left: 2px solid #ccc;
    border-top: 2px solid #ccc;
    width: 13px;
    height: 13px;
    right: 18px;
    top: 40%;
    /*margin: -7px 0 0 0;*/
    transform: rotate(-135deg);
    -moz-transform: rotate(-135deg);
    -ms-transform: rotate(-135deg);
    -o-transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
    transition: transform 200ms ease-in;
    -moz-transition: transform 200ms ease-in;
    -ms-transition: transform 200ms ease-in;
    -o-transition: transform 200ms ease-in;
    -webkit-transition: transform 200ms ease-in;
  }
  .r-s-middle li.current .top:before {
    transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }

  .r-s-middle li .second {
    position: relative;
    border-bottom: 1px solid #eee;
    line-height: 40px;
    /*font-size: 1.4rem;*/
    color: #444;
    text-indent: 25px;
  }
  .r-s-middle li .second:before {
    content: "";
    position: absolute;
    border-left: 2px solid #ccc;
    border-top: 2px solid #ccc;
    width: 13px;
    height: 13px;
    right: 18px;
    top: 50%;
    margin: -7px 0 0 0;
    transform: rotate(-135deg);
    -moz-transform: rotate(-135deg);
    -ms-transform: rotate(-135deg);
    -o-transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
    transition: transform 200ms ease-in;
    -moz-transition: transform 200ms ease-in;
    -ms-transition: transform 200ms ease-in;
    -o-transition: transform 200ms ease-in;
    -webkit-transition: transform 200ms ease-in;
  }
  .li2.current .second:before {
    transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
  .r-s-middle li .content {
    border-top: 1px solid #d6d6d6;
    position: relative;
    border-bottom: 1px solid #eee;
    line-height: 30px;
    /*font-size: 1.4rem;*/
    color: #444;
    background-color: #ecebea;
  }
  .li2 .my_height{height:30px;line-height: 30px;}
</style>

<template>
  <div>
    <!--<Loading v-if="loading"></Loading>-->
    <div>
      <search  style="position:fixed;top:0;z-index:1" @on-submit="onSubmit" v-model="value2" @on-focus="onFocus" @on-cancel="onCancel"></search>
      <Scroller :on-refresh="onRefresh" :on-infinite="onInfinite">
        <swiper auto :aspect-ratio="400/750">
          <swiper-item class="swiper-demo-img" v-for="(item, index) in demo06_list" :key="index" @click.native="go_link(item.url,item.id)"><img style="height:100%;width:100%;object-fit: cover;" :src="item.picture"></swiper-item>
        </swiper>
        <div class="weui_flex" style="font-size:14px">
          <div class="flex_tab f_flex f_ac f_vc" style="color:#ad7de7">
            <div style="padding:5px" @click="showActionsheet2">{{current_rack}}</div>
            <i class="arrow"></i>
          </div>
          <div class="flex_tab f_flex f_ac f_vc" style="color:#ad7de7">
            <div style="padding:5px" @click="showActionsheet">{{current_sort}}</div>
            <i class="arrow"></i>
          </div>
        </div><load-more v-if="totalpage===0" :show-loading="false" tip="暂无商品数据" background-color="#efeff4"></load-more>
        <div v-else class="center_content font_1_2">
          <goodslist :goodsItem="goodsItem" :enter_type="1"></goodslist>
        </div>
      </Scroller>
    </div>
    <!--<search style="position:fixed;top:0;z-index:1" @result-click="resultClick" @on-change="getResult" :results="results" v-model="value" position="fixed" auto-scroll-to-top top="0" @on-focus="onFocus" @on-cancel="onCancel"></search>-->
    <actionsheet v-model="show_sort" :menus="sort" @on-click-menu="click_sort"></actionsheet>
    <actionsheet v-model="show_rack" :menus="rack" @on-click-menu="click_rack"></actionsheet>
  </div>
</template>

<script>
  import { Swiper,Search,Selector, Group,Actionsheet,SwiperItem,LoadMore} from 'vux'
  import goodslist from './goods_list.vue'
  import Scroller from '@/components/scroller_me/scroller';
  import Loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';

  export default {
    data () {
      return {
        loading:true,
        demo06_list: [],//轮播图
        demo06_index: 0,
        value2: '',
        goodsItem:[],//商品列表
        current_sort:'默认',
        sort:[],
        show_sort:false,
        show_rack:false,
        current_rack:'全部',
        rack:[],
        pageno:0,
        pagesize:4,
        current_sort_key:0,
        current_rack_key:0,
        totalpage:[]
      }
    },
    components: {
      Swiper,Search,goodslist,Selector, Group,Actionsheet,Scroller,Loading,SwiperItem,LoadMore
    },
    mounted(){
      setTitle("商品首页");
      this.getlist();
      this.getSwiper();
    },
    computed:{
      swiper_height(){
        return (document.body.clientWidth)/75*31+"px"
      }
    },
    methods: {
      getlist(){
        const self = this;
        const senddata = {
          "data": {
            "pageno":this.pageno,
            "pagesize":this.pagesize,
            "sort":this.current_sort_key,
            "rack":this.current_rack_key,
            "searchdata":this.value2
          }
        };
        if(service_url){
          this.$http.post(service_url+'/o2o/shop/wx/indexinfo.do',senddata).then( (data)=> {
            /*if(mark){
             let goodsList = data.body.fields.goodsList;
             for(let i =0;i<goodsList.length;i++){
             self.goodsItem.push(goodsList[i]);
             }

             }else{
             self.goodsItem=data.body.fields.goodsList;
             }*/
            self.totalpage=data.body.totalpage;
//            console.log(self.totalpage);
            if(self.totalpage===1||self.totalpage===0){
              this.$el.querySelector('.load-more').style.display = 'none';
            }else{
              this.$el.querySelector('.load-more').style.display = 'block';
            }
            self.goodsItem=data.body.fields.goodsList;

            let arr_sort=data.body.fields.sort;
            let json_sort={};
            for(var i=0;i<arr_sort.length;i++)
            {
              json_sort[arr_sort[i].key]=arr_sort[i].value
            }
            self.sort=json_sort;

            let arr_rack=data.body.fields.rack;
            let json_rack={};
            for(var j=0;j<arr_rack.length;j++)
            {
              json_rack[arr_rack[j].key]=arr_rack[j].value
            }
            self.rack=json_rack;

          },()=>{
            console.log(2);
          });
        }else{
          this.$http.get('/api/goodsIndex').then((data) => {
           self.totalpage=data.body.data.totalpage;
//           self.totalpage=0;
            if(self.totalpage===1||self.totalpage===0){
              this.$el.querySelector('.load-more').style.display = 'none';
            }else{
              this.$el.querySelector('.load-more').style.display = 'block';
            }
           self.goodsItem=data.body.data.fields.goodsList;
           let arr_sort=data.body.data.fields.sort;
           let json_sort={};
           for(let i=0;i<arr_sort.length;i++)
           {
           json_sort[arr_sort[i].key]=arr_sort[i].value
           }
           self.sort=json_sort;

           let arr_rack=data.body.data.fields.rack;
           let json_rack={};
           for(let j=0;j<arr_rack.length;j++)
           {
           json_rack[arr_rack[j].key]=arr_rack[j].value
           }
           self.rack=json_rack;

           }, () => {
           console.log(2);
           });
        }
        document.getElementById("index_loading").style.display="none";
      },
      getSwiper(){
          if(service_url){
            this.$http.get(service_url+"/o2o/notice/wx/newsIndex?ntype=2&sum=5&itemid=10").then((data)=>{
              this.demo06_list = data.body.data;
              /*for(let i in newsIndex){
                this.demo06_list.push(newsIndex[i].picture);
              }*/
            })
          }else{
            this.$http.get("/api/newsIndex").then((data)=>{
              this.demo06_list=data.body.data.data;
            })
          }
      },
      demo06_onIndexChange (index) {
        this.demo06_index = index
      },
      onSubmit (val) {
        this.value2=val;
        this.getlist();
      },
      onFocus () {
        console.log('on focus')
      },
      onCancel () {
        this.value2="";
        this.getlist();
      },
      showActionsheet () {
        this.show_sort=true;
      },
      showActionsheet2 () {
        this.show_rack=true;
      },
      click_sort(key){
        this.pageno=0;
        this.current_sort_key=parseInt(key);
        this.getlist();
        for(let i in this.sort){
          if(i==key){        //item 表示Json串中的属性，如'name'
            let jValue=this.sort[i];//key所对应的value
            this.current_sort=jValue;
          }
        }
      },
      click_rack(key){
        this.pageno=0;
        this.current_rack_key=parseInt(key);
        this.getlist();
        for(let i in this.rack){
          if(i==key){        //item 表示Json串中的属性，如'name'
            let jValue=this.rack[i];//key所对应的value
            this.current_rack=jValue;
          }
        }
      },
      onInfinite(done) {
        console.log("onInfinite")
        this.pageno++;
        const senddata = {
          "data": {
            "pageno":this.pageno,
            "pagesize":this.pagesize,
            "sort":this.current_sort_key,
            "rack":this.current_rack_key,
            "searchdata":this.value2
          }
        };
        const self = this;
        if(this.pageno>this.totalpage-1){
          this.$el.querySelector('.load-more').style.display = 'none';
          return;
        }else{
            if(service_url){
              this.$http.post(service_url+'/o2o/shop/wx/indexinfo.do',senddata).then( (data)=> {
                self.totalpage=data.body.totalpage;
                let goodsList = data.body.fields.goodsList;
                for(let i =0;i<goodsList.length;i++){
                  self.goodsItem.push(goodsList[i]);
                }
                done();
              })
            }else{
              this.$http.get('/api/goodsIndex').then((data) => {
               self.totalpage = data.body.data.totalpage;
               let goodsList = data.body.data.fields.goodsList;
               for(let i =0;i<goodsList.length;i++){
               self.goodsItem.push(goodsList[i]);
               }
                done();
               })
            }


        }
      },
      onRefresh(done) {
        this.pageno=0;
        console.log("onRefresh")
//        this.getlist();

        done() // call done
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
      }
    },
  }
</script>

<style scoped>
  .text-scroll p{
    font-size: 12px;
    text-align: center;
    line-height: 30px;
  }
  @-webkit-keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }
    100% {
      opacity: 1;
      transform: none;
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }
    100% {
      opacity: 1;
      transform: none;
    }
  }
  .fadeInUp {
    animation-name: fadeInUp;
  }
  .swiper-demo-img img {
    width: 100%;
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
  .f_flex{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .f_vc{
    -webkit-align-items: center;
    align-items: center;
    -ms-flex-align: center;
  }
  .f_ac{
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
  }
  .weui_flex .flex_tab{
    -webkit-box-flex: 1;
    position: relative;
    /*padding: .5em;*/
    width: 0;
    color: #000;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-align: center;
  }
  .weui_flex .flex_tab.focus{
    color:#24b8f1
  }
  .weui_flex .flex_tab .arrow{
    display: block;
    border-width: 6px 4px 0;
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
  }
  .center_content{
    padding:1.6% 0;
    border-top:1px solid #999;
    border-bottom:1px solid #999;
    overflow: hidden;
    background:#ececec;
  }
  .weui-cell_select .weui-cell__bd:after
</style>


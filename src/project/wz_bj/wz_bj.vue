<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div>
      <swiper auto :aspect-ratio="400/750">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in demo06_list" :key="index" @click.native="go_link(item.url,item.id)"><img style="height:100%;width:100%;object-fit: cover;" :src="item.picture"></swiper-item>
      </swiper>
      <group gutter="10px" v-for="item in this_list" :key="item.id" @click.native="goDetail(item.id)">
        <div :style="imageurl">
          <img style="width: 100%;height:100%;" :src = "item.img"/>
        </div>
        <cell :title="item.name">
          已有{{item.has_choose}}人选择
        </cell>
      </group>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {Swiper,Cell,Group,SwiperItem,Alert} from 'vux';

  export default{
    data(){
      return{
        loading:true,
        route_type:0,
        this_list: [],
        demo06_list:[],
        demo06_index:0,
        confirm_show:false,
        dialog_title:"",
        confirm_content:""
      }
    },
    computed:{
      imageurl(){
        return {"height":(document.body.clientWidth)*5/9+"px"}
      },
      imageheight(){
        return (document.body.clientWidth)/75*31+"px"
      }
    },
    components:{
      loading,Swiper,Cell,Group,SwiperItem,Alert
    },
    mounted(){
      let self =this;
      this.route_type=parseInt(this.$route.query.route_type);
      this.route_type===1?setTitle("保洁服务"):setTitle("微装服务");
      if(service_url){
        /*let get_url = service_url+"/o2o/notice/wx/newsIndex?ntype="+2+"&sum="+4+"&itemid=";
        let url = this.route_type===1?get_url+8:get_url+9;
        this.$http.get(url).then((data)=>{
            console.log(data);
          if(data.body.status==="ok"){
            self.demo06_list=data.body.data;
          }else{
            alert("访问失败");
          }
        });*/
        if(this.route_type===1){
          this.getSwiper();
          self.$http.get(service_url+"/o2o/hk/wx/index").then((data)=>{
            if(data.body.status===0){
              self.this_list=data.body.data;
            }else{
              this.dialog_title="提示";
              this.confirm_content=data.body.error_reason;
              this.confirm_show=true;
            }
          });
        }else{
          this.getSwiper();
          self.$http.get(service_url+"/o2o/reno/wx/index").then((data)=>{
            if(data.body.status===0){
              self.this_list=data.body.data;
            }else{
              this.dialog_title="提示";
              this.confirm_content=data.body.error_reason;
              this.confirm_show=true;
            }
          });
        }

      }else{
        this.getSwiper();
        this.$http.get("/api/wb_bj").then((data)=>{
          self.this_list=data.body.data.data;
        })
      }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      getSwiper(){
        if(service_url){
          let this_url = this.route_type===1?service_url+"/o2o/notice/wx/newsIndex?ntype=2&sum=5&itemid=9":service_url+"/o2o/notice/wx/newsIndex?ntype=2&sum=5&itemid=8";
          this.$http.get(this_url).then((data)=>{
            this.demo06_list = data.body.data;
          })
        }else{
          this.$http.get("/api/newsIndex").then((data)=>{
            this.demo06_list=data.body.data.data;
          })
        }
      },
      success (src, ele) {
        console.log('success load', src)
        const span = ele.parentNode.querySelector('span')
        ele.parentNode.removeChild(span)
      },
      error (src, ele, msg) {
        console.log('error load', msg, src)
        const span = ele.parentNode.querySelector('span')
        span.innerText = 'load error'
      },
      demo06_onIndexChange(index){
        this.demo06_index = index
      },
      goDetail(id){
          this.$router.push({path:'wb_detail',query:{id:id,route_type:this.route_type}})
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
    }
  }
</script>

<style scoped>
  .ximg-demo {
    width: 100%;
    height: auto;
  }
  .ximg-error {
    background-color: yellow;
  }
  .ximg-error:after {
    content: '加载失败';
    color: red;
  }
</style>

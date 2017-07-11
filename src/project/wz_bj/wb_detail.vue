<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div>
      <div style="padding-bottom:62px">
        <!--顶部图片-->
        <div :style="imageheight">
          <img style="width:100%;height:100%;" :src = "img"/>
        </div>
        <!--服务流程图-->
        <group gutter ="0">
          <cell title="服务流程展示"></cell>
          <div style="border-top:1px solid #ececec"><img :src = "procedure_img" style="width:100%;height:100%;"/></div>
        </group>
        <group gutter="10px">
          <cell title="服务介绍"></cell>
          <cell-box style="text-indent: 2em">
            {{content}}
          </cell-box>
        </group>
        <group v-if="route_type===1" gutter="10px">
          <cell title="服务价格" :value="this_price"></cell>
        </group>
        <group gutter="10px">
          <cell :title="eva_num"></cell>
          <div class="pj_detail" v-for="item in evaluate">
            <div class="f_flex" style="font-size:13px;">
              <div class="pj_img_div">
                <img :src="item.eva_img"/>
              </div>
              <div class="flex_1">
                <div><p class="pj_name text_ellipsis">{{item.eva_name}}</p><span style="float:right;color:#999;">{{item.eva_time}}</span></div>
                <rater v-model="item.eva_score" :font-size="15" active-color="#04BE02" disabled></rater>
                <div style="font-size:15px;">{{item.eva_content}}</div>
              </div>
            </div>
          </div>
        </group>
      </div>
      <div style="position:fixed;bottom:0;left:0;right:0;padding:10px;background-color:white;border-top:1px solid #ececec;z-index:20">
        <flexbox>
          <flexbox-item>
            <x-button type="primary" class="zj_button" @click.native="go_tel">电话咨询</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" class="zj_button" @click.native="go_reserve">{{route_type===1?"预约":"预约测量"}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {Group,Cell,Rater,CellBox,Flexbox,FlexboxItem,XButton} from 'vux';

  export default{
    data(){
      return{
          id:"",
        loading:true,
        eva_num:0,
        evaluate:[],
        content:"",
        tel:"",
        img:"",
        procedure_img:"",
        route_type:0,
        this_price:""
      }
    },
    computed:{
      imageheight(){
        return {"height":(document.body.clientWidth)*5/9+"px"}
      }
    },
    components:{
      loading,Group,Cell,Rater,CellBox,Flexbox,FlexboxItem,XButton
    },
    mounted(){
        this.id=this.$route.query.id;
        setTitle("服务详情");
        this.route_type=parseInt(this.$route.query.route_type);//1保洁 2微装
        let self = this;
        if(service_url){
            if(this.route_type===1){
              this.$http.get(service_url+"/o2o/hk/wx/details?id="+this.id).then((data)=>{
                self.evaluate= data.body.data.evaluate;
                self.content= data.body.data.content;
                self.this_price=data.body.data.unitprice+data.body.data.calunit;
                self.tel= data.body.data.tel;
                self.img= data.body.data.img;
                self.procedure_img= data.body.data.procedure_img;
                self.eva_num = "用户评价（"+data.body.data.evaluate.length+"）";
              })
            }else{
              this.$http.get(service_url+"/o2o/reno/wx/details?id="+this.id).then((data)=>{
                self.evaluate= data.body.data.evaluate;
                self.content= data.body.data.content;
                self.tel= data.body.data.tel;
                self.img= data.body.data.img;
                self.procedure_img= data.body.data.procedure_img;
                self.eva_num = "用户评价（"+data.body.data.evaluate.length+"）";
              })
            }

        }else{
            this.$http.get("/api/wb_detail").then((data)=>{
                self.evaluate= data.body.data.data.evaluate;
                self.content= data.body.data.data.content;
                self.tel= data.body.data.data.tel;
                self.img= data.body.data.data.img;
                self.procedure_img= data.body.data.data.procedure_img;
                self.eva_num = "用户评价（"+data.body.data.data.evaluate.length+"）";
            })
        }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      go_tel(){
        window.location.href = 'tel:' + this.tel;
      },
      go_reserve(){
        this.$router.push({path:'wb_reserve',query:{id:this.id,route_type:this.route_type,wb_type:1}});
      }
    }
  }
</script>

<style scoped>
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
  .flex_1{
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .pj_img_div {
    width: 45px;
    height: 45px;
    margin-right: 1rem;
  }
  .pj_img_div img {
    border-radius: 50%;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  .pj_name {
    display: inline-block;
    width: 130px;
    line-height:15px;
    font-size:15px;
  }
  .button_c{
    color:white;
    background-color:#ad7de7;
  }
  .button_c:active{
    background-color:red;
  }
</style>

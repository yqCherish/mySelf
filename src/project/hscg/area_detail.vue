<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div>
      <div style="position:relative">
        <img :style="img_height" :src = "img"/>
        <div style="position:absolute;bottom:10px;left:10px;color:white" >
          <div class="shadow">{{project_name}}</div>
          <rater  v-model="project_score" active-color="#ff9500" disabled></rater>
          <div class="shadow"><img src = "../../common/img/地址.png" style="vertical-align: middle;height:15px;margin-right:4px;"/>地址：{{project_address}}</div>
          <div class="shadow"><span><img src = "../../common/img/时间.png" style="vertical-align: middle;height:15px;margin-right:4px;"/>{{project_time}}</span><span style="margin-left:20px;"><img src = "../../common/img/联系电话.png" style="margin-right:4px;vertical-align: middle;height:15px;"/>{{project_tel}}</span></div>
        </div>
      </div>
      <group gutter="5px">
        <cell title="详细描述">
          <x-button mini plain @click.native="goReserve" style="color:white;background-color:#ad7de7;border-color:#ad7de7">立即预约</x-button>
        </cell>
        <cell-box>
          <p style="font-size:15px;font-weight:normal;text-indent: 2em;">{{goods_content}}</p>
        </cell-box>
      </group>
      <group gutter="10px">
        <div style="padding:10px 15px;">用户评价<span style="color:#999;font-size:14px;margin-left:5px;">{{'('+evaluate.length+')'}}</span></div>
        <div class="pj_detail" v-for="item in evaluate">
          <div class="f_flex" style="font-size:13px;">
            <div class="pj_img_div">
              <img :src="item.eva_img"/>
            </div>
            <div class="flex_1">
              <div><p class="pj_name text_ellipsis">{{item.eva_name}}</p><span style="float:right;color:#999;">{{item.eva_time}}</span></div>
              <rater v-model="item.eva_score" :font-size="15" active-color="#ff9500" disabled></rater>
              <div style="font-size:15px;">{{item.eva_content}}</div>
            </div>
          </div>
        </div>
      </group>
    </div>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {Group,Cell,CellBox,XButton,Rater} from 'vux';

  export default{
    data(){
      return{
        loading:true,
        goods_content:"",
        evaluate:[],
        img:"",
        eva_num:"",
        project_score:0,
        project_address:"",
        project_name:"",
        project_time:"",
        project_tel:"",
        project_id:""
      }
    },
    components:{
      loading,Group,Cell,CellBox,XButton,Rater
    },
    mounted(){
      let self = this;
      this.project_id=this.$route.query.project_id;
      setTitle("场馆详情");
      if(service_url){
          const item = {
            project_id:this.project_id
          };
        this.$http.post(service_url+'/o2o/club/wx/projectDetail',item).then((data)=>{
          self.evaluate=data.body.data.evaluate;
          self.goods_content=data.body.data.desc;
          self.project_score=data.body.data.score||5;
          self.project_address=data.body.data.address;
          self.project_name=data.body.data.name;
          self.project_time=data.body.data.worktime;
          self.project_tel=data.body.data.tel;
          self.img=data.body.data.img;
          self.eva_num="用户评价("+data.body.data.evaluate.length+")";
        });
      }else{
        this.$http.get('/api/area_detail').then((data) => {
          self.evaluate = data.body.data.data.evaluate.eva_detail;
          self.goods_content = data.body.data.data.desc;
          self.img=data.body.data.data.img;
          self.project_score = parseInt(data.body.data.data.score)||5;
          self.project_address = data.body.data.data.address;
          self.project_name = data.body.data.data.name;
          self.project_time = data.body.data.data.worktime;
          self.project_tel = data.body.data.data.tel;
          self.eva_num="用户评价("+data.body.data.data.evaluate.eva_detail.length+")";
        });
      }
      document.getElementById("index_loading").style.display="none";
    },
    computed:{
      img_height(){
        return{
          "width":"100%",
          "height":(document.body.clientWidth)/15*8+"px"
        }
      }
    },
    methods:{
      goReserve(){
        this.$router.push({ path: '/area_choose',query:{"project_id":this.project_id} });
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
  .flex_1{
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .shadow{
    text-shadow: black 1px 1px 1px;
  }
</style>

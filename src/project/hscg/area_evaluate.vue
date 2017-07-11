<template>
  <div>
    <group gutter="0">
      <cell title="评分">
        <rater v-model="eva_score" slot="value" star="✩" active-color="#FF9900" :margin="4"></rater>
      </cell>
    </group>
    <group gutter="0">
      <x-textarea :max="100" v-model="eva_content" :placeholder="placeholder"></x-textarea>
    </group>
    <div style="margin:20px 10px 10px;">
      <x-button v-if="route_type===1" type="primary" @click.native="insertcomment">提交</x-button>
    </div>
    <loading v-model="isLoading" :text="alert_text"></loading>
    <toast v-model="show_toast">{{toast_text}}</toast>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
  </div>
</template>

<script>
  import {setTitle} from '@/common/js/common';
  import {Group,Cell,Rater,XTextarea,XButton,Loading,Toast,Alert} from 'vux';

  export default{
    data(){
      return{
        isLoading:false,
        alert_text:"评分中",
        eva_score:0,
        eva_content:"",
        route_type:0,
        placeholder:"请输入评价内容",
        order_id:"",
        route_url:"",
        route_num:"",
        show_toast:false,
        toast_text:"",
        confirm_show:false,
        dialog_title:"提示",
        confirm_content:"",
      }
    },
    components:{
      Group,Cell,Rater,XTextarea,XButton,Loading,Toast,Alert
    },
    mounted(){
        let self = this;
      document.getElementById("index_loading").style.display="none";
      this.route_type=parseInt(this.$route.query.route_type);
      this.order_id=parseInt(this.$route.query.order_id);
      this.route_type===1?setTitle("评价"):setTitle("查看评价");
      this.route_url=this.$route.query.route_url;
      this.route_num=this.$route.query.route_num;
      if(this.route_type===2){
        const senddata={
          order_id:this.order_id
        };
          if(service_url){
            this.$http.post(service_url+this.route_url,senddata).then((data) => {
              self.eva_score=data.body.data.eva_score;
              self.eva_content=data.body.data.eva_content;
            })
          }else{
            this.$http.get('/api/area_evaluate').then((data) => {
              self.eva_score = data.body.data.eva_score;
              self.eva_content = data.body.data.eva_content;
            }, () => {
              console.log(2);
            });
          }

      }
    },
    methods:{
      insertcomment(){
        if(!this.eva_score){
          this.confirm_show=true;
          this.confirm_content="请选择评分";
          return;
        }
        if(!this.eva_content){
          this.confirm_show=true;
          this.confirm_content="请输入评价内容";
          return;
        }
        this.isLoading=true;
        if(service_url){
          const senddata={
            order_id:this.order_id,
            eva_score:this.eva_score,
            eva_content:this.eva_content,
          };
          this.$http.post(service_url+this.route_url,senddata).then((data) => {
            if(data.body.status===0){
              this.isLoading=false;
              this.show_toast=true;
              this.toast_text="评价成功";
              setTimeout(this.go_back,1000);
            }else{
              alert(data.body.error_reason);
            }
          })
        }else{
          this.isLoading=false;
          this.show_toast=true;
          this.toast_text="评价成功";
          setTimeout(this.go_back,1000);
        }
      },
      go_back(){
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div>
    <!--<loading style="text-align: center;" v-if="loading"></loading>-->
    <load-more v-if="goods.length===0" :show-loading="false" tip="您还有没有发布过商品呢" background-color="#efeff4"></load-more>
    <group>
      <goods-show :goods="goods" :type="goods_type" :path="path"></goods-show>
    </group>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading'
  import { Group,LoadMore,Alert} from 'vux'
  import {setTitle} from '@/common/js/common';
  import goodsShow from '@/project/pzsh/goods_show'

  export default{
      data(){
        return{
          loading:true,
          goods:[],
          path:"add_market_goods",
          goods_type:'4',
          confirm_show:false,
          dialog_title:"",
          confirm_content:""
        }
      },
      components:{
          Group,loading,goodsShow,LoadMore,Alert
      },
      mounted(){
        setTitle("我的发布");
        let self = this;
        if(service_url){
          this.$http.get(service_url+'/o2o/flea/wx/releaseList').then( (data)=> {
           if(data.body.result.status===0){
           self.goods = data.body.result.data;
             for(let i =0;i<self.goods.length;i++){
               self.goods[i].state_name=this.switchState(self.goods[i].status);
             }
           this.loading=false;
            }else{
             this.dialog_title="提示";
             this.confirm_content=data.body.result.error_reason;
             this.confirm_show=true;
           }
           });
        }else{
          this.$http.get('/api/myPublished').then((data) => {
            self.goods = data.body.data.data;
            for(let i =0;i<self.goods.length;i++){
              self.goods[i].state_name=this.switchState(self.goods[i].status);
            }
            this.loading=false;
          }, () => {
            console.log(2);
          });
        }
      },
    methods:{
          switchState(val){
              let this_val = parseInt(val);
              switch(this_val){
                case 0:
                    return "待审核";
                    break;
                case 1:
                    return "被拒绝";
                    break;
                case 2:
                    return "已下架";
                    break;
                case 3:
                    return "转让中"
              }
          },
    }
  }
</script>

<style scoped>

</style>

<template>
  <div>
    <loading v-model="isLoading" text="保存中"></loading>
    <alert v-model="confirm_show" :title="dialog_title">
      <cell style="text-align: left;" title="消费卡号">1232131</cell>
      <cell style="text-align: left;" title="消费卡类别">次卡</cell>
      <cell style="text-align: left;" title="费用">200元</cell>
      <cell style="text-align: left;" title="余额">2000元</cell>
    </alert>
  </div>
</template>

<script>
  import { Loading, Alert, Cell} from 'vux'
  export default {
    data(){
      return{
        isLoading:true,
        confirm_show:false,
        dialog_title:"提示",
      }
    },
    components: {
      Loading,Alert,Cell,Uploader
    },
    mounted () {
      this.isLoading=false;
      this.confirm_show=false;
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      previewMethod(){
        alert(3);
      },
      addImageMethod(){
        alert(1);
      },
      removeImageMethod(val){
        console.log(val);
      }
    }
  }
</script>

<style scoped>

</style>

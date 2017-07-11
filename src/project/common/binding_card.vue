<template>
  <div>
    <group title="绑定银行卡">
      <x-input type="tel" title="银行卡号" placeholder="请输入银行卡号" v-model="bank_card"></x-input>
    </group>
    <div style="padding:20px 10px">
      <x-button type="primary" class="zj_button" @click.native="confirm">确定</x-button>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{content}}</alert>
  </div>
</template>

<script>
  import {setTitle} from '@/common/js/common';
  import {Group,XInput,XButton,Alert} from 'vux';

  export default{
    data(){
      return{
        bank_card:"",
        confirm_show:false,
        dialog_title:"",
        content:""
      }
    },
    components:{
      Group,XInput,XButton,Alert
    },
    mounted(){
      setTitle("绑定银行卡");
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      confirm(){
          const item = {
            bank_card:this.bank_card
          };
        this.$http.post(service_url+"/o2o/assetsv2/wx/add_bank_card.do",item).then((data)=>{
          if(data.body.data.status===0){
            this.dialog_title="恭喜";
            this.content="添加成功！";
            this.confirm_show=true;
              this.$router.push({path:'my_bankCardList',query:{type:1}});
          }else{
            this.dialog_title="提示";
            this.content=data.body.data.error_reason;
            this.confirm_show=true;
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>

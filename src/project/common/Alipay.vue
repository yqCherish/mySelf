<template>
  <div>
    <group title="链接地址">
      <x-textarea id="foo" :show-counter="false" :rows="4" ref="abc" v-model="copy_url"></x-textarea>
    </group>
    <div style="padding:0 10px;font-size:14px;color:#ad7de7;">
      <span>请复制文本框中的链接并在浏览器中打开</span>
      <x-button type="primary" style="margin-top:20px;" class="zj_button btn" data-clipboard-target="#foo">点击复制</x-button>
    </div>
    <!--<input id="foo"  value="http://www.968309.com/mobile.php">
    <button class="btn" data-clipboard-target="#foo">复制</button>-->
    <alert v-model="confirm_show" :title="dialog_title"> {{content}}</alert>
  </div>
</template>

<script>
  import {setTitle} from '@/common/js/common';
  import {XTextarea,Group,XButton,Alert} from 'vux';
  import Clipboard from 'Clipboard'
  export default{
      data(){
        return{
            copy_url:"",
            type:"",
            pay:"",
          order_id:"",
          confirm_show:false,
          dialog_title:"",
          content:""
        }
      },
      components:{
        XTextarea,Group,XButton,Alert
      },
      mounted(){
        let this_url="http://fengcheng.fm-community.com.cn/o2o-assetsv2-webAndroid/wx/alipay/73431e0682ed4790a12012b2fa56e32c?orderid=";
        var clipboard = new Clipboard('.btn');
//优雅降级:safari 版本号>=10,提示复制成功;否则提示需在文字选中后，手动选择“拷贝”进行复制
        clipboard.on('success', function(e) {
          this.dialog_title="恭喜";
          this.content="复制成功";
          this.confirm_show=true;
          e.clearSelection();
        });
        clipboard.on('error', function(e) {
          this.dialog_title="提示";
          this.content='请点击“拷贝”进行复制!';
          this.confirm_show=true;
        });
        setTitle("支付宝支付跳转页");
        this.type=parseInt(this.$route.query.type);
        if(this.type===1){
          this.pay=parseInt(this.$route.query.pay);
          const items={
            emoney:this.pay
          };
          this.$http.post(service_url+"/o2o/assetsv2/wx/get_orderid.do",items).then((data)=>{
            if(data.body.status===0){
              this.order_id=data.body.data.order_id;
              this.copy_url=this_url+this.order_id;
            }else{
              this.dialog_title="提示";
              this.content=data.body.error_reason;
              this.confirm_show=true;
            }
          });
        }else{
          this.order_id=this.$route.query.order_id
          this.copy_url=this_url+this.order_id;
        }

        document.getElementById("index_loading").style.display="none";
      }
  }
</script>

<style scoped>

</style>

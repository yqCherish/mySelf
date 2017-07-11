<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center;"></loading>-->
    <div>
      <div v-if="type===1" style="padding:30px 40px;background-color:#ad7de7;color:white;">
        <x-input title="充值金额" placeholder="请输入您的充值金额" v-model="pay_price" :show-clear="false"></x-input>
      </div>
      <div class="jf_msg" v-else>
          <div>{{pay_name+pay_type}}</div>
          <div>应付金额：￥{{pay_num}}</div>
      </div>
      <group title="付款方式">
        <radio v-if="type===2" :options="radio003" @on-change="change" v-model="choose"></radio>
        <radio v-else :options="radio004" @on-change="change" v-model="choose"></radio>
      </group>
      <group gutter="10px" v-if="type===2||type===4">
        <x-switch title="发票" v-model="pay_page"></x-switch>
        <div v-show="pay_page">
          <x-textarea style="border-top:1px solid #ececec;" title="票务信息" placeholder="请输入票务信息" v-model="bill_msg"></x-textarea>
          <x-textarea title="我的地址" placeholder="请输入地址" v-model="address"></x-textarea>
          <checker style="padding:10px 15px;border-top:1px solid #ececec;"
            v-model="choose_value"
            type="radio"
            default-item-class="demo5-item"
            selected-item-class="demo5-item-selected"
            disabled-item-class="demo5-item-disabled"
          >
            <checker-item style="font-size:14px;" v-for="item in send_type" :key="item" :value="item" @on-item-click="itemclick">{{item}}</checker-item>
          </checker>
        </div>
      </group>
      <div style="padding:20px 10px">
        <x-button style="background-color:#ad7de7;color:white;" @click.native="go_pay">下一步</x-button>
      </div>
    </div>
    <alert v-model="confirm_show" :title="dialog_title" @on-hide="onHide"> {{content}}</alert>
    <div v-transfer-dom>
      <confirm v-model="show3"
               title="支付密码"
               @on-cancel="onCancel"
               :close-on-confirm="confirm_type"
               @on-confirm="onConfirm">
          <x-input type="password" v-model="password" placeholder="请输入密码" style="border:1px solid #ececec;"></x-input>
          <p v-if="password_mark" style="text-align: left;color:red;padding:5px;">请输入6位数字密码</p>
      </confirm>
    </div>
    <loading v-model="isLoading" text="支付中"></loading>
    <toast v-model="show_toast">{{toast_text}}</toast>
  </div>
</template>

<script>
  import {setTitle} from '@/common/js/common';
  import {XInput,Checklist,Group,Radio,XButton,Alert,XTextarea,Checker,CheckerItem,XSwitch,Loading,Toast, TransferDomDirective as TransferDom,Confirm} from 'vux';

  export default{
    data(){
      return{
        isLoading:false,
        pay_price:0,
        radio003: [{
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAIlklEQVRoge2aa3BU5RnHf+fs2d1sLpv7bROSiGAIDSFIEiTEemsrQxVnWu2HtkyFOs54YQZRHD/oqB2daW2V1ltrrVOrw0yrrUFAizggGiEkYBLCJcQAkSRnkw0LMdkkZ89eztsPCYuB7E1mGpjx/2nPeZ/zvP//+77neZ733SMJIQBwOp23Aw8B1UAylydGgf3ACw6HYxsAQghUVX3G5XIJTdOEYRjicoVhGELTNOFyuYSqqs8IIZBUVb1NUZStWVlZyLI8o8MbKwzDwO12EwgEVsrAervdfsWQB5BlGbvdDvCQDFRZrdYZphQ/JjlXyUCKJEkzTCd+THJOuXLWTRh8J2CmcUULMJvNKFGtDAPPli14m5sxNC2sWUDAv4ZtfD5mRhMycmIS5uIiCBOeBYIePLglDckkseCqbMymyONpkmUW5ubwSG0NiWYz6enpSKqqCofDEZa8a906xhsaIjr2SzJ3p36fRktORLsQZKBMgtTYzC/EfVWLePXHt4ZchYVn8+ao5AHess2JnTxAPt+aPMC+PicAgUAgsoCxXbticviRtTA+BhmXlneuycwAQNf1CAIMA/3gwajOfJJMu5IRe+8yl1zrLiuaGDCfzxdegO/ECYzR0ajODisZ+KQ4glkycImJvy4WAd62tpicNZuz4uvdHp/5hUi2WKjInXjfgsFg+DCqt7aCJJH38ssADKxdi6Qo5L70EmPbt+Oprwfgi3gFpEgsystl4/JbAPAHDfpHR3liVwOnhoejPr600IHpG7VbxBkwl5Rgq61FslrBMLCWlWGrqUH4fACIbyUAbpldwg3FRew40Y3TM8qqinJ+VVke0+N1RbOmXE8rIDg4SKC/n4SFCwHQmpsBsFZUTFw3NYEs052YiT8xCYDlVbO5vvy8c7Ny3nVSghmr2YQtTQFlYhT9hsELjfvZ1X0KgMOD7vOkJkfYLMuh18ViMgGwrKhgKllVVS/auo1u3y5OVlaKkfp6IYQQztWrxcnKSjG6Y4fwdXeLgfXrhaHrwusZE0IIUbP2TbGztVs88ted4q5n3hOuoTGh6X6x8b1m8dTbDcIwhBjyaMIXCIrs5/4kTo+Ni7OaJt5oOSg8ui52f3VKPL+3afJ3jzjmPiPu/+Aj4Q8GxYpN74izmiaWvfG2MD39WzHq84V4qqoqpp2Bcy+wdf58APSODpBlbDU1aPv2TdyXJP7zz48BqJidzc2VJQx+Pc7r61bwj4/b+exQL9eXz+K6eQ661LO823AMRZYpTrOTlWijpX+AQ4On+cV7W/nd5/tYv7SGFZveZWmhg073GYY0L4os84cf3cz24yfZ09vHovxckszm6EvI29oKgJSQAEDy8uVkPvYYckoKns2bsS5YgK+jAy09m3HdT4J5IhacHh4nNcnKif6vqSnNZ8+RPiqvzqXhcC9F2XY63WeocuQD8Ps9Tfxx3362dHZRXZCPLxgkyWLGYjLx6aleeoZHAChJS+XRjz8BLl7/0wowxsbwdXUBMPTKK+hHjpB2zz2Yi4sZWLsWX1cXpsxMzhxoJSMvi21Nx7mmMIPd7T3savuKna1f8eQv6/j0UC+v/7cNrz/A7vYe8rOS2X7iJPnJyRx0DdKk9of63NOjMqzrPPeDmzg9Pk5jr4rTM5GDnt/bTN+IB4BlswoupHtxMaft3cvAAw9MNzFT8KF1Fg+mLo1qF0IWcE3sGWxD7RIerq1hzouvMToZ9fofXkteclLIxul0XpwHYk1gkcJnotXMhruWsPeoSmOHyn23XcuwTSfHkUhWYiLHzw7xcvMXPHVjHR7dh1UxkWmzYTUpbOs6Tlu/izvnz+PxnZ+FyF+dnjaF/Dl8awEHLJnT3k+wKGx5+k4Wz81j9a0VfNh8gntXLOK1plb8ssGqinL+cqCV4tRUnryhjucbm7l3cSWfdJ9ilt3OynlzCBqCI6fdvNF6vhY7V/9EFCCCQfRDh6KSH5cUjirp07bNzkujYnYOO1q60fQAhiEIGgaFGSkU2lPIsCWwpbOL20vnALA4P48Ui4WWfhfFaamc1bwAdA99jfiG37owAqa8xL6ODoTXG1VAmzmTYJiKzBcIoro9lBZmsru9h7kFGRhCsDAvh9zkJOqPfUmT6mRl6VzePXqMhp5ezmgabQMutnYeZ2FuDn9rOcgLjfun+J0uAl0kIOblY55++QA8/vNlVF6dS35GMmturWDJPAeP/nsiDO48eYoERcFutXJjSRHlOdlsqF3CB18e59r8PDYsW0KH+wxZiTbG/f6Qz0ybjXlZ0/c5RYAes4DssG1v7mgHoOrBv/PkWw2kJlnZ3ddLcWoqLf0D/Pr9D/lpWSlmWeaJXZ8hgMY+JwmKiTGfn7KsTF5sOoBrbCzks3ZWQdgKPO4ZCCLREmEGFlw1Ueq2/XkN15VNhOdt996JNxDgNzddjxYIUF2Qz/udXTx1Yx2yJHF35QJ+9r0yVmx6B6dnlAdrFk/xGW79A0gDAwMiNzcXf08PfXfcEVXAYSWdlRk/jGoXQjJQcWk7mD1rVlE7TRJzOp3IFosFiH35xF0+X+IGxmoyUeXIC9seEhB7/I9/A3MpqC7ID5XS0yEkIKCqMTnsky/OhhGREJ/5hbhr/ryI7bJpUl1CdXVMDpf6B+NjEH2XGBZ3lM7l/uprI9pIuq4Li8UycYRYX49+5AgiEAj7gF/ApkGF9nGJgKRgysxAcTggzH8MBoJO/1mGDC/JiRbKS7JDO65wSLKYufmqYn5SVhrxAMPpdCK5XC6RkxPHqdplBKfTiRyIMNpXAq7o43X4TsDMQwY8QoiohpcbJjmPysABXddnmE78mOS8XwY2joyMYBjGDFOKHYZhMDIyArBRdjgcWwOBwLNutxuv18vlvJyEEHi93nPfSTzrcDi2SuL85zYrgXVADRBnwfN/wxjQDGx0OBxbAf4H+BE5Gp0eqY0AAAAASUVORK5CYII=',
          key: '1',
          value: '银联'
        }, {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFdklEQVRoge2aa2xTZRjHf+ec9vS6rQgdmzC2CUxEQDAgqOOOQUURLxFi8ALESDRRUT6gMcEYiR+MEv1okFviDREE5rgpEhEDbCoJTokxUsc2d7OjY21pz+k5figrG23X03baLeH38fTNc/7/533e933Omwrs8HKZ+4E1wDTAycCkC6gB3gWqAMTLP7wJ7AXmMnDFQ1TbXGAfUc0I7PDed/nBYGSxCLyUaxVZsEYEpuZaRRZMFYG8XKvIgjxTf0bbOs3Bk2Vy3PPyah8ev9afr4ohph4ysLlmINcMegN9LmIBKDALhoPJSdKRbxJwpRFH0cGv6obGCuzwJh3pMgt0LHEZfnF/sadJYcnxLkNj+5wBRY8GM8qtLokSe/w0HG5RCEQMh+HkP6rhsX3OQLpcOwcyYNAbMNRKjHGKVA5LPXSMM3E+Hhkp0x5KXUIev8bRNuP1DwYNVA4zsWWaI63APXl7ks3QuNfrgv+Nge/bVVbU+NMK3Bfrx9soc8TP1v7m9MRDP+9CRpAECD40BPNV+lsuaVxf5UNLU83/vognFkhx4gF2Nihpi4ccGHh4ZPw5AbDVE8oonqE1IAAj7SKldpECs0AgouNXoSGo0RQ0fkBJAiwfFW/gF1+E2o40juoe9GngniIzq8plFhaZcZoSN2N+VaeuM8Ipb4Tj7SrftCq0hRLXwoMj5ISLd7MnnIH0KAkX8QibyEfTHcx2Z/bFefpChF2NYb5sVDjju5LZE/PzmH5d75gXVZ2SKh8+JbO9JE7hxAKJg7OcFFvjM6UTLadUTHZJTHbZeONmG3WdEbZ7wrSGtDjxAB/8GcpYPFw1A6V2kVML8im0CNQHNPY2KRxvV6nrjNBySaMtpKMDVknAbRGocIpMLJCYU2hm1jATQ2TjPT9Ey6+s2kd7kpJLy4AAfD07j3mFJt46e4n1dUGUNBpISYAFw80sK5F5tMSMXUptpvpvhcdO+vtnBu4tNvNVpZPN50Ksqg1kHBBgiCywsszCC2MtCb8PehLW4FCLwhcNYfY2KXjD6ZmJGfhkhoOlJTIlVT4a09ga+0IW4eicPG4famwzUHU40qqwu1FhV0OYVgOlFTNw9u58REGgYr8vO9U9eLxUZvttmTWBmh7twXY2hNnTpFAfSJzUWGqskkBnFrV4NfMLTXw4NfMOVhRgltvELLeJ96fAr50RDjYrVDerHGtT6O7OYwa8YZ1xeSImITqV2bCwyMzuOxxxPY+mw7ITfjwBjedGW1heKmNgrQMwPl9ifL7EmorouvmpQ+X3Lu1KL/RDu4pNElhYZM5K/PNjLey704ktgbJnfgzweUOYGq/KUzV+xh3wsc0TJpJmwmQRZgw18USpfMXAtr+ix/k7t9jSugvqptwhUj3TyXuT7Qkzv6o2wKZzvRu2P7q0mJEtnnBa23Y3vQ6yqkoni4rN/NYZYd2ZIPublZRBp7gkVo+2sKLMkrBN7gjrLDvh51BL6uuZUXaRtTdaebpcxmqwtnoZKHOI/HxXfuwW7YKic6xN5fSFCOeDGm0hDbskUGQVmVAgMdtt4oYEzVk3R1qjpXI+yQ6SDLdF4OUKK6tHW1JWQ1wzN6/QxIGZeQmzaZT6gMarZ4J8XB8mm/3AZRZ4doyFF8dacVsSG0nYjc5xm/h0hoPhCRq6ZOjAd20qm86F+Ox8ZvWcDJsksLJcZm2FNa4dT/pNnG8WmOs2MckV3b5G2UXcFjF2gdul6jQENM5e1KjxqhxuUQydnNlgEmBpicy6cVYmFEh9GxjICMCiYjOv3GQdnAZ6IgIXcy0iC7pEoDbXKrKgRgQ25lpFFmwUif5PYkOulWTABmBf96b6GvAA8C3Qf5eg/Y+fqMbFRDXzL1SO8xstatNNAAAAAElFTkSuQmCC',
          key: '2',
          value: '支付宝'
        }, {
          icon: 'data:image/png;base64,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',
          key: '3',
          value: '微信'
        },{
          icon:'data:image/png;base64,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',
          key:'4',
          value:'钱包'
        }],
        radio004: [{
          icon: 'data:image/png;base64,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',
          key: '1',
          value: '银联'
        }, {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFdklEQVRoge2aa2xTZRjHf+ec9vS6rQgdmzC2CUxEQDAgqOOOQUURLxFi8ALESDRRUT6gMcEYiR+MEv1okFviDREE5rgpEhEDbCoJTokxUsc2d7OjY21pz+k5figrG23X03baLeH38fTNc/7/533e933Omwrs8HKZ+4E1wDTAycCkC6gB3gWqAMTLP7wJ7AXmMnDFQ1TbXGAfUc0I7PDed/nBYGSxCLyUaxVZsEYEpuZaRRZMFYG8XKvIgjxTf0bbOs3Bk2Vy3PPyah8ev9afr4ohph4ysLlmINcMegN9LmIBKDALhoPJSdKRbxJwpRFH0cGv6obGCuzwJh3pMgt0LHEZfnF/sadJYcnxLkNj+5wBRY8GM8qtLokSe/w0HG5RCEQMh+HkP6rhsX3OQLpcOwcyYNAbMNRKjHGKVA5LPXSMM3E+Hhkp0x5KXUIev8bRNuP1DwYNVA4zsWWaI63APXl7ks3QuNfrgv+Nge/bVVbU+NMK3Bfrx9soc8TP1v7m9MRDP+9CRpAECD40BPNV+lsuaVxf5UNLU83/vognFkhx4gF2Nihpi4ccGHh4ZPw5AbDVE8oonqE1IAAj7SKldpECs0AgouNXoSGo0RQ0fkBJAiwfFW/gF1+E2o40juoe9GngniIzq8plFhaZcZoSN2N+VaeuM8Ipb4Tj7SrftCq0hRLXwoMj5ISLd7MnnIH0KAkX8QibyEfTHcx2Z/bFefpChF2NYb5sVDjju5LZE/PzmH5d75gXVZ2SKh8+JbO9JE7hxAKJg7OcFFvjM6UTLadUTHZJTHbZeONmG3WdEbZ7wrSGtDjxAB/8GcpYPFw1A6V2kVML8im0CNQHNPY2KRxvV6nrjNBySaMtpKMDVknAbRGocIpMLJCYU2hm1jATQ2TjPT9Ey6+s2kd7kpJLy4AAfD07j3mFJt46e4n1dUGUNBpISYAFw80sK5F5tMSMXUptpvpvhcdO+vtnBu4tNvNVpZPN50Ksqg1kHBBgiCywsszCC2MtCb8PehLW4FCLwhcNYfY2KXjD6ZmJGfhkhoOlJTIlVT4a09ga+0IW4eicPG4famwzUHU40qqwu1FhV0OYVgOlFTNw9u58REGgYr8vO9U9eLxUZvttmTWBmh7twXY2hNnTpFAfSJzUWGqskkBnFrV4NfMLTXw4NfMOVhRgltvELLeJ96fAr50RDjYrVDerHGtT6O7OYwa8YZ1xeSImITqV2bCwyMzuOxxxPY+mw7ITfjwBjedGW1heKmNgrQMwPl9ifL7EmorouvmpQ+X3Lu1KL/RDu4pNElhYZM5K/PNjLey704ktgbJnfgzweUOYGq/KUzV+xh3wsc0TJpJmwmQRZgw18USpfMXAtr+ix/k7t9jSugvqptwhUj3TyXuT7Qkzv6o2wKZzvRu2P7q0mJEtnnBa23Y3vQ6yqkoni4rN/NYZYd2ZIPublZRBp7gkVo+2sKLMkrBN7gjrLDvh51BL6uuZUXaRtTdaebpcxmqwtnoZKHOI/HxXfuwW7YKic6xN5fSFCOeDGm0hDbskUGQVmVAgMdtt4oYEzVk3R1qjpXI+yQ6SDLdF4OUKK6tHW1JWQ1wzN6/QxIGZeQmzaZT6gMarZ4J8XB8mm/3AZRZ4doyFF8dacVsSG0nYjc5xm/h0hoPhCRq6ZOjAd20qm86F+Ox8ZvWcDJsksLJcZm2FNa4dT/pNnG8WmOs2MckV3b5G2UXcFjF2gdul6jQENM5e1KjxqhxuUQydnNlgEmBpicy6cVYmFEh9GxjICMCiYjOv3GQdnAZ6IgIXcy0iC7pEoDbXKrKgRgQ25lpFFmwUif5PYkOulWTABmBf96b6GvAA8C3Qf5eg/Y+fqMbFRDXzL1SO8xstatNNAAAAAElFTkSuQmCC',
          key: '2',
          value: '支付宝'
        }, {
          icon: 'data:image/png;base64,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',
          key: '3',
          value: '微信'
        }],
        choose:'3',
        order_id:"",
        dialog_title:"",
        content:"",
        confirm_show:false,
        type:0,
        pay:0,
        pay_page:false,
        bill_msg:"",
        address:"",
        choose_value:"自取发票",
        send_type:["自取发票","送票上门","邮寄"],
        show3:false,
        password:"",
        confirm_type:false,
        password_mark:false,
        mask:0,
        show_toast:false,
        toast_text:"",
        pay_num:0,
        pay_type:0,
        pay_name:"" //支付类型名称
      }
    },
    directives: {
      TransferDom
    },
    components:{
      Loading,XInput,Group,Radio,XButton,Alert,XSwitch,XTextarea,Checker,CheckerItem,Confirm,Toast
    },
    mounted(){
        /*   1是钱包充值   2是物业缴费    3是品质生活   4是维修费*/
        this.type= parseInt(this.$route.query.type);
        this.pay_type= this.$route.query.pay_type?"("+this.$route.query.pay_type+")":"";
        this.pay_num= this.$route.query.pay_num;
        this.pay_name=this.switch_name(this.type);
        this.pay= parseFloat(this.$route.query.pay);
        this.order_id = this.$route.query.order_id?this.$route.query.order_id:"";
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      change(value){
        console.log('change:', value);
        this.choose=value;
      },
      o_validate(){
        if(this.bill_msg){
          this.dialog_title="提示";
          this.content="请输入票据信息";
          this.confirm_show=true;
          return false;
        }
        if(this.address){
          this.dialog_title="提示";
          this.content="请输入详细地址";
          this.confirm_show=true;
          return false;
        }
      },
      go_pay(){
          /*if(this.pay_page){
            if(!this.o_validate){
                return;
            }
            const this_item = {
              ticketinfo:this.bill_msg,
              ticketmethod:this.bill_msg,
              address:this.bill_msg,
              ordernum:this.order_id
            };
            this.$http.post(service_url+"/o2o/assetsv2/ticket/add_bill",this_item).then((data)=>{
              if(data.body.status===0){

              }else{
                this.dialog_title="提示";
                this.content=data.body.error_reason;
                this.confirm_show=true;
              }
            })
          }*/
          let choose = parseInt(this.choose);
          if(this.choose){
              const items = {
                emoney:this.pay_price
              };
              switch (choose){
                case 1:
                    if(this.type===1){
                        if(this.pay_price&&this.pay_price>0){
                          if(!this._validate()){
                              return;
                          }
                          this.$router.push({path:"my_bankCardList",query:{pay:this.pay_price,type:this.type,show:1}});
                        }else{
                          this.dialog_title="提示";
                          this.content="请输入充值金额！";
                          this.confirm_show=true;
                        }

                    }else if(this.type===2||this.type===3||this.type===4){
                      this.$router.push({path:"my_bankCardList",query:{type:this.type,order_id:this.order_id,show:1}});
                    }
                  break;
                case 2:
                    if(this.type===1){
                      if(this.pay_price&&this.pay_price>0){
                        if(!this._validate()){
                          return;
                        }
                        this.$router.push({path:"Alipay",query:{pay:this.pay_price,type:this.type}});
                      }else{
                        this.dialog_title="提示";
                        this.content="请输入充值金额！";
                        this.confirm_show=true;
                      }
                    }else if(this.type===2||this.type===3||this.type===4){
                      this.$router.push({path:"Alipay",query:{type:this.type,order_id:this.order_id}});
                    }
                  break;
                case 3:
                  if(this.type===1){
                    if(this.pay_price&&this.pay_price>0){
                      if(!this._validate()){
                        return;
                      }
                      this.$http.post(service_url+"/o2o/assetsv2/wx/get_orderid.do",items).then((data)=>{
                        if(data.body.status===0) {
                          const item = {
                            orderId:data.body.data.order_id
                          };
                          this.$http.post(service_url+"/o2o-assetsv2-webAndroid/wx/weixin/pay",item).then((odata)=>{
                            function onBridgeReady(){
                              WeixinJSBridge.invoke(
                                'getBrandWCPayRequest', {
                                  "appId":odata.body.data.appId,     //公众号名称，由商户传入
                                  "timeStamp":odata.body.data.timeStamp,         //时间戳，自1970年以来的秒数
                                  "nonceStr":odata.body.data.nonceStr, //随机串
                                  "package":odata.body.data.package,
                                  "signType":odata.body.data.signType,         //微信签名方式：
                                  "paySign":odata.body.data.paySign, //微信签名
                                  "packageValue":odata.body.data.packageValue, //微信签名
                                  "sendUrl":odata.body.data.sendUrl //微信签名
                                },
                                function(res){
                                    /*返回出微信支付的错误码，遇到的坑是支付权限目录的配置问题*/
//                                  alert(JSON.stringify(res));
//                                  alert(res.err_msg);
                                  if(res.err_msg == "get_brand_wcpay_request:ok" ) {

                                  }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                                  else{
                                    this.dialog_title="提示";
                                    this.content="支付失败！";
                                    this.confirm_show=true;
                                  }
                                }
                              );
                            }
                            if (typeof WeixinJSBridge == "undefined"){
                              console.log("un");
                              console.log(document.addEventListener);
                              if( document.addEventListener ){
                                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                              }else if (document.attachEvent){
                                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                              }
                            }else{
                              onBridgeReady();
                            }
                          });
                        }
                      });
                    }else{
                      this.dialog_title="提示";
                      this.content="请输入充值金额！";
                      this.confirm_show=true;
                    }
                  }else if(this.type===2||this.type===3||this.type===4){
                    const item = {
                      orderId:this.order_id
                    };
                    this.$http.post(service_url+"/o2o-assetsv2-webAndroid/wx/weixin/pay",item).then((data)=>{
                      function onBridgeReady(){
                        WeixinJSBridge.invoke(
                          'getBrandWCPayRequest', {
                            "appId":data.body.data.appId,     //公众号名称，由商户传入
                            "timeStamp":data.body.data.timeStamp,         //时间戳，自1970年以来的秒数
                            "nonceStr":data.body.data.nonceStr, //随机串
                            "package":data.body.data.package,
                            "signType":data.body.data.signType,         //微信签名方式：
                            "paySign":data.body.data.paySign //微信签名
                          },
                          function(res){
//                            alert(res.err_msg);
                            if(res.err_msg == "get_brand_wcpay_request:ok" ) {

                            }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                            else{
                              this.dialog_title="提示";
                              this.content="微信支付失败！";
                              this.confirm_show=true;
                            }
                          }
                        );
                      }
                      if (typeof WeixinJSBridge == "undefined"){
                        console.log("un");
                        console.log(document.addEventListener);
                        if( document.addEventListener ){
                          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        }else if (document.attachEvent){
                          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                      }else{
                        onBridgeReady();
                      }
                    });
                  }
                  break;
                case 4:
                    this.show3=true;
              }
            }else{
            this.dialog_title="提示";
            this.content="请选择支付方式！";
            this.confirm_show=true;
            }
      },
      _validate(){
        if(this.pay_price>50000-this.pay){
          this.dialog_title="提示";
          this.content="充值总额限定5W元！";
          this.confirm_show=true;
          return false;
        }
        return true;
      },
      itemclick(val){
        this.choose_value = val;
      },
      onConfirm(){
        let reg = /^\d{6}$/;
        if(!reg.test(this.password.trim())){
            this.password_mark=true;
          /*this.dialog_title="提示";
          this.content="请输入6位数字密码";
          this.confirm_show=true;*/
          return;
        }
        this.isLoading=true;
        if(service_url){
            const items = {
              orderId:this.order_id,
              password:this.password
            };
            this.$http.post(service_url+"/o2o/assetsv2/wx/kenai/pay",items).then((data)=>{
                this.isLoading=false;
                if(data.body.status===0){
                  this.show3=false;
                  this.show_toast=true;
                  this.toast_text="支付成功";
                  setTimeout(this.go_back,1000);
                }else{
                  this.dialog_title="提示";
                  this.content=data.body.error_reason;
                  this.show3=false;
                  this.mask=1;
                  this.confirm_show=true;
                  return false;
                }
            })
        }else{
         /* this.dialog_title="提示";
          this.content="密码错误，请重新输入密码";
          this.show3=false;
          this.mask=1;
          this.confirm_show=true;
          return false;*/
          this.isLoading=false;
          this.show3=false;
          this.show_toast=true;
          this.toast_text="支付成功";
          setTimeout(this.go_back,1000);
        }
      },
      onCancel(){
        this.password="";
        this.password_mark=false;
      },
      onHide(){
        if(this.mask===1){
            this.show3=true;
            this.mask=0;
        }
      },
      go_back(){
          this.$router.go(-1);
      },
      switch_name(type){
        switch(type){
          case 2:
              return "物业缴费";
          break;
          case 3:
              return "品质生活";
              break;
          case 4:
              return "维修费";
              break;
        }
      }
    }
  }
</script>

<style scoped>
  input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: #aab2bd;
    /* placeholder字体大小  */
    font-size: 12px;
    /* placeholder位置  */
    text-align: right;
  }
  .jf_msg{
    background-color:#ad7de7;
    color:white;
    font-size:17px;
    padding:10px 15px;
  }
  .demo5-item {
    border: 1px solid #ad7de7;
    border-radius:5px;
    padding: 5px 15px;
    margin:5px;
  }
  .demo5-item-selected {
    /*background: #ffffff url(../assets/demo/checker/active.png) no-repeat right bottom;*/
    color:white;
    background-color:#ad7de7;
  }
  .demo5-item-disabled{
    color: #888;
    background-color: #dfdfdf;
    border: 1px solid #bfbfbf;
  }
</style>

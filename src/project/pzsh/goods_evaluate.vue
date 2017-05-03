<template>
  <div class="body">
    <div v-for="item in evaluate">
      <group :title="item.name">
        <cell title="商品评分">
          <rater v-model="data5" slot="value" star="✩" active-color="#FF9900" :margin="4"></rater>
        </cell>
      </group>
      <group gutter="0">
        <x-textarea :max="100" :placeholder="eva_content" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')"></x-textarea>
      </group>
    </div>
    <x-button class="abs_button" type="primary">提交</x-button>
  </div>
</template>

<script>
  import { Rater, Group, Cell, XTextarea, Panel, XButton} from 'vux'

  export default {
    components: {
      Rater,
      Group,
      Cell,
      XTextarea,
      Panel,
      XButton
    },
    data () {
      return {
        data5: -1,
        eva_content:'请输入评价详细内容',
        evaluate:[]
      }
    },
    methods:{
      onEvent (event) {
        console.log('on', event)
      }
    },
    mounted(){
      let self = this;
      this.order_id=this.$route.query.id;
      console.log(this.order_id);
      const senddata = {
        "order_id":this.order_id
      };
      this.$http.get('/api/goodsDetails').then((data) => {
       self.evaluate = data.body.data.evaluate;
       }, () => {
       console.log(2);
       });
      this.loading = false;
    },
  }
</script>

<style scoped>
  .body{
    padding-bottom: 44px;
  }
  .abs_button{
    position:fixed;
    bottom:0;
  }
</style>

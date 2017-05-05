<template>
  <div>
    <div class="weui_flex border_bottom_2 " v-for="item in goods">
      <div class="img_div">
        <img class="object_fit" :src="item.img"/>
      </div>

      <div class="ui_describe flex_1 posr font_14">
        <template v-if="type === '1'">
          <div style="max-height:45px;overflow: hidden">{{item.name}}</div>
          <div class="text_ellipsis width_13">规格: {{item.modelname}}</div>

          <!--<div class="color_red"><span class="mark_span">￥</span><span class="price_span">{{item.price}}</span><x-button mini plain type="primary" style="font-size:10px;float:right">删除商品</x-button></div>-->
          <div class="color_red" style="position:absolute;left:0;bottom: 0;"><span class="mark_span">￥</span><span class="price_span">{{item.price}}</span></div>
          <div style="position:absolute;right:0;bottom: 0;"><span class="mark_span">X</span><span style="font-size:16px;">{{item.num}}</span></div>
        </template>
        <template v-if="type === '2'">
          <div style="max-height:42px;overflow: hidden">{{item.name}}</div>
          <div class="color_red font_1_4" style="position:absolute;left:0;bottom:0">￥{{item.price}}</div>
          <div style="font-size:10px;position:absolute;right:0;bottom:0"><span class="mark_span">X</span><span
            class="price_span">{{item.num}}</span></div>
        </template>
        <template v-if="type === '3'">
          <div style="max-height:42px;overflow: hidden">{{item.name}}</div>
          <div class="color_red" style="position:absolute;left:0;bottom:0">￥{{item.price}}</div>
          <x-button mini plain type="primary" style="font-size:10px;position:absolute;right:0;bottom:0" @click.native="onDeleteClick(item.goods_id)">取消收藏</x-button>
        </template>
      </div>
    </div>
  </div>

</template>

<script>
  import {XButton} from 'vux'
  export default{
    props: {
      goods: Array,
      type: {
        type: String,
        default: '1'
      },
    },
    components: {
      XButton
    },
    methods:{
      onDeleteClick(key){
        this.emitEvent('on-click-menu', key)
      },
      emitEvent (event, menu, shouldClose = true) {
        if (event === 'on-click-menu' && !/.noop/.test(menu)) {
          this.$emit(event, menu)
          this.$emit(`${event}-${menu}`)
          shouldClose && (this.show = false)
        }
      },
    }
  }
</script>

<style scoped>
  .font_14 {
    font-size: 14px;
  }

  .img_div {
    height: 100px;
    width: 100px;
  }

  .object_fit {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .weui_flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    outline: 0;
    -webkit-align-items: center;
    align-items: center;
  }

  .border_bottom_2 {
    border-bottom: 1px solid #ececec;
    padding: 10px;
  }

  .weui_flex .ui_describe {
    margin-left: 10px;
    height: 100px;
  }

  .flex_1 {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }

  .posr {
    position: relative;
  }

  .width_13 {
    width: 140px;
    font-size: 13px;
    margin-top:3px;
    color:#999;
  }

  .text_ellipsis {
    text-overflow: ellipsis; /*文字隐藏后添加省略号*/
    white-space: nowrap; /*强制不换行*/
    overflow: hidden; /*自动隐藏文字*/
  }

  .color_red {
    font-size:20px;
    color: red;
  }

  .mark_span {
    font-size: 13px;
  }

  .price_span {
    font-size: 20px;
  }



</style>

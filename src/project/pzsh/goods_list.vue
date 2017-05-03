<template>
  <div>
    <div class="single_goods" v-for="item in goodsItem">
      <router-link :to="{path:'goods_detail',query: {id:item.goods_id}}">
        <a class="display_block font_14">
          <div><img :src="item.img?item.img:'http://pic.qiantucdn.com/58pic/25/94/22/94558PICxJ3_1024.jpg'" width="100%" style="height:180px;"/></div>
          <div class="padding_5">
            <p class="width_10 text_ellipsis">{{item.name}}</p>
            <p><span class="color_red font_1_4">￥{{item.price}}</span><span class="next_span">已销{{item.sale_num}}件</span></p>
          </div>
        </a>
      </router-link>
    </div>
  </div>

</template>
<script>
  export default{
    props:{
      goodsItem: {
        type: [Object, Array],
        default: () => ({})
      },
    }
  }
</script>
<style scoped>
  .font_14{
    font-size:14px;
  }
  .single_goods{
    display: inline-block;
    padding:0.8%;
    width:47.6%;
    float:left;
    background:white;
    cursor:pointer;
  }
  .single_goods:nth-child(odd){
    margin-right:1.6%;
    margin-bottom:1.6%;
  }
  .single_goods .padding_5{
    padding-left:.5rem;
  }

  .single_goods .this_store{
    border-top:.2rem solid #ececec;
    padding:.5rem;
  }
  .display_block{
    display:block;
  }
  .width_10{
    width:140px;
    color:black;
  }
  .text_ellipsis{
    text-overflow: ellipsis;/*文字隐藏后添加省略号*/
    white-space: nowrap;/*强制不换行*/
    overflow: hidden; /*自动隐藏文字*/
  }
  .color_red{
    color:red;
    font-size:16px;
  }
  .next_span{
    font-size:12px;
    color:#999;
    margin-left:.5em;
  }
</style>

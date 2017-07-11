<template>
  <li class="weui-uploader__file" :style="imageurl" @click="clickZoomIn" id="my_weui_uploader" :filename="item.val">
    <i class="weui_icon_clear2" style="position:absolute; right:-10px; top:-12px;z-index:10;" @click="deleteImage"></i>
  </li>
</template>

<style type="text/css">
  #my_weui_uploader .weui_icon_clear2:before {
    color: #f76260;
    font-size: 20px;
  }
</style>

<script>
  export default {
    props: ['fieldname','index','item','count','length','max'],
    computed:{
      imageurl(){
        return {"background-image":"url(" + this.item.desc + ")"}
      }
    },
    methods:{
      /*deleteImage(e) {
        e.stopPropagation();
        this.$dispatch('deleteimage',this.index);
      },*/
      clickZoomIn(e) {
//        this.$set('dialogopen',true);
        console.log("clickZoomIn");
      },
      deleteImage(){
        this.emitEvent('on-click-menu', this.index)
      }
    }
  }
</script>

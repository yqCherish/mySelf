<template>
  <div>
    <li class="weui_uploader_file2 weui_uploader_status j_image_item"  :style="{backgroundImage:'url('+item.desc+')'}" @click.stop="clickZoomIn" id="my_weui_uploader" :filename="item.val">
      <i class="weui_icon_clear2" style="position:absolute; right:-10px; top:-12px;z-index:90;" @click.stop="deleteImage"></i>
    </li>
    <imagedialog v-if="dialogopen" :imagesrc="item.desc" v-on:closesr="closesr"></imagedialog>
  </div>
</template>

<style type="text/css">
#my_weui_uploader .weui_icon_clear2:before {
    color: #f76260;
    font-size: 20px;
}

.weui_uploader_status {
  position: relative;
}
</style>

<script>
//  import vuex from 'vuex';
  import imagedialog from './imagedialog.vue';

  export default {
    props: ['fieldname','item','index','count','length','max'],
    data:function() {
        return {dialogopen:false}
    },
    components: {
        imagedialog
    },
    methods:{
      'closesr':function(msg) {
        this.dialogopen = msg;
      },
      'deleteImage':function(e) {
        this.$emit('deleteimage',this.index);
      },
      'clickZoomIn':function(e) {
        this.dialogopen = true;
      }
    },
    watch:{
    	'length':function (val, oldVal) {
    		if(val < (this.max)){
		        this.$emit('showplusaction', true);//在子组件中判断，派发给父组件中的监听方法
	        }else{
	        	this.$emit('showplusaction', false);
	        }
    	}
    }
}
</script>

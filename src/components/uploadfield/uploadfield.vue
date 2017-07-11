<template>
  <div>
	  <loading v-model="isLoading" text="上传中" v-cloak></loading>
    <div id="uploadfield2">
      <div class="weui-cells__title">
        选择图片上传（最多{{max}}张）
        <div style="float:right;">{{total}}/{{max}}</div>
      </div>
      <div class="weui-cells">
        <div class="weui-cell">
          <!--<div class="weui_cell_hd"><label class="weui_label" style="line-height: 16px;">拍照<br><span style="font-size:12px; color:#a5a5a5;">( 最多五张<br>可删除 )</span></label></div>-->
          <div class="weui_cell_bd weui_cell_primary">
            <div class="weui_cells weui_cells_form">
              <div class="weui_uploader">
                <div class="weui_uploader_bd2">
                  <ul class="weui_uploader_files2" id="j_imageitems">
                    <imageitem v-for="(item,index) in items" :index="index" :key="item.id" :item="item" v-on:deleteimage="deleteimage"  v-on:showplusaction="showplusaction" :fieldname="fieldname" :deleteimageaction="deleteimageaction" :clickzoominaction="clickzoominaction" :length="total" :max="max"></imageitem>
                    <!--<div v-for="(item,index) in items" :index="index" :deleteimageaction="deleteimageaction" :clickzoominaction="clickzoominaction">-->
                    <!--<li class="weui_uploader_file2 weui_uploader_status j_image_item" :style="{backgroundImage:'url('+item.desc+')'}" @click.stop="clickZoomIn(index)" id="my_weui_uploader" :filename="item.val">-->
                    <!--<i class="weui_icon_clear2" style="position:absolute; right:-10px; top:-12px;z-index:80;" @click.stop="deleteimage(index)"></i>-->
                    <!--</li>-->
                    <!--<imagedialog v-if="dialogopen" :imagesrc="item.desc" ></imagedialog>-->
                    <!--</div>-->
                  </ul>
                  <div class="weui_uploader_input_wrp2" id="j_weui_uploader_input_wrp2" v-show="showplus">
                    <input class="weui_uploader_input" id="j_fileupload" type="file" accept="image/*">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
	#uploadfield2 .weui_cells:before{border-top:0 !important;}
	#uploadfield2 .weui_cells:after {border-bottom:0 !important;}
</style>
<script>
//    import {pushImageAction} from 'vuex';
  import lrz from 'lrz';
    import imageitem from './imageitem.vue';
	import $ from 'jquery';
	import {Loading} from 'vux';

    export default {
        props: [
        'fieldname',
        'fieldobj',
        'queryby',
        'label',
		'max',
		'items',
		'pushimageaction',
		'deleteimageaction',
		'clickzoominaction'],
        components: {
          	imageitem,Loading
        },
        data:function() {
	        return {showplus:true,
				isLoading:false}
	        //return {showplus:"display:block",items:[]}
	    },
		methods:{
			'showplusaction':function (msg) {
//				this.$set("showplus", !!msg ? true : false);
				this.showplus = msg;
			},
			'deleteimage':function (index){
				if (index > -1) {
					this.items.splice(index, 1);
				}
			},
			'pushImageAction':function (para){
				this.$store.dispatch("pushImageAction",para);
	        },
			'clickZoomIn':function(e) {
			      	this.dialogopen =true;
			}
		},
		mounted(){
			var outThis = this;
      		$('#j_fileupload').unbind('change').bind('change', function () {
				outThis.isLoading = true;
	      		lrz(this.files[0]).then(function (rst) {

	      			// 生成三位随机数
		      		var rand = "";
					for(var i = 0; i < 3; i++){
					    var r = Math.floor(Math.random() * 10);
					    rand += r;
					}
		            // 处理成功会执行
		            var wholename = rst.origin.name;
                	var prefix = wholename.substring(0, wholename.indexOf("."));
                	var suffix = wholename.substring(wholename.indexOf("."));
                	var filename = prefix + Date.parse(new Date()) + rand + suffix;//文件名加时间戳+三位随机数为了避免IOS上文件名被处理成完全一样
					let para = {
						0: outThis.fieldname,
						1: {'val':filename, 'desc':rst.base64},
						2:'val'
					};
					outThis.pushImageAction( para);
		            //outThis.items.push({'val':filename, 'desc':rst.base64});
		        }).catch(function (err){
		            // 处理失败会执行
		        }).always(function () {
		            // 不管是成功失败，都会执行
					outThis.isLoading = false;
		            $("#j_image_loading").css("display","none");//隐藏加载样式
		        });
	        });
	    },
        computed:{
          	total(){
            	return this.items.length
          	}
        }
    }
</script>
<style>
  [v-cloak]{
    z-index:5000;
  }
</style>

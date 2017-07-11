<template>
    <div class="weui_dialog_alert dialog-demo">
        <div class="weui_mask2 vux-fade-transition">
        	<div class="weui_dialog vux-dialog-transition" style="padding:0;line-height:0;overflow:hidden;border-radius: 0;background: none;">
				<div class="content-box" style="height: auto;padding: 0;border: 0;">
                    <div id="loadingToast" class="weui_loading_toast" v-if="showloading">
                        <div class="weui_mask_transparent" style="background: rgba(255,255,255,.1);"></div>
                        <div class="weui_toast">
                            <div class="weui_loading">
                                <div class="weui_loading_leaf weui_loading_leaf_0"></div>
                                <div class="weui_loading_leaf weui_loading_leaf_1"></div>
                                <div class="weui_loading_leaf weui_loading_leaf_2"></div>
                                <div class="weui_loading_leaf weui_loading_leaf_3"></div>
                                <div class="weui_loading_leaf weui_loading_leaf_4"></div>
                                <div class="weui_loading_leaf weui_loading_leaf_5"></div>
                                <div class="weui_loading_leaf weui_loading_leaf_6"></div>
                                <div class="weui_loading_leaf weui_loading_leaf_7"></div>
                                <div class="weui_loading_leaf weui_loading_leaf_8"></div>
                                <div class="weui_loading_leaf weui_loading_leaf_9"></div>
                                <div class="weui_loading_leaf weui_loading_leaf_10"></div>
                                <div class="weui_loading_leaf weui_loading_leaf_11"></div>
                            </div>
                            <p class="weui_toast_content">数据加载中</p>
                        </div>
                    </div>
				  <img width="100%" v-if="imagesrc"  :src="imagesrc" @click="doclosesr" v-show="showpic"  style="float:left;"  id="ximgage" />
				</div>
			</div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted(){
        	 var self = this;
             document.getElementById("ximgage").onload = function () {
			      self.showimg();
			 }
        },
        props: ['imagesrc'],
        data () {
            return {
                showloading:true,
                showpic:false
            }
        },
        methods:{
            'doclosesr':function(){
                this.$emit('closesr', false);
            },
            'showimg':function(){
                this.showloading =false ;
                this.showpic =true ;
            }
        }
    }
</script>

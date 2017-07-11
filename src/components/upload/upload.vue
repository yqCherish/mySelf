<template>
  <div>
    <div class="weui-uploader__bd outer_padding">
      <ul class="weui-uploader__files" id="uploaderFiles">
        <uploaditem v-for="(item,index) in items" :index="index" :key="item" :item="item" :fieldname="fieldname" :length="total" :max="max"  @on-click-menu="delItem"></uploaditem>
      </ul>
      <div v-if="add_show" class="weui-uploader__input-box">
        <!--accept用*在google上会表现的非常的慢-->
        <input class="weui-uploader__input" :id="typefieldid" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
      </div>
    </div>
  </div>
</template>

<script>
  import lrz from 'lrz';
  import uploaditem from './uploaditem.vue';
  export default{
    props: [
      'fieldname',
      'typefieldid',
      'max',
      'items',
    ],
      data(){
        return{
          add_show:true
        }
      },
      components:{
        uploaditem
      },
      computed:{
        total(){
          return this.items.length
        }
      },
      mounted(){
        let self = this;
        document.querySelector('#'+this.typefieldid).addEventListener('change', function () {
          if (this.files.length === 0) return;    //解决PC端点击取消的报错现象
          lrz(this.files[0])
            .then(function (rst) {
              console.log(rst);
              // 处理成功会执行
              self.items.push({'val':self.fieldname,'desc':rst.base64});
              console.log(self.items.length);
              if(self.items.length>=self.max){
                self.add_show=false;
              }
            })
            .catch(function (err) {
              // 处理失败会执行
              console.log(err);
            })
            .always(function () {
              // 不管是成功失败，都会执行
            });
        });
      },
      methods:{
        delItem(index){
            console.log(index);
        }
      }
  }
</script>

<style scoped>
  .outer_padding{
    padding:10px;
  }
</style>

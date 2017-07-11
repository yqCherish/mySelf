<template>
  <div>下午来测试上传组件12
    <div>
      <x-upload
        fieldname="picurls"
        :items="picurls"
        typefieldid="j_images"
        :max="2">
      </x-upload>
    </div>
  </div>

</template>

<script>
  import XUpload from '../../components/upload/upload.vue'

  export default{
      data(){
          return{
              picurls:[],
          }
      },
      components:{
          XUpload
      }
  }
</script>

<style scoped>

</style>

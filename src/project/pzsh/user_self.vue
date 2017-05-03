<template>
  <div>
    <group>
      <div @click="showActionsheet">{{current}}</div>
    </group>
    <actionsheet v-model="show1" :menus="menus1" @on-click-menu="click"></actionsheet>
  </div>
</template>

<script>
  import {Actionsheet, Group, XSwitch,Selector} from 'vux'
  export default {
    components: {
      Actionsheet,
      Group,
      XSwitch,
      Selector
    },
    data () {
      return {
        show1: false,
        menus1: {
          menu1: 'Share to friends',
          menu2: 'Share to timeline'
        },
        current:'Share to friends'
      }
    },
    methods: {
      showActionsheet () {
        this.show1=true;
      },
      click(key){
          console.log(key);
          console.log(this.menus1);
          for(let i in this.menus1){
            if(i===key){        //item 表示Json串中的属性，如'name'
              let jValue=this.menus1[i];//key所对应的value
              this.current=jValue;
            }
          }
      },
    },
  }
</script>

<style>

</style>

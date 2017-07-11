<template>
  <msg :title="data.this_title" :description="data.desc" :buttons="data.buttons" :icon="data.icon"></msg>
</template>

<script>
  import {Msg} from 'vux'
  export default{
      data(){
          return{
              data:{},
            route_type:0,
            atype:"",
            type:""  //1保洁 2微装
          }
      },
      mounted(){
        let route_type = parseInt(this.$route.query.route_type);
        document.getElementById("index_loading").style.display="none";
        console.log(route_type);
        let atype = parseInt(this.$route.query.atype);
        //预订成功页面
        switch(route_type){
          case 1:
            this.data={
              desc:"预约成功，您可以选择进入下列页面",
              this_title:"预订成功",
              icon:"",
              buttons: [{
                type: 'primary',
                text: '会所首页',
                onClick: this.goIndex.bind(this)
              },{
                type: 'default',
                text: '订单列表',
                onClick: this.goList.bind(this)
              }]
            };
            break;
          //门禁注册成功页面
          case 2:
            if(atype===0){
              this.data={
                desc:"注册成功，您可以进行下列操作",
                this_title:"注册成功",
                icon:"",
                buttons: [{
                  type: 'primary',
                  text: '扫码开门',
                  onClick: this.go_smkm.bind(this)
                },{
                  type: 'default',
                  text: '访客邀请',
                  onClick: this.go_fkyq.bind(this)
                }, {
                  type: 'default',
                  text: '钥匙管理',
                  onClick: this.go_ysgl.bind(this)
                }]
              };
            }
            break;
          case 3:
            this.data={
              desc:"您没有权限访问该页面",
              this_title:"访问失败",
              icon:"warn",
            };
            break;
          case 4:
            this.data={
              desc:"您的苹果手机当前版本可能过低，请升级",
              this_title:"访问失败",
              icon:"warn",
            };
            break;
            //会所扫码成功
          case 5:
            this.data={
              desc:"扫码入场成功，您可以进行下列操作",
              this_title:"扫码成功",
              icon:"",
              buttons: [{
                type: 'primary',
                text: '会所首页',
                onClick: this.goIndex.bind(this)
              },{
                type: 'default',
                text: '订单列表',
                onClick: this.goList.bind(this)
              }]
            };
            break;
          case 6:
            this.data={
              desc:"订单取消成功，您可以前往下列页面",
              this_title:"操作成功",
              icon:"",
              buttons: [{
                type: 'primary',
                text: '会所首页',
                onClick: this.goIndex.bind(this)
              },{
                type: 'default',
                text: '订单列表',
                onClick: this.goList.bind(this)
              }]
            };
            break;
          case 7:
            this.data={
              desc:"订单评价成功，您可以前往下列页面",
              this_title:"操作成功",
              icon:"",
              buttons: [{
                type: 'primary',
                text: '会所首页',
                onClick: this.goIndex.bind(this)
              },{
                type: 'default',
                text: '订单列表',
                onClick: this.goList.bind(this)
              }]
            };
            break;
          case 8:
            this.data={
              desc:"扫码离场成功，您可以进行下列操作",
              this_title:"扫码成功",
              icon:"",
              buttons: [{
                type: 'primary',
                text: '会所首页',
                onClick: this.goIndex.bind(this)
              },{
                type: 'default',
                text: '订单列表',
                onClick: this.goList.bind(this)
              }]
            };
            break;
          case 9:
            this.type = parseInt(this.$route.query.type);
            let type_name = this.type===1?"保洁":"微装";
            this.data={
              desc:"服务预约成功，您可以进行进入下列页面继续操作",
              this_title:"预订成功",
              icon:"",
              buttons: [{
                type: 'primary',
                text: type_name+'首页',
                onClick: this.go_wb_Index.bind(this)
              },{
                type: 'default',
                text: '订单列表',
                onClick: this.go_wb_list.bind(this)
              }]
            };
            break;
          case 10:
            this.type = parseInt(this.$route.query.type);
            let type_name2 = this.type===1?"保洁":"微装";
            this.data={
              desc:"服务取消预订成功，您可以进行进入下列页面继续操作",
              this_title:"取消预订成功",
              icon:"",
              buttons: [{
                type: 'primary',
                text: type_name2+'首页',
                onClick: this.go_wb_Index.bind(this)
              },{
                type: 'default',
                text: '订单列表',
                onClick: this.go_wb_list.bind(this)
              }]
            };
            break;
          case 11:
            this.type = parseInt(this.$route.query.type);
            let type_name3 = this.type===1?"保洁":"微装";
            this.data={
              desc:"服务评价，您可以进行进入下列页面继续操作",
              this_title:"评价成功",
              icon:"",
              buttons: [{
                type: 'primary',
                text: type_name3+'首页',
                onClick: this.go_wb_Index.bind(this)
              },{
                type: 'default',
                text: '订单列表',
                onClick: this.go_wb_list.bind(this)
              }]
            };
            break;
          case 12:
            this.data={
              desc:"商品发布成功，正在审核中，您可以进行如下操作",
              this_title:"发布成功",
              icon:"",
              buttons: [{
                type: 'primary',
                text: '跳蚤市场首页',
                onClick: this.go_tzsc_index.bind(this)
              },{
                type: 'default',
                text: '我的发布',
                onClick: this.go_tzsc_list.bind(this)
              }]
            };
            break;
        }
      },
      components:{
        Msg
      },
      methods:{
        goIndex(){
          this.$router.push({path: 'area_index'});
        },
        goList(){
          this.$router.push({path: '/common_order/0'});
        },
        go_smkm(){
          this.$router.push({path: 'my_code',query:{route_type:0}});
        },
        go_fkyq(){
          this.$router.push({path: 'invite_guest',query:{route_type:0}});
        },
        go_ysgl(){
          this.$router.push({path: 'key_manage',query:{route_type:0}});
        },
        go_wb_Index(){
            if(this.type===1){
              this.$router.push({path: 'wz_bj',query:{route_type:1}});
            }else{
              this.$router.push({path: 'wz_bj',query:{route_type:2}});
            }
//          this.$router.push({path: 'wz_bj'});
        },
        go_wb_list(){
            if(this.type===1){
              this.$router.push({path: '/common_order/2'});
            }else{
              this.$router.push({path: '/common_order/1'});
            }
        },
        go_tzsc_index(){
          this.$router.push({path: 'market_index'});
        },
        go_tzsc_list(){
          this.$router.push({path: 'my_published'});
        }
      }
  }
</script>

<style scoped>

</style>

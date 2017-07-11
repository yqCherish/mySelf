<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center;"></loading>-->
    <div>
      <group v-for="items in paylist" :key="items" :title="items.title">
        <cell v-for="item in items.arr" :title="item.name" :key="item"  :inline-desc='item.date'>
          <div slot="value">
            <span style="color: black;">{{item.price}}元</span>
          </div>
        </cell>
      </group>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{content}}</alert>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {Group,Cell,Alert} from 'vux';

  export default{
    data(){
      return{
        loading:true,
        paylist:[],
        confirm_show:false,
        dialog_title:"",
        content:""
      }
    },
    components:{
      loading,Group,Cell,Alert
    },
    mounted(){
      let self = this;
      if(service_url){
        this.$http.get(service_url+"/o2o/assetsv2/wx/wallet_record.do").then((data)=>{
            if(data.body.status===0){
              let _arr=data.body.data;
              this.splitByMonth(_arr);
            }else{
              this.dialog_title="提示";
              this.content=data.body.data.error_reason;
              this.confirm_show=true;
            }
        })
      }else{
          this.$http.get("/api/wallet_record").then((data)=>{
            let _arr=data.body.data.data;
            this.splitByMonth(_arr);
          })
      }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      splitByMonth(_arr){
        let list = [];
        let j=-1;
        let has_list=[];
        let new_arr=[];
//        let new_obj={};
        for(let i = 0;i<_arr.length;i++){
          let this_date = _arr[i].date.split("/");
          let this_num = this_date[0]+"年"+this_date[1]+"月";
          if(has_list.indexOf(this_num) === -1){
              var new_obj={};
              new_obj.title=this_num;
              j++;
              has_list.push(this_num);
              new_arr=[];
              new_arr.push(_arr[i]);
              new_obj.arr=new_arr;
              list[j]=new_obj;
          }else{
              new_arr.push(_arr[i]);
              new_obj.arr=new_arr;
              list[j]=new_obj;
          }
        }
        this.paylist=list;
      }
    }
  }
</script>

<style scoped>

</style>

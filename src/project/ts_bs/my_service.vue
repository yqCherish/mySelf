<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <load-more v-if="mysrlists.length===0" :show-loading="false" tip="您还有没有服务数据呢" background-color="#efeff4"></load-more>
    <Scroller style="margin-top:-44.8px;" :on-refresh="onRefresh" :on-infinite="onInfinite">
      <div>
        <group gutter="10px" v-for="item in mysrlists" key="item">
          <cell>
            <div slot="icon">{{"【"+item.type.desc+"】"}}<span style="color:#999;">{{item.createtime.val}}</span></div>
            <div slot="value">
              <span style="color: #ad7de7">{{item.servicehistory.desc}}</span>
            </div>
          </cell>
          <cell-box>
            <div style="color:#484848">
              {{item.detaildesc.desc}}
            </div>
          </cell-box>
          <cell>
            <x-button mini plain type="primary" class="custom-primary-blue" @click.native="goDetail(item.srid.val,item.servicehistory.val,item.type.val)">查看详细</x-button>
          </cell>
        </group>
      </div>
    </Scroller>
  </div>
</template>

<script>
  import Loading from '@/components/loading/dataLoading'
  import Scroller from '@/components/scroller_me/scroller';
  import {Cell,CellBox,Group,XButton,LoadMore} from 'vux';
  import {setTitle} from '@/common/js/common';

  export default{
      data(){
          return {
            loading: true,
            mysrlists: [],
            nextdata:""
          }
      },
      components:{
          Cell,CellBox,Group,Loading,XButton,LoadMore,Scroller
      },
      mounted(){
        setTitle("我的服务");
        let self = this;
        if(service_url){
          this.$http.get(service_url+"/o2o/common/service/mylist?nextdata=&vid="+userProfile.vid+"&openid="+userProfile.openid).then((data)=>{
            self.mysrlists=data.body.data;
          },()=>{
            console.log("请求失败");
          });
        }else{
          this.$http.get("/api/my_service").then((data)=>{
            self.mysrlists=data.body.data.data;
          })
        }
        document.getElementById("index_loading").style.display="none";
      },
      methods:{
        goDetail(srid,xstate,otype){
          this.$router.push({path:"service_detail",query:{"tab":"dt","srid":srid,"xstate":xstate,"type":otype}});
        },
        goEvaluate(srid,xstate,otype){
          this.$router.push({path:"service_detail",query:{"tab":"pj","srid":srid,"xstate":xstate,"type":otype}});
        },
        onRefresh(done){
          console.log("onRefresh")
          done() // call done
        },
        onInfinite(){
          if(!this.nextdata){
            this.$el.querySelector('.load-more').style.display = 'none';
            return;
          }else{
            this.$http.get(service_url+"/o2o/common/service/mylist?nextdata="+this.nextdata+"&vid="+userProfile.vid+"&openid="+userProfile.openid).then((data)=>{
              this.nextdata=data.body.nextdata;
              /*let noticelists = data.body.items;
               for(let i =0;i<noticelists.length;i++){
               this.noticelists.push(noticelists[i]);
               }*/
              this.mysrlists = data.body.data;
              done();
            });
          }
        }
      }
  }
</script>

<style scoped>
  .custom-primary-blue {
    border-color: #ad7de7 !important;
    color: #ad7de7 !important;
  }
  .custom-primary-blue:active {
    border-color: #bdaecf !important;
    color: #bdaecf !important;
    background-color: transparent;
  }
</style>

<template>
  <div>
    <div style="padding:15px;">
      <h4 style="text-align: center;margin-bottom:15px;">{{title.val}}</h4>
      <div><img style="width:100%;height:100%;" :src="picurl.val"/></div>
      <div style="font-size:14px;;margin-bottom:5px;margin-top:10px;"><pre>{{content.val}}</pre></div>
      <!--<div style="overflow: hidden;color:#999;font-size:12px"><span>{{createby.desc}}</span><span style="margin-left:5px;">{{startdate.val}}</span></div>-->

      <div v-if="isenroll==='2'&&isnotice!=='1'" style="margin:20px 0 10px"><x-button class="zj_button" type="primary" @click.native="gonext">报名</x-button></div>
      <div v-if="isenroll==='1'" style="margin:20px 0 10px"><x-button type="primary" class="zj_button" @click.native="gonext">编辑</x-button></div>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
  </div>
</template>

<script>
  import Loading from '@/components/loading/dataLoading'
  import {setTitle} from '@/common/js/common';
  import {XButton,Alert} from 'vux';
  export default{
      data(){
          return{
            loading:true,
            title:{},
            createby:{},
            startdate:{},
            content:{},
            isnotice:'0',
            isenroll:-1,
            noticeid:0,
            picurl:[],
            confirm_show:false,
            dialog_title:"",
            confirm_content:"",
          }
      },
    components:{
      XButton,Loading,Alert
    },
    mounted(){
      setTitle("公告详情");
      let self = this;
      this.noticeid=this.$route.query.notice_id;
      if(service_url){
        this.$http.get(service_url+"/o2o/notice/wx/detail?noticeid="+this.noticeid+"&vid="+userProfile.vid).then((data) => {
          if(data.body.status==="ok"){
            self.title=data.body.data.title;
            self.isenroll=data.body.data.isenroll.val;
            self.content=data.body.data.content;
            self.createby=data.body.data.createby;
            self.isnotice=data.body.data.isnotice.val;
            self.picurl=data.body.data.picurl;
            let startdate = parseInt(data.body.data.startdate.val);
            let startDate = new Date(startdate);
            self.startdate.val=self.alTimeFormat2(startDate,'4');
          }else{
            this.dialog_title="提示";
            this.confirm_content=data.body.msg;
            this.confirm_show=true;
          }
        },()=>{
          console.log("访问失败");
        });
      }else{
        this.$http.get("/api/notice_detail").then((data)=>{
          self.title=data.body.data.data.title;
          self.isenroll=data.body.data.data.isenroll.val;
          self.content=data.body.data.data.content;
          /*if(self.content.val.length>200){
            self.content.val=self.content.val.substring(0,200)+"...";
          }*/
          self.isnotice=data.body.data.data.isnotice.val;
          self.createby=data.body.data.data.createby;
          self.picurl=data.body.data.data.picurl;
          let startdate = parseInt(data.body.data.data.startdate.val);
          let startDate = new Date(startdate);
          self.startdate.val=self.alTimeFormat2(startDate,'4');
        })
      }
      document.getElementById("index_loading").style.display="none";
    },
    methods:{
      gonext(){
          /* isenroll是1对应type=1是编辑 inenroll是2对应type=2是报名*/
          if(this.isenroll==='1'){
            this.$router.push({path:'enroll',query:{"noticeid":this.noticeid,type:1}})
          }else{
            this.$router.push({path:'enroll',query:{"noticeid":this.noticeid,type:2}})
          }
      },
      alTimeFormat2 (dateObj, type) {
        if (Object.prototype.toString.call(dateObj) == '[object Date]') {
          if (isNaN(dateObj.getTime())) {
            return '';
          } else {
            const
              year = dateObj.getFullYear(),
              month = dateObj.getMonth() + 1 < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1,
              day = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate(),
              hour = dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours(),
              minute = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes(),
              second = dateObj.getSeconds() < 10 ? '0' + dateObj.getSeconds() : dateObj.getSeconds();

            if (type == '1' ) {   //leave
              return year + '-' + month + '-' + day + '  ' + hour + ':00';
            } else if (type == '2') { //overtime
              return year + '-' + month + '-' + day + '  ' + hour + ':00';
            } else if (type == '3') { //shift
              return year + '-' + month + '-' + day;
            } else if ( type == '4') {//notice
              return year + '-' + month + '-' + day + '  ' + hour + ':' + minute;
            }
          }
        } else {
          return '';
        }
      }
    }
  }
</script>

<style scoped>

</style>

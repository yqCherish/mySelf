<template>
  <div class="body_background">
    <!--<loading style="text-align: center;" v-if="loading"></loading>-->
    <div>
      <div class="padding_bottom">
        <Swiper :list="goods_img" :index="swiper_index" @on-index-change="swiperChange" height="300px"></Swiper>
        <div class="describe body_white">
          <p class="font_name">{{goods_name}}</p>
          <div class="overflow_hidden"><p class="font_price">￥{{price}}</p><p class="font_sale">{{degree}}新</p></div>
          <div class="overflow_hidden"><p class="font_time">{{this_time}}</p><p class="font_sale">已有{{has_watch}}人浏览</p></div>
        </div>
        <group gutter="10px">
          <cell title="详细描述"></cell>
          <cell-box>
            <p style="font-size:15px;font-weight:normal;">{{goods_content}}</p>
          </cell-box>
        </group>
        <group gutter="10px">
          <cell title="评论留言"></cell>
          <div class="pj_detail" v-for="item in evaluate">
            <div class="f_flex" style="font-size:13px;">
              <div class="pj_img_div">
                <img :src="item.photourl"/>
              </div>
              <div class="flex_1">
                <div><p class="pj_name text_ellipsis">{{item.tname}}</p><span style="float:right;color:#999;">{{item.eva_time}}</span></div>
                <div style="font-size:15px;">{{item.content}}</div>
              </div>
            </div>
          </div>
        </group>
        <div v-transfer-dom>
          <popup v-model="popup_model" position="bottom" style="background-color:white">
            <x-textarea style="font-size:14px;" :max="50" name="description" placeholder="请输入留言" v-model="this_comment"></x-textarea>
            <div style="margin:20px 10px 10px"><x-button class="zj_button" type="primary" @click.native="editMarket">保存</x-button></div>
          </popup>
        </div>
      </div>
      <div class="fixed_bottom">
        <div class="weui_flex" style="padding:0;text-align:center;height:44px;">
          <a v-if="state===0" style="flex:2;border-right:1px solid #ececec;" @click="thumbs_up"><div style="height: 22px"><img style="height: 25px" src="./点赞.png"/></div><p style="font-size:12px">{{praisecount}}</p></a>
          <a v-else style="flex:2;border-right:1px solid #ececec;" @click="thumbs_up"><div style="height: 22px"><img style="height: 25px" src="./点赞2.png"/></div><p style="font-size:12px">{{praisecount}}</p></a>
          <a :href="'tel:'+tel" class="cz_button" style="flex:4;background-color:#f06600;color:white">拨打电话</a>
          <a @click="showActionsheet()" class="cz_button" style="flex:4;background-color:#e9582a;color:white">评论</a>
        </div>
      </div>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
  </div>
</template>

<script>
  import Loading from '@/components/loading/dataLoading'
  import {setTitle} from '@/common/js/common';
  import { Group, Cell,Popup, CellBox,Swiper,TransferDom ,XTextarea,XButton,Alert} from 'vux'

  export default{
      data(){
        return{
          goods_img:[],
          swiper_index:0,
          goods_name:'',
          price:'',
          degree:'',
          this_time:'',
          has_watch:'',
          goods_content:'',
          tel:'',
          evaluate:[],
          popup_model:false,
          goods_id:'',
          praisecount:0,
          state:0,
          this_comment:"",
          confirm_show:false,
          dialog_title:"",
          confirm_content:""
        }
      },
      directives: {
        TransferDom
      },
      components:{
        Group,
        Cell,
        CellBox,
        Popup,
        Swiper,
        XTextarea,
        XButton,
        Alert
      },
      mounted(){
        setTitle("商品详情");
        this.getlist();
      },
      methods:{
        getlist(){
            let self = this;
            this.goods_id=this.$route.query.id;
            if(service_url){
              const senddata={
                "goods_id":this.goods_id
              };
              this.$http.post(service_url+'/o2o/flea/wx/fleaDetails',senddata).then( (data)=> {
                console.log(data);
                if(data.body.result.status===0) {
                  self.goods_name = data.body.result.data.name;
                  self.price = data.body.result.data.price;
                  self.state = data.body.result.data.islike;
                  self.degree = data.body.result.data.quality;
                  self.this_time = data.body.result.data.creteatime;
                  self.has_watch = data.body.result.data.viewcount;
                  self.goods_content = data.body.result.data.desc;
                  self.tel = data.body.result.data.tel;
                  self.evaluate = data.body.result.data.evaluate;
                  for(let j = 0;j<self.evaluate.length;j++){
                    self.evaluate[j].eva_time = self.getLocalTime(self.evaluate[j].wtime);
                  }
                  let imgs = data.body.result.data.goods_img;
                  self.praisecount = data.body.result.data.praisecount;
                  let swiper_img = [];
                  for (let i = 0; i < imgs.length; i++) {
                    swiper_img.push({
                      "img": imgs[i]
                    });
                  }
                  self.goods_img = swiper_img;
                }else{
                  this.dialog_title="提示";
                  this.confirm_content=data.body.result.error_reason;
                  this.confirm_show=true;
                }
              })
            }else{
              this.$http.get('/api/marketDetail').then((data) => {
                self.goods_name = data.body.data.data.name;
                self.price = data.body.data.data.price;
                self.degree = data.body.data.data.degree;
                self.this_time = data.body.data.data.time;
                self.has_watch = data.body.data.data.has_watch;
                self.goods_content = data.body.data.data.goods_content;
                self.tel = data.body.data.data.tel;
                self.evaluate = data.body.data.data.evaluate;
                let imgs = data.body.data.data.goods_img;
                let swiper_img=[];
                for(let i=0;i<imgs.length;i++){
                  swiper_img.push({
                    "img":imgs[i]
                  });
                }
                self.goods_img=swiper_img;
              }, () => {
                console.log(2);
              });
            }
          },
        swiperChange(index){
          this.swiper_index = index
        },
        showActionsheet(){
          this.popup_model = true;
        },
        thumbs_up(){
            let self =this;
          const senddata={
            "goods_id":this.goods_id
          };
          this.$http.post(service_url+'/o2o/flea/wx/like',senddata).then( (data)=> {
            if(data.body.result.status===0) {
              this.dialog_title="提示";
              this.confirm_content=data.body.result.data;
              this.confirm_show=true;
              if(data.body.result.data==="点赞成功"){
                this.state=1;
                self.praisecount++;
              }else {
                this.state=0;
                self.praisecount--;
              }

            }else{
              this.dialog_title="提示";
              this.confirm_content=data.body.result.error_reason;
              this.confirm_show=true;
            }
          })
        },
        editMarket(){
            if(this.this_comment===""||this.this_comment.trim()===""){
              this.dialog_title="提示";
              this.confirm_content="请输入评价内容";
              this.confirm_show=true;
              return;
            }
            let self = this;
          const senddata={
            "goods_id":this.goods_id,
            "eva_content":this.this_comment
          };
          this.$http.post(service_url+'/o2o/flea/wx/comment',senddata).then( (data)=> {
            if(data.body.result.status===0) {
              this.dialog_title="提示";
              this.confirm_content="评论成功";
              this.confirm_show=true;
              self.praisecount++;
              self.popup_model=false;
              self.getlist();
            }else{
              this.dialog_title="提示";
              this.confirm_content=data.body.result.error_reason;
              this.confirm_show=true;
            }
          })
        },
        getLocalTime(nS) {
          return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        },
      }
  }
</script>

<style scoped>
  .body_background {
    background-color: #efeff4;
  }
  .body_white {
    background-color: white;
  }
  .describe {
    padding: 10px 20px;
  }
  .font_name {
    font-size: 15px;
  }
  .overflow_hidden{
    overflow: hidden;
  }
  .font_price{
    font-size: 18px;
    color: #f81706;
    float:left;
  }
  .font_time{
    font-size: 13px;
    color: #999;
    float:left;
  }
  .font_sale{
    font-size: 13px;
    color: #999;
    float:right;
  }
  .f_flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .pj_img_div {
    width: 45px;
    height: 45px;
    margin-right: 1rem;
  }
  .pj_img_div img {
    border-radius: 50%;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  .pj_name {
    display: inline-block;
    width: 130px;
    line-height:15px;
    font-size:15px;
  }
  .text_ellipsis {
    text-overflow: ellipsis; /*文字隐藏后添加省略号*/
    white-space: nowrap; /*强制不换行*/
    overflow: hidden; /*自动隐藏文字*/
  }
  .flex_1 {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .fixed_bottom{
    z-index:100;
    position:fixed;
    bottom:0;
    left:0;
    right:0;
  }
  .fixed_bottom .weui_flex{
    padding-left: .8rem;
    border-top: 1px solid #ececec;
  }
  .weui_flex{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    outline: 0;
    -webkit-align-items: center;
    align-items: center;
  }
  .cz_button{
    line-height:44px;
  }
  .padding_bottom{
    padding-bottom:44px;
  }
  .pj_detail {
    border-top: 1px solid #e5e5e5;
    padding: 10px 10px 10px 0;
    margin-left:15px;
  }
</style>

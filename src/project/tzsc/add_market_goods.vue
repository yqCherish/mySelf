<template>
  <div>
    <!--<loading style="text-align: center;" v-if="loading"></loading>-->
    <loading v-model="isLoading" text="保存中"></loading>
    <div>
      <group v-if="enter_type===1" title="填写基本信息">
        <x-input labelWidth="6em" title="商品名称" placeholder="请输入商品名称" v-model="goods_name"></x-input>
        <cell labelWidth="6em" valueAlign="left" title="商品成色" v-model="goods_degree" @click.native="showDegree"></cell>
        <cell labelWidth="6em" valueAlign="left" title="商品分类" v-model="goods_rack" @click.native="showRack"></cell>
        <x-input labelWidth="6em" title="商品价格(元)" placeholder="请输入商品价格" keyboard="china-name" v-model="goods_price"></x-input>
        <x-textarea  title="详细描述" placeholder="请输入" :show-counter="false" :rows="3" v-model="goods_desc"
                    autosize></x-textarea>
        <x-input labelWidth="6em" title="联系人" placeholder="请输入联系人" keyboard="china-name" v-model="user_name"></x-input>
        <x-input title="联系电话" labelWidth="6em" placeholder="请输入联系电话" keyboard="number" v-model="user_tel"></x-input>
      </group>
      <group title="基本信息" v-else>
        <cell labelWidth="6em" valueAlign="left" title="商品名称" v-model="goods_name"></cell>
        <cell labelWidth="6em" valueAlign="left" title="商品成色" v-model="goods_degree"></cell>
        <cell labelWidth="6em" valueAlign="left" title="商品分类" v-model="goods_rack"></cell>
        <cell labelWidth="6em" valueAlign="left" title="商品价格" v-model="goods_price"></cell>
        <x-textarea title="详细描述" placeholder="请输入" :show-counter="false" :rows="3" v-model="goods_desc" readonly
                    autosize></x-textarea>
        <cell labelWidth="6em" valueAlign="left" title="联系人" v-model="user_name"></cell>
        <cell labelWidth="6em" valueAlign="left" title="联系电话" v-model="user_tel"></cell>
      </group>
      <!--<group title="上传照片（最多可上传4张）">-->
      <!--<x-upload-->
      <!--fieldname=".png"-->
      <!--:items="goods_img"-->
      <!--typefieldid="j_images"-->
      <!--:max="4">-->
      <!--</x-upload>-->
      <!--</group>-->
      <uploadfield v-if="enter_type===1"
                   fieldname="picurls"
                   :fieldobj="picurls"
                   :items="picurls"
                   typefieldid="j_images"
                   queryby="val"
                   :max="4">
      </uploadfield>
      <group v-else title="商品图片">
        <div style="padding:10px 15px 5px ;">
          <img style="width:80px;height:80px;margin:0 5px 5px 0" class="previewer-demo-img" v-for="(item, index) in pic_list" :src="item.src" width="100" @click="show(index)">
          <previewer :list="pic_list" ref="previewer" :options="options"></previewer>
        </div>
      </group>
      <div v-if="enter_type===1" style="margin:20px 10px 10px">
        <x-button class="zj_button" type="primary" @click.native="addMarket">发布</x-button>
      </div>
      <div v-else style="margin:20px 10px 10px">
        <x-button type="primary" class="zj_button" @click.native="editMarket">保存</x-button>
      </div>
      <actionsheet v-model="show_rack" :menus="rack" @on-click-menu="click_rack"></actionsheet>
      <actionsheet v-model="show_degree" :menus="degree_arr" @on-click-menu="click_degree"></actionsheet>
    </div>
    <alert v-model="confirm_show" :title="dialog_title"> {{confirm_content}}</alert>
    <loading v-model="isLoading" text="保存中"></loading>
    <toast v-model="show_toast">{{toast_text}}</toast>
  </div>
</template>

<script>
  import uploadfield from '../../components/uploadfield/uploadfield.vue';
  import {Cell, Group, XInput, XButton, XTextarea, Actionsheet, Loading, Alert, Previewer,Toast} from 'vux'
  import {setTitle} from '@/common/js/common';
  import {mapState} from 'vuex'

  export default{
    data(){
      return {
        show_rack: false,
        type: 0,
        rack: [],
        goods_name: '',
        goods_degree: '请选择成色',
        goods_rack: '请选择分类',
        goods_price: '',
        user_name: '',
        user_tel: '',
        goods_desc: '',
        labelWidth: '6em',
        enter_type: 0,
        rack_key: 0,
        goods_id: [],
        show_degree: false,
        degree_arr: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        isLoading: false,
        confirm_show: false,
        dialog_title: "提示",
        confirm_content: "",
        pic_list:[],
        show_toast:false,
        toast_text:[],
        options: {
          getThumbBoundsFn (index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        },
      }
    },
    components: {
      Cell, Group, XInput, XButton, XTextarea, uploadfield, Actionsheet, Loading, Alert, Previewer,Toast
    },
    computed: {
      ...mapState({
        picurls: state => state.picurls,
      })
    },
    mounted(){
      this.enter_type = parseInt(this.$route.query.enter_type);
//        this.enter_type===1?setTitle("发布商品"):setTitle("编辑商品");
      let self = this;
      if (this.enter_type === 1) {
        setTitle("发布商品");
        if (service_url) {
          this.$http.get(service_url + '/o2o/flea/wx/getInformation').then((data) => {
            if (data.body.result.status === 0) {
              let arr_rack = data.body.result.data.rack;
              let json_rack = {};
              for (let j = 0; j < arr_rack.length; j++) {
                json_rack[arr_rack[j].key] = arr_rack[j].value
              }
              self.rack = json_rack;
//                self.rack = data.body.result.data.rack;
              self.user_name = data.body.result.data.user_name;
              self.user_tel = data.body.result.data.user_tel;
            } else {
              this.confirm_content = data.body.result.error_reason;
              this.confirm_show = true;
            }
          })
        } else {
          this.$http.get('/api/published_detail').then((data) => {
            self.rack = data.body.data.data.rack;
            self.user_name = data.body.data.data.user_name;
            self.user_tel = data.body.data.data.user_tel;
          }, () => {
            console.log(2);
          });
        }
      } else {
        setTitle("编辑商品");
        if (service_url) {
          this.goods_id = this.$route.query.goods_id;
          const senddata = {
            goods_id: this.goods_id
          };
          this.$http.post(service_url + '/o2o/flea/wx/releaseDetails', senddata).then((data) => {
            console.log(data);
            if (data.body.result.status === 0) {
              let cid = data.body.result.data.cid;
              let arr_rack = data.body.result.data.sort;
              let json_rack = {};
              for (let j = 0; j < arr_rack.length; j++) {
                if (cid === arr_rack[j].key) {
                  self.goods_rack = arr_rack[j].value;
                }
                json_rack[arr_rack[j].key] = arr_rack[j].value
              }
              self.rack = json_rack;
              //                self.rack = data.body.result.data.rack;
//                 self.user_name = data.body.result.data.user_name;
//                 self.user_tel = data.body.result.data.user_tel;
//                self.rack = data.body.result.data.rack;
              self.user_name = data.body.result.data.tname;
              self.user_tel = data.body.result.data.tel;
              self.goods_name = data.body.result.data.name;
              self.goods_degree = data.body.result.data.quality;
//                self.goods_rack = data.body.result.data.goods_rack;
              self.goods_price = data.body.result.data.price;
              self.goods_desc = data.body.result.data.desc;
              self.goods_img = data.body.result.data.goods_img;

              let picurls=data.body.result.data.goods_img;
              let _arr_pic=[];
              for(let i=0;i<picurls.length;i++){
                let obj_pic={};
                obj_pic.src = picurls[i];
                console.log(obj_pic.src);
                this.imgLoadEvent(function (obj) {
                  obj_pic.w=obj["w"];
                  obj_pic.h=obj["h"];
                }, picurls[i]);
                _arr_pic.push(obj_pic);
                console.log(_arr_pic)
              }
              self.pic_list=_arr_pic;
            } else {
              this.confirm_content = data.body.result.error_reason;
              this.confirm_show = true;
            }
          })
        } else {
          this.$http.get('/api/published_detail').then((data) => {
            console.log(data);
            self.rack = data.body.data.data.rack;
            self.user_name = data.body.data.data.user_name;
            self.user_tel = data.body.data.data.user_tel;
            self.goods_name = data.body.data.data.goods_name;
            self.goods_degree = data.body.data.data.goods_degree;
            self.goods_rack = data.body.data.data.goods_rack;
            self.goods_price = data.body.data.data.goods_price;
            self.goods_desc = data.body.data.data.goods_desc;
            self.goods_img = data.body.data.data.goods_img;
          }, () => {
            console.log(2);
          });
        }
      }
      document.getElementById("index_loading").style.display = "none";
    },
    methods: {
      resetPic(){
        this.$store.dispatch("resetContext");
      },
      showRack(){
        this.show_rack = true;
      },
      showDegree(){
        this.show_degree = true;
      },
      click_rack(key){
        this.rack_key = key;
        for (let i in this.rack) {
          if (i == key) {        //item 表示Json串中的属性，如'name'
            let jValue = this.rack[i];//key所对应的value
            this.goods_rack = jValue;
          }
        }
      },
      imgLoadEvent(callback, url) {//圖片事件加載
        var img = new Image();
        img.onreadystatechange = function () {
          if (this.readyState == "complete") {
            callback({ "w": img.width, "h": img.height });
          }
        }
        img.onload = function () {
          if (this.complete == true) callback({ "w": img.width, "h": img.height });
        }

        img.onerror = function () {
          callback({ "w": 0, "h": 0 });
          //current.autoSetImgSize(current,img,obj);
        }
        img.src = url;
      },
      show (index) {
        this.$refs.previewer.show(index)
      },
      click_degree(key){
        this.goods_degree = key+1;
      },
      _validate(){
        if(!this.goods_name){
          this.confirm_content = "请输入商品名称";
          this.confirm_show = true;
          return false;
        }
        if(this.goods_degree==="请选择成色"){
          this.confirm_content = "请选择商品成色";
          this.confirm_show = true;
          return false;
        }
        if(!this.rack_key){
          this.confirm_content = "请选择商品分类";
          this.confirm_show = true;
          return false;
        }
        if(!this.goods_price){
          this.confirm_content = "请输入商品价格";
          this.confirm_show = true;
          return false;
        }
        if(!this.goods_desc){
          this.confirm_content = "请输入商品的详细描述";
          this.confirm_show = true;
          return false;
        }
        if(!this.user_name){
          this.confirm_content = "请输入联系人";
          this.confirm_show = true;
          return false;
        }
        if(!this.user_tel){
          this.confirm_content = "请输入联系电话";
          this.confirm_show = true;
          return false;
        }
        if(!this.picurls.length){
          this.confirm_content = "请至少选择一张图片上传";
          this.confirm_show = true;
          return false;
        }
        return true;
      },
      addMarket(){
          if(!this._validate()){
              return;
          }
        this.isLoading = true;
        let self = this;
        let senddata = {
          "name": this.goods_name,
          "quality": this.goods_degree,
          "cid": this.rack_key,
          "price": this.goods_price,
          "desc": this.goods_desc,
          "user_name": this.user_name,
          "user_tel": this.user_tel,
          "goods_img": this.picurls
        };
//          "goods_img":this.goods_img
//          let str_senddata=JSON.stringify(senddata)
        this.$http.post(service_url + '/o2o/flea/wx/fleaRelease', senddata).then((data) => {
          self.isLoading = false;
          if (data.body.result.status === 0) {
            self.toast_text = "发布成功";
            self.show_toast = true;
            setTimeout(self.go_next,1000);
            setTimeout(self.resetPic,1000);
          } else {
            self.confirm_content = data.body.result.error_reason;
            self.confirm_show = true;
          }
        })
      },
      go_next(){
        this.$router.push({path: 'reserve_success', query: {route_type: 12}});
      },
      editMarket(){
        console.log("编辑")
        let self = this;
        let senddata = {
          "goods_id": this.goods_id,
          "goods_name": this.goods_name,
          "goods_degree": this.goods_degree,
          "goods_rack": this.goods_rack,
          "goods_price": this.goods_price,
          "goods_desc": this.goods_desc,
          "user_name": this.user_name,
          "user_tel": this.user_tel,
          "goods_img": this.picurls,
        };
        this.$http.post(service_url + '/o2o/market/wx/edit_market_goods.do', senddata).then((data) => {
          if (data.body.data.status === 0) {
            self.confirm_content = "发布成功";
            self.confirm_show = true;
            self.$router.push({path: '/my_published'});
          } else {
            self.confirm_content = data.body.result.error_reason;
            self.confirm_show = true;
          }
        })

      }
    }
  }
</script>

<style scoped>

</style>

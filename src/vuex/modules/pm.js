/**
 * Created by yr on 2016/12/14.
 * pm 保养模块
 */
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
const router = new VueRouter();
Vue.use(Vuex);


/**
 * 设置单选值
 * @param state
 * @param fieldname
 * @param val
 */
function setValue(state, fieldname, val){
    //if(state[fieldname]) {
        if(val){
            state[fieldname] = val;
        }
    //}
}
/**
 * 设置多选值
 * @param state
 * @param fieldname
 * @param val
 * @param queryby 唯一键ID名称
 */
function setMutltiValue(state, fieldname, val, queryby){
    if(state){
        var field = state[fieldname];
        if(Object.prototype.toString.call(field) === '[object Array]'){
            var itemObj = field.filter(item => {
                return item[queryby || 'id'] === val[queryby || 'id']
            })
            if(itemObj.length > 0){//已存在，更新
                itemObj = val;
            } else {//不存在，新增
                field.push(val);
            }
        }
    }
}

const state = {
    picurls:[],
    workval:"",
    staffteam:{val:"",desc:""},
    pmno:""
};

const mutations = {
    ADD_CONTEXT(state,xcontext){
        function isEmptyObject(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        }
        if(isEmptyObject(state.context)){
            state.context = xcontext;
        }
    },
    PUSH_IMAGE_ACTION(state,para) {
        setMutltiValue(state, para[0], para[1], para[2]);
    },
    VAL_SET(state,para) {
        //if(state[para['fieldname']])
        setValue(state,para['fieldname'],para['val'])
        //console.log(state)
    },
    HELPER_GOTOVIEW(state){
        //如果当前用户有工作组，则进入选择人员页面，否则进入选择工作组页面
        // if(state.context.fields.staffteam.val){
        if(userProfile_staffteam){
            router.push({path:"/chooseworkers",query:{"backrouter":"pmedit","staffteam":state.staffteam}});
        }else{
            router.push({path:"/chooseworkgroupdouble",query:{"backrouter":"pmedit"}});
        }
    },

}

export default({
    state,
    mutations
})
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'

Vue.use(Vuex)


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
};

// 定义所需的 mutations
const mutations = {
    SET_VALUE_CHANGE(state, fieldname, val, desc) {
        setValue(state, fieldname, val, desc);
    },

    //多个页面共用一个context数据，如果已经存在就不加，否则就加
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
    //在每一个新页面重置context数据
    RESET_CONTEXT(state,context){
      state.picurls=[]
    },
    PUSH_IMAGE_ACTION(state,para) {
        setMutltiValue(state, para[0], para[1], para[2]);
    },
    VAL_SET(state,para) {
        //if(state[para['fieldname']])
        setValue(state,para['fieldname'],para['val'])
        //console.log(state)
    },

}

export default new Vuex.Store({
    actions,
    state,
    mutations
})

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'mint-ui/lib/style.css'
import App from './App'
import router from './router'
// import MintUI from 'mint-ui'
import './assets/css/main.css'
import './assets/css/my-mint.scss'
import { Navbar, Picker, Popup, Switch, Field, MessageBox, Checklist, Toast, Spinner, Swipe, SwipeItem, Button, Header, Tabbar, TabItem, TabContainer, TabContainerItem, Cell, Search } from 'mint-ui'
// 配置axios
import Qs from 'qs'
import axios from 'axios' // 导入axios
import VueAxios from 'vue-axios'
import Vuex from 'vuex' // 导入vuex包

var axiosInstance = axios.create({
  // baseURL: 'http://192.168.0.30:8088/shopApp-WXPage/', // 开发环境
  // baseURL: 'http://120.26.209.236:80/shopApp-WXPage/', // 生产环境
  baseURL: 'http://192.168.0.30:8088/shopApp-WXPage/', // 开发环境
  transformRequest: [function (data) {
    data = Qs.stringify(data)
    return data
  }],
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
})
Vue.use(VueAxios, axiosInstance)
axios.defaults.timeout = 10000 // 超时时间

Vue.config.productionTip = false
Vue.component(Tabbar.name, Tabbar) // 底部导航菜单组件
Vue.component(TabItem.name, TabItem) // 底部导航菜单组件
Vue.component(TabContainer.name, TabContainer) // 页面容器组件
Vue.component(TabContainerItem.name, TabContainerItem) // 页面容器组件
Vue.component(Cell.name, Cell)
Vue.component(Search.name, Search) // 搜索框组件
Vue.component(Header.name, Header) // 顶部组件
Vue.component(Button.name, Button) // 按钮组件
Vue.component(Swipe.name, Swipe) // 轮播图组件
Vue.component(SwipeItem.name, SwipeItem) // 轮播图组件
Vue.component(Spinner.name, Spinner) // 加载组件
Vue.prototype.$toast = Toast // 提示框组件
Vue.component(Checklist.name, Checklist) // 选择框组件
Vue.prototype.$MessageBox = MessageBox // 选择框组件
Vue.component(Field.name, Field) // 表单输入框组件
Vue.component(Switch.name, Switch) // 开关组件
Vue.component(Popup.name, Popup) // 弹出框样式
Vue.component(Picker.name, Picker) // 选择器样式
Vue.component(Navbar.name, Navbar) // 菜单栏样式
// Vue.use(MintUI)
/* eslint-disable no-new */
Vue.use(Vuex)

var store = new Vuex.Store({
  state: {
    openid: localStorage.getItem('openid'), // 用户id
    shopCarProduct: [], // 购物车商品数据
    totalMoney: 0, // 总计金额
    allSelected: false // 全选状态
  },
  mutations: {
    initOpenid (state, data) {
      state.openid = data
    },
    // this.$store.commit('方法名称','按需传参数')
    // 点击加入购物车
    addToCar (state, productInfo) {
    },
    // 初始化购物车数据
    initializeShopCarProduct (state, data) {
      state.shopCarProduct = data
    },
    // 改变选中状态
    changeSelected (state, index) {
      state.shopCarProduct[index].selected = !state.shopCarProduct[index].selected
      // 如果变成未选中,全选取消
      if (!state.shopCarProduct[index].selected) {
        state.allSelected = false
      }
      // 如果全部选中，全选按钮变成高亮
      let flag = true // 全选是否高亮标志
      state.shopCarProduct.forEach((val, index) => {
        if (!val.selected) {
          flag = false
        }
      })
      if (flag) {
        state.allSelected = true
      }
    },
    // 改变全选状态
    changeAllSelected (state) {
      state.allSelected = !state.allSelected
      var productObj
      state.shopCarProduct.forEach((val, index) => {
        if (state.allSelected) {
          productObj = {}
          state.shopCarProduct[index] = null
          productObj.buyNum = val.buyNum
          productObj.addDate = val.addDate
          productObj.custId = val.custId
          productObj.product = val.product
          productObj.productId = val.productId
          productObj.shopCarId = val.shopCarId
          productObj.selected = state.allSelected
          Vue.set(state.shopCarProduct, index, productObj)
        } else {
          productObj = {}
          state.shopCarProduct[index] = null
          productObj.buyNum = val.buyNum
          productObj.addDate = val.addDate
          productObj.custId = val.custId
          productObj.product = val.product
          productObj.productId = val.productId
          productObj.shopCarId = val.shopCarId
          productObj.selected = state.allSelected
          Vue.set(state.shopCarProduct, index, productObj)
        }
      })
    },
    changeASelected: function (state) {
      state.allSelected = false
    }
  },
  getters: {
    getOpenid: function (state) {
      return state.openid
    },
    getselected: (state) => (index) => {
      // 获取当前商品选中状态
      return state.shopCarProduct[index].selected
    },
    getTotalMoney: (state) => {
      // 获取选中商品总计
      state.totalMoney = 0
      state.shopCarProduct.forEach((val, index) => {
        if (val.selected) {
          state.totalMoney += parseInt(val.product.productPrice) * parseInt(val.buyNum)
        }
      })
      return state.totalMoney
    },
    getAllSelected: (state) => {
      // 获取当前商品选中状态
      return state.allSelected
    },
    getShopcarIdStr: (state) => {
      let str = ''
      state.shopCarProduct.forEach((val, index) => {
        if (val.selected) {
          str += val.shopCarId + ','
        }
      })
      return str
    }
  }
})

// 头尾去空格
Vue.prototype.$trim = function (str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
}

new Vue({
  el: '#app',
  beforeCreate: function () {
    // 初始化用户id存储到本地localStorage
    if (this.$route.query.openid !== null && this.$route.query.openid !== undefined) {
      localStorage.setItem('openid', this.$route.query.openid.toString().split(',')[0])
      this.$store.commit('initOpenid', localStorage.getItem('openid'))
    }
  },
  router,
  components: { App },
  template: '<App/>',
  store: store
})

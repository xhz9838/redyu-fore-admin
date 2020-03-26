import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import './components/Upload/FilePondUpload'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import moment from 'moment'

import '@/utils/filter' // global filter

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.config.productionTip = false
Vue.prototype.$moment = moment
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

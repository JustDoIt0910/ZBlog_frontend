import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import mavonEditer from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import './plugin/antui'
import './assets/css/style.css'

Vue.use(mavonEditer)

axios.defaults.baseURL = 'http://asilentboy.cn:9998'
axios.interceptors.request.use(config => {
  if(config.url != "/user/login")
    config.headers.Authorization = `Bearer ${window.localStorage.getItem('token')}`
  return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

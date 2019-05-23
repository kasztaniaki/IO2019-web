import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'
import VeeValidate from 'vee-validate'
import store from './store'
import api from '@/api'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'

Vue.prototype.$api = api

Vue.use(Buefy, {
  'defaultIconPack': 'fas'
})
Vue.use(VeeValidate)

Vue.config.productionTip = false

new Vue({
  router,
  api,
  store,
  render: h => h(App)
}).$mount('#app')

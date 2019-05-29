import Vue from 'vue'
import Buefy from 'buefy'
import App from './App.vue'
import router from './router'
import highlight from 'vue-highlight-text/public/directive.min.js'
import VeeValidate from 'vee-validate'
import store from './store'
import api from '@/api'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'

Vue.directive('highlight', highlight)
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

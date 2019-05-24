import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import highlight from 'vue-highlight-text/public/directive.min.js'
import VeeValidate from 'vee-validate'
import store from './store'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'

Vue.prototype.$http = axios
Vue.directive('highlight', highlight)

Vue.use(Buefy, {
  'defaultIconPack': 'fas'
})
Vue.use(VeeValidate)

Vue.config.productionTip = false

new Vue({
  router,
  axios,
  store,
  render: h => h(App)
}).$mount('#app')

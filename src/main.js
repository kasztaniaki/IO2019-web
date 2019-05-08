import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VeeValidate from 'vee-validate'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'

Vue.prototype.$http = axios

Vue.use(Buefy, {
  'defaultIconPack': 'fas'
})
Vue.use(VeeValidate)

Vue.config.productionTip = false

new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import highlight from 'vue-highlight-text/public/directive.min.js';

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'

Vue.prototype.$http = axios
Vue.directive('highlight', highlight)

Vue.use(Buefy, {
  'defaultIconPack': 'fas'
})

Vue.config.productionTip = false

new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount('#app')

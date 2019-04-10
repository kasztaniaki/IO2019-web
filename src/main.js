import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'

Vue.use(Buefy, {
  'defaultIconPack': 'fas'
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

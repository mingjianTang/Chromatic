// import Vue from 'vue'
// import App from './App.vue'

// new Vue({
//   el: '#app',
//   render: h => h(App)
// })

import Vue from 'vue'
import App from './App.vue'
import easySearch from './lib/index.js'


Vue.config.productionTip = false
Vue.use(easySearch)

new Vue({
  render: h => h(App)
}).$mount('#app')

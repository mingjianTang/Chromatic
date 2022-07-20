import Vue from 'vue'
import easySearch from './search.vue'
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
let test = {}
test.install = function (Vue, options) {
  Vue.component(easySearch.name, easySearch)
}
export default test

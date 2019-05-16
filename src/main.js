 // The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import axiosUtil from './utils/axios'
import echarts from 'echarts'
import App from './App'
import router from './router'
import 'iview/dist/styles/iview.css'
import './theme/common.css'
import store from './vuex/store'
import '../static/js/cytoscape.min'

import VueI18n from 'vue-i18n'
import './assets/font/iconfont.css'
import "./pages/graph/css/navigator.css"
import './theme/setColors.less'


import * as _ from "lodash"


Vue.config.productionTip = false;
Vue.use(VueI18n)


Vue.use(iView);
Vue.use(echarts);


Vue.prototype.$echarts = echarts;
Vue.prototype.$http = axiosUtil;

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});

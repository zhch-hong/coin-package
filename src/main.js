import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import './styles/font.scss';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss'; // global css
import { toFixed } from '@/utils/tools';
import mixin from './mixins/mixin';

import App from './App';
import store from './store';
import router from './router';
import api from './api';
import calc from './utils/calc';
import '@/icons'; // icon
import '@/permission'; // permission control

import vcard from './components/vcard';
import ScanCode from './components/scan-code';
import BCTable from './components/bc-table';
import BCSearch from './components/bc-search';
import BCTab from './components/bc-tab';
import BCTypeMenu from './components/bc-type-menu';
import BCTitle from './components/bc-title';
import * as db from './utils/indexedDB';

Vue.component('vcard', vcard);
Vue.component('scanCode', ScanCode);
Vue.component('BcTable', BCTable);
Vue.component('BcSearch', BCSearch);
Vue.component('BcTab', BCTab);
Vue.component('BcTitle', BCTitle);
Vue.component('BcTypeMenu', BCTypeMenu);
Vue.use(ElementUI);
Vue.mixin(mixin);
Number.prototype.toFixed = toFixed;
Vue.prototype.$calc = calc;
Vue.prototype.$isDev = process.env.NODE_ENV === 'development';
Vue.prototype.$api = api;
Vue.prototype.$db = db;
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});
// 加载小票机打印驱动
// let index=0;
// let loadLODOP=function (i){
//     i+=8000;
//     loadScript("http://localhost:"+i+"/CLodopFuncs.js",(status)=>{
//         if(!status&&index<10)
//         {
//             index++;
//             loadLODOP(index);
//         }
//     })
// }
// loadLODOP(index);

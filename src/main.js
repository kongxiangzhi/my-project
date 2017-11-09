// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import Hello from './components/Hello.vue';
import recommend from './components/recommend.vue';
import chooseType from './components/chooseType.vue';
import record from './components/record.vue';
import detail from './components/detail.vue';




Vue.config.productionTip = false
axios.defaults.timeout = 30000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.baseURL = 'http://tauctiondev.epailive.com';   //配置接口地址
//axios.defaults.baseURL = 'https://wxtatest.epailive.com';   //配置测试接口地址
// axios.defaults.baseURL = 'https://qingyiysx01.epailive.com';   //配置预上线接口地址
axios.defaults.baseURL = 'https://qingyi.epailive.com';   //配置生产接口地址
axios.interceptors.response.use((response) => {
  //console.log(response);
    if(response.data.status *1 === 202){
      var local = window.location.href;
      var _url=encodeURIComponent(local);
      //alert(_url);
      window.location.href=axios.defaults.baseURL+"/record/sayLogin?returnurl="+_url+"&luyin=1";
    }

  return response;
})
//axios.defaults.baseURL = 'http://xsjp.epailive.com';   //配置接口地址
/* eslint-disable no-new */
// router.push({path:'/first'})
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})




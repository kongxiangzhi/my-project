import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',//启动页
      name: 'Hello',
      component: Hello
    },
    {
      path:'/recommend',//热门推荐
      name: 'recommend',
      component: resolve => {
        require(['../components/recommend.vue'], resolve)
      }
    },
    {
      path:'/chooseType',//选择录音类型
      name:'chooseType',
      component: resolve => {
        require(['../components/chooseType.vue'], resolve)
      }
    },
    {
      path:'/record',//录音页
      name:'Record',
      component: resolve => {
        require(['../components/record.vue'], resolve)
      }

    },
    {
      path:'/runkList',//排行页
      name:'runkList',
      component: resolve => {
        require(['../components/runkList.vue'], resolve)
      }

    },
    {
      path:'/detail',//详情页
      name:'detail',
      component: resolve => {
        require(['../components/detail.vue'], resolve)
      }
    },
    {
      path:'/share',//详情页
      name:'share',
      component: resolve => {
        require(['../components/share.vue'], resolve)
      }
    }
  ]
})

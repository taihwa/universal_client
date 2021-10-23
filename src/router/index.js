import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import * as axios from 'axios'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  console.log(this);
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    console.log(to)
    if (to.matched.some(record => record.meta.requireAuth)) {
      const { data } = await axios.get('/api/user/loginCheck');
      console.log(data);
      if (data) {
        console.log('로그인 완료');
        next()
      } else {
        console.log('로그인 실패');
        next({
          path: '/login'
        })
      }
    } else {
      console.log("로그인 필요 없는 페이지 이동")
      next()
    }
  })

  return Router
})

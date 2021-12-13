import { getToken } from '@/utils/auth' // get token from cookie
import router from './router'

const whiteList = ['/login', '/wxAuth'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    next(`/login`)
  }
})

router.afterEach(() => {
  // finish progress bar
})

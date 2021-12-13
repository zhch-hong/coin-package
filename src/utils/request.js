import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { removeToken } from './auth'
import router from '../router'

// create an axios instance
const service = axios.create({
  // url = base url + request url
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    const data = config.data
    if (config.method === 'post' || config.method === 'put') {
      config.data = data
    } else {
      config.params = data
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.errCode !== 0) {
      if (res.errCode === 30000) {
        Message({
          message: res.errMsg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        removeToken()
        router.push('/login')
      } else if (res.errCode === 80000) {
        if (store.state.isMaintenance) return
        store.commit('SET_MAINTENANCE', true)
        MessageBox.alert(res.errMsg, '维护中', {
          showClose: false,
          callback: () => {
            store.commit('SET_MAINTENANCE', false)
            removeToken()
            router.push(`/login`)
          }
        })
      } else {
        Message({
          message: res.errMsg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    console.log(`err${error}`) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

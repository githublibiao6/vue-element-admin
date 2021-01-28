import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// const qs = require('querystring')

// create an axios instance
const service = axios.create({
  // baseURL: 'http://localhost:80/om',
  baseURL: process.env.VUE_APP_BASE_API + '/om', // url = base url + request url
  // http://localhost:80/om//本机地址
  // baseURL: 'http://121.199.72.15:80/om', // 服务器地址
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000// request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    // console.log(config.method)
    // if (config.method.toLowerCase() === 'get') {
    //   config.params = config.data
    // } else if (config.method.toLowerCase() === 'post') {
    //   if (config.jsonData) {
    //     config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    //     console.log(config.data)
    //     config.data = JSON.stringify(config.data)
    //   } else {
    //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    //     config.data = qs.stringify(config.data)
    //   }
    // }
    console.log('请求参数')
    console.log(config)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    // 打印返回结果
    console.log('请求结果:')
    console.log(res)
    if (res.code !== 20000) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      // return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

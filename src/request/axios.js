import axios from 'axios'
import router from '../router'

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'https://lu99.api.029tulingling.com'
} else if (process.env.NODE_ENV === 'debug') {
  axios.defaults.baseURL = 'https://lu99.api.029tulingling.com'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://lu99.api.029tulingling.com'
}

axios.defaults.timeout = 50000 // 超时时间
axios.defaults.responseType = 'json' // 类型动态设置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// http 响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做处理
    if (localStorage.getItem('Authorization')) {
      response.headers.Authorization = localStorage.getItem('Authorization')
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push({
            path: './login'
          })
      }
    }
    return Promise.reject(error)
  }
)
export default axios

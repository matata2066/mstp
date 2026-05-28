import axios from 'axios'
import { notification } from 'ant-design-vue'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        notification.warning({
          message: '登录过期',
          description: '请重新登录',
        })
      } else {
        const message = data?.message || data?.error || `请求错误 (${status})`
        notification.error({
          message: '请求失败',
          description: message,
        })
      }
    } else {
      notification.error({
        message: '网络错误',
        description: '无法连接到服务器，请检查网络',
      })
    }
    return Promise.reject(error)
  }
)

export default request

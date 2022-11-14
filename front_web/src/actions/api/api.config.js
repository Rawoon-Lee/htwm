import axios from 'axios'

const HOST = 'https://k7a306.p.ssafy.io/api/'

axios.defaults.withCredentials = true
const api = axios.create({
  baseURL: HOST,
})

api.interceptors.request.use(
  (config) => {
    const username = localStorage.getItem('username')
    config.headers.Authorization = username ? username : 'guest'
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
export default api

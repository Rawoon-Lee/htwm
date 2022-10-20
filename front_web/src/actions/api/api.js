import axios from 'axios'

const HOST = 'https://'

axios.defaults.withCredentials = true
const api = axios.create({
  baseURL: HOST,
})

api.interceptors.request.use(
  (consfig) => {},
  (error) => {},
)
export default api

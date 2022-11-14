import axios from "axios"

const HOST = "https://k7a306.p.ssafy.io/api/"

axios.defaults.withCredentials = true
const api = axios.create({
	baseURL: HOST
})

export default api

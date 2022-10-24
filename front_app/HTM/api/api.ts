import axios from "axios"

const HOST = "baseurl"

axios.defaults.withCredentials = true
const api = axios.create({
	baseURL: HOST
})

export default api

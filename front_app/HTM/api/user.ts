import api from "./api"

const END_POINT = "user"

const user = {
	login(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/login`
		})
	},
	getInfo(data: string) {
		return api({
			method: "get",
			url: `${END_POINT}/info?username=${data}`
		})
	},
	edit(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/edit`
		})
	},
	weight(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/weight`
		})
	},
	friendAdd(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/friend`
		})
	},
	friendDelete(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/friend`
		})
	}
}

export { user }

import api from "./api"

const END_POINT = "user"

const user = {
	login(data: any) {
		console.log("로그인하자")
		console.log(data)
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
			method: "delete",
			data: data,
			url: `${END_POINT}/friend`
		})
	},
	friendList(data: string) {
		return api({
			method: "get",
			url: `${END_POINT}/friend?username=${data}`
		})
	},
	friendSearch(data: any) {
		return api({
			method: "get",
			params: {
				nickname: data.nickname,
				username: data.username
			},
			url: `${END_POINT}/search`
		})
	}
}

export { user }

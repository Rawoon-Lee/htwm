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
	profileEdit(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/edit`
		})
	},
	weightRecord(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/weight`
		})
	},
	weightList(userId: string) {
		return api({
			method: "get",
			params: {
				username: userId
			},
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
	},
	getUuid(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/username`
		})
	},
	registerUuid(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/register`
		})
	}
}

export { user }

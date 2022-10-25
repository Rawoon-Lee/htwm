import api from "./api"

const END_POINT = "user"

const user = {
	register(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/register`
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

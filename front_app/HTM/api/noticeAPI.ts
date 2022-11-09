import api from "./api"

const END_POINT = "notice"

const notice = {
	requestFriend(data: any) {
		console.log("친구할래?")
		console.log(data)
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/friend`
		})
	},
	getAlarms(data: any) {
		return api({
			method: "get",
			params: {
				username: data
			},
			url: `${END_POINT}`
		})
	},
	readAlarms(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}`
		})
	},
	requestStreaming(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/streaming`
		})
	}
}

export { notice }

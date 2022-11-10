import api from "./api"

const END_POINT = "streaming"

const streaming = {
	acceptStreaming(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/accept`
		})
	},
	getStreamings(data: any) {
		return api({
			method: "get",
			params: {
				username: data
			},
			url: `${END_POINT}`
		})
	},
	endStreaming(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/end`
		})
	},
	denyStreaming(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/deny`
		})
	}
}

export { streaming }

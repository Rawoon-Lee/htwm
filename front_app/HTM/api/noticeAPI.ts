import api from "./api"

const END_POINT = "notice"

const notice = {
	requestFriend(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/friend`
		})
	},
	requestStreaming(data: any) {
		console.log("스트리밍 신청")
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/streaming`
		})
	}
}

export { notice }

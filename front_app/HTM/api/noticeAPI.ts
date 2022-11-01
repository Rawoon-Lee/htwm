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
	}
}

export { notice }

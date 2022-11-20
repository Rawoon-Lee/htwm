import api from "./api"

const END_POINT = "record"

const record = {
	recordList(data: string) {
		return api({
			method: "get",
			data: data,
			url: `${END_POINT}/routine?username=${data}`
		})
	},
	recordDays(data: any) {
		return api({
			method: "get",
			params: {
				username: data.username,
				date: data.date
			},
			url: `${END_POINT}/days`
		})
	}
}

export { record }

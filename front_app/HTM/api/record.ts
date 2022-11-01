import api from "./api"

const END_POINT = "record"

const record = {
	recordList(data: string) {
		return api({
			method: "get",
			data: data,
			url: `${END_POINT}/routine?username=${data}`
		})
	}
}

export { record }

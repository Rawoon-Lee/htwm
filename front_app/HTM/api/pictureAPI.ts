import api from "./api"

const END_POINT = "picture"

const picture = {
	pictureCreate(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/`
		})
	},
	pictureDelete(data: any) {
		return api({
			method: "delete",
			data: data,
			url: `${END_POINT}/`
		})
	},
	pictureList(data: any) {
		return api({
			method: "get",
			params: {
				username: data.username,
				date: data.date
			},
			url: `${END_POINT}`
		})
	}
}

export { picture }

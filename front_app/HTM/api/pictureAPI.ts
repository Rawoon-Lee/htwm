import api from "./api"
import FormData from "form-data"

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
	},
	changeProfile(data: FormData) {
		return api({
			method: "post",
			data: data,
			headers: {
				"Content-Type": "multipart/form-data"
			},
			url: `${END_POINT}/profile`
		})
	}
}

export { picture }

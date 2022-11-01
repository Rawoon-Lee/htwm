import api from "./api"

const END_POINT = "routine"

const routine = {
	routineCreate(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/`
		})
	},
	routineDelete(data: any) {
		return api({
			method: "delete",
			data: data,
			url: `${END_POINT}/`
		})
	},
	createRoutine(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/`
		})
	},
	routineList(username: string) {
		return api({
			method: "get",
			url: `${END_POINT}?username=${username}`
		})
	},
	exerciseList() {
		return api({
			method: "get",
			url: `${END_POINT}/exercise/`
		})
	},
	exerciseRecord(data: any) {
		return api({
			method: "post",
			data: data,
			url: `${END_POINT}/exercise/`
		})
	}
}

export { routine }

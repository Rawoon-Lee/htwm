import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface RoutineData {
	color: string
	name: string
	username: string
	sets: SetData[]
}
interface SetData {
	exercise_id: number
	exercise_name: string
	number: number
	sec: number
	set_cnt: number
}
const initialStateRoutineData: RoutineData = {
	color: "#E0BB95",
	name: "",
	username: "",
	sets: [
		{
			exercise_id: 0,
			exercise_name: "스쿼트",
			number: 0,
			sec: 0,
			set_cnt: 0
		}
	]
}
const RoutineListSlice = createSlice({
	name: "userInfo",
	initialState: initialStateRoutineData,
	reducers: {
		getRoutineList: (state, action: PayloadAction<RoutineData>) => {
			return action.payload
		}
	}
})

// const userIdSlice = createSlice({
// 	name: "userId",
// 	initialState: {
// 		id: ""
// 	},
// 	reducers: {
// 		getUserId: (state, action: PayloadAction<string>) => {
// 			state.id = action.payload
// 		}
// 	}
// })

export const { getRoutineList } = RoutineListSlice.actions
export default { routineList: RoutineListSlice.reducer }

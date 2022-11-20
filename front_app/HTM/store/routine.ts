import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type RoutineDataList = RoutineData[]
export interface RoutineData {
	color: string
	name: string
	username: string
	sets: SetData[]
}
export interface SetData {
	exercise_id: number
	exercise_name: string
	number: number
	sec: number
	set_cnt?: number
}
const initialStateRoutineData: RoutineDataList = []
const RoutineListSlice = createSlice({
	name: "userInfo",
	initialState: initialStateRoutineData,
	reducers: {
		getRoutineList: (state, action: PayloadAction<RoutineDataList>) => {
			return action.payload
		},
		initRoutineList: state => {
			return initialStateRoutineData
		}
	}
})

// const userIdSlice = createSlice({
//     name: "userId",
//     initialState: {
//         id: ""
//     },
//     reducers: {
//         getUserId: (state, action: PayloadAction<string>) => {
//             state.id = action.payload
//         }
//     }
// })

export const { getRoutineList, initRoutineList } = RoutineListSlice.actions
export default { routineList: RoutineListSlice.reducer }

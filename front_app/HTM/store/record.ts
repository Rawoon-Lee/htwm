import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface RecordData {
	startDateTime: string
	endDateTime: string
	username: string
	doneSetNum: number
	routineJson: string
}
export type RecordDataList = RecordData[]
const initialStateRecoirdList: RecordDataList = []
// const initialStateRecoirdList: RecordDataList = [
// 	{
// 		startDateTime: "2022-11-02T05:00:38.986Z",
// 		endDateTime: "2022-11-02T06:00:38.986Z",
// 		username: "helennaby",
// 		doneSetNum: 10,
// 		routineJson: JSON.parse(
// 			'{"name":"점심운동","username":"helennaby","sets":[{"exercise_id":2,"exercise_name":"running","set_cnt":0,"number":2,"sec":2},{"exercise_id":2,"exercise_name":"running","set_cnt":0,"number":2,"sec":2},{"exercise_id":1,"exercise_name":"squat","set_cnt":0,"number":2,"sec":2},{"exercise_id":1,"exercise_name":"squat","set_cnt":0,"number":2,"sec":2}]}'
// 		)
// 	},
// 	{
// 		startDateTime: "2022-11-01T05:00:38.986Z",
// 		endDateTime: "2022-11-01T05:30:38.986Z",
// 		username: "helennaby",
// 		doneSetNum: 2,
// 		routineJson: JSON.parse(
// 			'{"name":"점심운동","username":"helennaby","sets":[{"exercise_id":2,"exercise_name":"running","set_cnt":0,"number":2,"sec":2},{"exercise_id":2,"exercise_name":"running","set_cnt":0,"number":2,"sec":2},{"exercise_id":1,"exercise_name":"squat","set_cnt":0,"number":2,"sec":2},{"exercise_id":1,"exercise_name":"squat","set_cnt":0,"number":2,"sec":2}]}'
// 		)
// 	}
// ]
const recordListSlice = createSlice({
	name: "recordList",
	initialState: initialStateRecoirdList,
	reducers: {
		getUserRecord: (state, action: PayloadAction<RecordData[]>) => {
			let copy: RecordData[] = []
			for (let i = 0; i < action.payload.length; i++) {
				let temp = {
					startDateTime: action.payload[i].startDateTime,
					endDateTime: action.payload[i].endDateTime,
					username: action.payload[i].username,
					doneSetNum: action.payload[i].doneSetNum,
					routineJson: action.payload[i].routineJson
				}
				copy.push(temp)
			}
			return copy
		}
	}
})

export const { getUserRecord } = recordListSlice.actions
export default recordListSlice.reducer

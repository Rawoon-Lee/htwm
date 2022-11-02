import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface RecordData {
	startDateTime: string
	endDateTime: string
	username: string
	doneSetNum: number
	routineInfo: string
}
export type RecordDataList = RecordData[]
const initialStateRecoirdList: RecordDataList = [
	{
		startDateTime: "",
		endDateTime: "",
		username: "",
		doneSetNum: 0,
		routineInfo: ""
	}
]
const recordListSlice = createSlice({
	name: "recordList",
	initialState: initialStateRecoirdList,
	reducers: {
		getUserRecord: (state, action: PayloadAction<RecordData[]>) => {
			return action.payload
		}
	}
})

export const { getUserRecord } = recordListSlice.actions
export default recordListSlice.reducer

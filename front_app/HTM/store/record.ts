import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface RecordData {
	startDateTime: Date
	endDateTime: Date
	username: string
	doneSetNum: number
	routineInfo: string
}
export type RecordDataList = RecordData[]
const initialStateRecoirdList: RecordDataList = []
const recordListSlice = createSlice({
	name: "recordListSlice",
	initialState: initialStateRecoirdList,
	reducers: {
		getUserRecord: (state, action: PayloadAction<RecordData[]>) => {
			return action.payload
		}
	}
})

export const { getUserRecord } = recordListSlice.actions
export default recordListSlice.reducer

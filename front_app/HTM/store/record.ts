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

export interface StreamingData {
	startTime: string
	endTime: string
	otherUsername: string
	otherNickname: string
}
const initialStateStreamingList: StreamingData[] = []
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
const streamingListSlice = createSlice({
	name: "streamingList",
	initialState: initialStateStreamingList,
	reducers: {
		getStreamingList: (state, action: PayloadAction<StreamingData[]>) => {
			return action.payload
		}
	}
})
export const { getUserRecord } = recordListSlice.actions
export const { getStreamingList } = streamingListSlice.actions
export default { recordList: recordListSlice.reducer, streamingList: streamingListSlice.reducer }

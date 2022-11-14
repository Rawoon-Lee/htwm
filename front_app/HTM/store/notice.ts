import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface alarmData {
	notice_id: number
	createTime: string
	fromUsername: string
	toUsername: string
	type: string
	fromNickname: string
	toNickname: string
	fromUrl: string
	read: boolean
}

const initialStateAlarmData: alarmData[] = []

const alarmListSlice = createSlice({
	name: "alarmList",
	initialState: initialStateAlarmData,
	reducers: {
		getAlarmList: (state, action: PayloadAction<alarmData[]>) => {
			return action.payload
		},
		initAlarmList: state => {
			return initialStateAlarmData
		}
	}
})

export const { getAlarmList, initAlarmList } = alarmListSlice.actions
export default { alarmList: alarmListSlice.reducer }

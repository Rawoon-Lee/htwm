import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface UserData {
	nickname: string
	url: string
	height: number
}

const initialStateUserInfo: UserData = {
	nickname: "",
	url: "",
	height: 0
}
const userInfoSlice = createSlice({
	name: "userInfo",
	initialState: initialStateUserInfo,
	reducers: {
		getUserInfo: (state, action: PayloadAction<UserData>) => {
			return action.payload
		}
	}
})

const userIdSlice = createSlice({
	name: "userId",
	initialState: {
		id: ""
	},
	reducers: {
		getUserId: (state, action: PayloadAction<string>) => {
			state.id = action.payload
		}
	}
})

export const { getUserInfo } = userInfoSlice.actions
export const { getUserId } = userIdSlice.actions
export default { userInfo: userInfoSlice.reducer, userId: userIdSlice.reducer }

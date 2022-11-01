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

export type FreindDataList = FriendData[]
interface FriendData {
	nickname: string
	username: string
}

const initialStateFriend: FreindDataList = [
	{
		nickname: "",
		username: ""
	}
]

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
const FriendListSlice = createSlice({
	name: "friendList",
	initialState: initialStateFriend,
	reducers: {
		getFriendsList: (state, action: PayloadAction<FreindDataList>) => {
			return action.payload
		}
	}
})
export const { getUserInfo } = userInfoSlice.actions
export const { getUserId } = userIdSlice.actions

export const { getFriendsList } = FriendListSlice.actions
export default {
	userInfo: userInfoSlice.reducer,
	userId: userIdSlice.reducer,
	friendList: FriendListSlice.reducer
}

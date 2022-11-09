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

type FreindDataList = FriendData[]

export interface FriendData {
	nickname: string
	username: string
	url: string
	status?: string
	isSearch?: boolean
}

const initialStateFriend: FreindDataList = []

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
			console.log("나나나나 아이디 들어옴?")
			state.id = action.payload
		},
		initUserId: state => {
			state.id = ""
		}
	}
})
const FriendListSlice = createSlice({
	name: "friendList",
	initialState: initialStateFriend,
	reducers: {
		getFriendsList: (state, action: PayloadAction<FreindDataList>) => {
			return action.payload
		},
		initFriendList: state => {
			return initialStateFriend
		}
	}
})
const FriendSearchListSlice = createSlice({
	name: "friendSearchList",
	initialState: initialStateFriend,
	reducers: {
		getFriendsSearchList: (state, action: PayloadAction<FreindDataList>) => {
			return action.payload
		}
	}
})
export const { getUserInfo } = userInfoSlice.actions
export const { getUserId, initUserId } = userIdSlice.actions
export const { getFriendsList, initFriendList } = FriendListSlice.actions
export const { getFriendsSearchList } = FriendSearchListSlice.actions
export default {
	userInfo: userInfoSlice.reducer,
	userId: userIdSlice.reducer,
	friendList: FriendListSlice.reducer,
	friendSearchList: FriendSearchListSlice.reducer
}

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

export interface WeightData {
	weight: number
	date: string
}

type WeightDataList = WeightData[]
const initialWeightDataList: WeightDataList = []

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
		},
		initUserId: state => {
			state.id = ""
		}
	}
})
const userUuidSlice = createSlice({
	name: "userUuid",
	initialState: "",
	reducers: {
		getUserUuid: (state, action: PayloadAction<string>) => {
			return action.payload
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
		},
		initFriendSearchList: state => {
			return initialStateFriend
		}
	}
})
const SearchInput = createSlice({
	name: "searchInput",
	initialState: "",
	reducers: {
		getSearchInput: (state, action: PayloadAction<string>) => {
			return action.payload
		}
	}
})
const UserWeightSlice = createSlice({
	name: "userWeight",
	initialState: 0,
	reducers: {
		getUserWeight: (state, action: PayloadAction<number>) => {
			return action.payload
		}
	}
})
const WeightDataListSlice = createSlice({
	name: "weightList",
	initialState: initialWeightDataList,
	reducers: {
		getWeightList: (state, action: PayloadAction<WeightDataList>) => {
			return action.payload
		}
	}
})
const WeightDataListWeekSlice = createSlice({
	name: "weightListWeek",
	initialState: initialWeightDataList,
	reducers: {
		getWeightListWeek: (state, action: PayloadAction<WeightDataList>) => {
			return action.payload
		}
	}
})
const PushTokenSlice = createSlice({
	name: "pushToken",
	initialState: "",
	reducers: {
		getPushToken: (state, action: PayloadAction<string>) => {
			return action.payload
		},
		initPushToken: state => {
			return ""
		}
	}
})

export const { getUserInfo } = userInfoSlice.actions
export const { getUserId, initUserId } = userIdSlice.actions
export const { getUserUuid } = userUuidSlice.actions
export const { getFriendsList, initFriendList } = FriendListSlice.actions
export const { getFriendsSearchList, initFriendSearchList } = FriendSearchListSlice.actions
export const { getSearchInput } = SearchInput.actions
export const { getPushToken, initPushToken } = PushTokenSlice.actions
export const { getWeightList } = WeightDataListSlice.actions
export const { getWeightListWeek } = WeightDataListWeekSlice.actions
export const { getUserWeight } = UserWeightSlice.actions
export default {
	userInfo: userInfoSlice.reducer,
	userId: userIdSlice.reducer,
	userUuid: userUuidSlice.reducer,
	friendList: FriendListSlice.reducer,
	friendSearchList: FriendSearchListSlice.reducer,
	seatchInput: SearchInput.reducer,
	pushToken: PushTokenSlice.reducer,
	weight: UserWeightSlice.reducer,
	weightList: WeightDataListSlice.reducer,
	weightListWeek: WeightDataListWeekSlice.reducer
}

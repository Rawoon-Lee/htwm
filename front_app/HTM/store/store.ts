import { configureStore } from "@reduxjs/toolkit"
import userInfoReducer from "./user"
import recordReducer from "./record"
import routineReducer from "./routine"
import pictureReducer from "./picture"
import alarmReducer from "./notice"

export const store = configureStore({
	reducer: {
		userInfo: userInfoReducer.userInfo,
		userId: userInfoReducer.userId,
		userUuid: userInfoReducer.userUuid,
		friendList: userInfoReducer.friendList,
		friendSearchList: userInfoReducer.friendSearchList,
		searchInput: userInfoReducer.seatchInput,
		pushToken: userInfoReducer.pushToken,
		userWeight: userInfoReducer.weight,
		weightList: userInfoReducer.weightList,
		weightListWeek: userInfoReducer.weightListWeek,
		recordList: recordReducer.recordList,
		streamingList: recordReducer.streamingList,
		routineList: routineReducer.routineList,
		picList: pictureReducer.picList,
		alarmList: alarmReducer.alarmList
	}
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

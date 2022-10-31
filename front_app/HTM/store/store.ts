import { configureStore } from "@reduxjs/toolkit"
import userInfoReducer from "./user"
import recordReducer from "./record"

export const store = configureStore({
	reducer: {
		userInfo: userInfoReducer.userInfo,
		userId: userInfoReducer.userId,
		recordList: recordReducer
	}
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

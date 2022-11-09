import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: 'a',
    userInfo: {
      height: 0,
      nickname: '',
      url: '',
    },
    streamingPeer: {
      username: 'b',
      url: '',
    },
  },
  reducers: {
    setUsername(state, action) {
      localStorage.setItem('username', action.payload)
      state.username = action.payload
    },
    setStreamingPeer(state, action) {
      state.streamingPeer = action.payload
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload
    },
  },
})

export const { setUsername, setStreamingPeer, setUserInfo } = userSlice.actions
export const user = userSlice.reducer

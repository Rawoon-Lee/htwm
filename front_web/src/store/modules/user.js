import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: 'b',
    streamingPeer: 'a',
  },
  reducers: {
    setUsername(state, action) {
      localStorage.setItem('username', action.payload)
      state.username = action.payload
    },
    setStreamingPeer(state, action) {
      state.streamingPeer = action.payload
    },
  },
})

export const { setUsername, setStreamingPeer } = userSlice.actions
export const user = userSlice.reducer

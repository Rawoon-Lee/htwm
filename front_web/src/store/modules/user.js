import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: undefined,
  },
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload
    },
  },
})

export const { setCurrentUser } = userSlice.actions
export const user = userSlice.reducer

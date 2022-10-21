import { createSlice } from '@reduxjs/toolkit'

const utilSlice = createSlice({
  name: 'util',
  initialState: {
    client: undefined,
  },
  reducers: {
    setClient(state, action) {
      state.client = action.payload
    },
  },
})

export const { setClient } = utilSlice.actions
export const util = utilSlice.reducer

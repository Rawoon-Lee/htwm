import { createSlice } from '@reduxjs/toolkit'

const utilSlice = createSlice({
  name: 'util',
  initialState: {
    weatherData: {},
    modalMsg: '',
    modalState: false,
  },
  reducers: {
    setWeatherData(state, action) {
      state.weatherData = action.payload
    },
    setModalMsg(state, action) {
      state.modalMsg = action.payload
    },
    setModalState(state, action) {
      state.modalState = action.payload
    },
  },
})

export const { setWeatherData, setModalMsg, setModalState } = utilSlice.actions
export const util = utilSlice.reducer

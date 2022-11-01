import { createSlice } from '@reduxjs/toolkit'

const utilSlice = createSlice({
  name: 'util',
  initialState: {
    weatherData: {},
    client: undefined,
    routineList: [
      {
        name: 'string',
        sets: [
          {
            exercise_id: 0,
            exercise_name: 'string',
            number: 0,
            sec: 0,
            set_cnt: 0,
          },
        ],
        username: 'string',
      },
    ],
    routineDetail: {
      name: 'string',
      sets: [
        {
          exercise_id: 0,
          exercise_name: 'string',
          number: 0,
          sec: 0,
          set_cnt: 0,
        },
      ],
      username: 'string',
    },
    routineResult: {},
  },
  reducers: {
    setWeatherData(state, action) {
      state.weatherData = action.payload
    },
    setClient(state, action) {
      state.client = action.payload
    },
    setRoutineList(state, action) {
      state.routineList = action.payload
    },
    setRoutineDetail(state, action) {
      const newRoutine = { ...action.payload }
      newRoutine.sets = []
      if (action.payload.sets?.length) {
        action.payload.sets.map((set) => {
          const copy = { ...set }
          copy.set_cnt = 0
          newRoutine.sets.push(copy)
        })
      }
      console.log(newRoutine)
      state.routineDetail = newRoutine
    },
    setRoutineResult(state, action) {
      state.routineResult = action.payload
    },
  },
})

export const { setWeatherData, setClient, setRoutineList, setRoutineDetail, setRoutineResult } = utilSlice.actions
export const util = utilSlice.reducer

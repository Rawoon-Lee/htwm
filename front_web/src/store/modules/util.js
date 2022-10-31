import { createSlice } from '@reduxjs/toolkit'

const utilSlice = createSlice({
  name: 'util',
  initialState: {
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
  },
  reducers: {
    setClient(state, action) {
      state.client = action.payload
    },
    setRoutineList(state, action) {
      state.routine = action.payload
    },
    setRoutineDetail(state, action) {
      state.routineDetail = action.payload
    },
  },
})

export const { setClient, setRoutineList, setRoutineDetail } = utilSlice.actions
export const util = utilSlice.reducer

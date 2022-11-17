import { createSlice } from '@reduxjs/toolkit'

const routineSlice = createSlice({
  name: 'routine',
  initialState: {
    routineList: [
      // {
      //   name: '',
      //   sets: [
      //     {
      //       exercise_id: 0,
      //       exercise_name: '',
      //       number: 0,
      //       sec: 0,
      //       set_cnt: 0,
      //     },
      //   ],
      //   color: '',
      //   username: '',
      // },
    ],
    routineDetail: {
      // name: '',
      // sets: [
      //   {
      //     exercise_id: 0,
      //     exercise_name: '',
      //     number: 0,
      //     sec: 0,
      //     set_cnt: 0,
      //   },
      // ],
      // color: '',
      // username: '',
    },
    routineResult: {},
  },
  reducers: {
    setRoutineList(state, action) {
      state.routineList = action.payload
    },
    setRoutineDetail(state, action) {
      const newDetail = {}

      if (action.payload !== -1) {
        const routine = state.routineList[action.payload]
        newDetail.name = routine.name
        newDetail.username = routine.username
        newDetail.sets = []
        if (routine.sets?.length) {
          routine.sets.map((set) => {
            if (set.set_cnt !== 0) {
              for (let i = 0; i < set.set_cnt; i++) {
                const newSet = { ...set }
                newSet.set_cnt = 0
                newDetail.sets.push(newSet)
              }
            } else {
              newDetail.sets.push(set)
            }
          })
        }
      }
      state.routineDetail = newDetail
    },
    setRoutineResult(state, action) {
      state.routineResult = action.payload
    },
  },
})

export const { setRoutineList, setRoutineDetail, setRoutineResult } = routineSlice.actions
export const routine = routineSlice.reducer

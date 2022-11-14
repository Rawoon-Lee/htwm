import { configureStore } from '@reduxjs/toolkit'
import { user } from './modules/user'
import { util } from './modules/util'
import { routine } from './modules/routine'

const store = configureStore({
  reducer: {
    user,
    util,
    routine,
  },
})

export default store

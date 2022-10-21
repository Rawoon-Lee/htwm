import { configureStore } from '@reduxjs/toolkit'
import { user } from './modules/user'
import { util } from './modules/util'

const store = configureStore({
  reducer: {
    user,
    util,
  },
})

export default store

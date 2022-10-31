import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { user } from './modules/user'
import { util } from './modules/util'

const store = configureStore({
  reducer: {
    user,
    util,
  },
  // middleware: getDefaultMiddleware({
  //   serializableCheck: false,
  // }),
})

export default store

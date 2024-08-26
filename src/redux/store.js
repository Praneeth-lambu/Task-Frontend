import { configureStore } from '@reduxjs/toolkit'
import taskSlice from './taskSlice'
import userSlice from './userSlice'
import authSlice from './authSlice'

export const store = configureStore({
  reducer: {tasks: taskSlice,users: userSlice,auth: authSlice},
})
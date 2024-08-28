import { configureStore } from '@reduxjs/toolkit'
import taskSlice from './taskSlice'
import userSlice from './userSlice'
import authSlice from './authSlice'
import commentsSlice from './commentsSlice';
import notificationsSlice from './notificationSlice';


export const store = configureStore({
  reducer: {tasks: taskSlice,users: userSlice,auth: authSlice,comments: commentsSlice, notifications: notificationsSlice },
})
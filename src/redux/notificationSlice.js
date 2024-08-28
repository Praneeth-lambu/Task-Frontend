import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    setNotifications: (state, action) => {
      return action.payload; // Replace notifications with new ones
    },
    removeNotification: (state, action) => {
      return state.filter(notification => notification.id !== action.payload);
    },
    clearNotifications: () => {
      return []; // Clear all notifications
    }
  }
});

export const { setNotifications, removeNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;

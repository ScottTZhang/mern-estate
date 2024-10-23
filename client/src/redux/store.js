import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';

export const store = configureStore({
  reducer: {user: userReducer},
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({serializableCheck: false}),
});
//serializableCheck: to avoid getting an error for not serializing variables
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({user: userReducer});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {user: persistedReducer},
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({serializableCheck: false}),
});
console.log(store.getState());

//reducer: If this is a single function, it will be directly used as the root reducer for the store. If it is an object of slice reducers, like {users : usersReducer, posts : postsReducer}, configureStore will automatically create the root reducer by passing this object to the Redux combineReducers utility.
//middleware: A callback which will receive getDefaultMiddleware as its argument, and should return a middleware array.
//serializableCheck: to avoid getting an error for not serializing variables. A custom middleware that detects if any non-serializable values have been included in state or dispatched actions, modeled after redux-immutable-state-invariant. Any detected non-serializable values will be logged to the console.

export const persistor = persistStore(store);
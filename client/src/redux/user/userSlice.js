import { createSlice } from "@reduxjs/toolkit";

//similar to useState default
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

//The createSlice() function in Redux Toolkit returns an object containing a slice reducer and action creators.
//initialState: undefined;
//name: A string name for this slice of state. Generated action type constants will use this as a prefix.
//reducers: An object containing Redux "case reducer" functions (functions intended to handle a specific action type, equivalent to a single case statement in a switch). The keys in the object will be used to generate string action type constants. Also, if any other part of the application happens to dispatch an action with the exact same type string, the corresponding reducer will be run. Therefore, you should give the functions descriptive names.
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; //data we get
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload; //data we get
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserStart: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    default: () => {
      return state;
    },
  },
});

//createSlice() returns an object containing a slice reducer (todosSlice.reducer) and corresponding auto-generated action creators (todosSlice.actions).
//The action creators are automatically generated and named for each case reducer. The action.type values they return are a combination of the slice name ('todos') and the action name ('addTodo') separated by a forward slash (todos/addTodo).
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess
} = userSlice.actions; // Action creators are generated for each case reducer function
export default userSlice.reducer; //is a code snippet that exports the reducer function for a slice in Redux Toolkit

import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    showMessage(state, action) {
      return action.payload;
    },
  },
});

export const { showMessage } = messageSlice.actions;

export const setNotification = (content, time) => {
  return async (dispatch) => {
    dispatch(showMessage(content));
    setTimeout(() => {
      dispatch(showMessage(null));
    }, time * 1000);
  };
};

export default messageSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const notificationSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    show(state, action) {
      return action.payload;
    },
  },
});

export const { show } = notificationSlice.actions;

export const setNotification = (content, type) => {
  return async (dispatch) => {
    dispatch(show(content, "success"));
    setTimeout(() => {
      dispatch(show(null));
    }, 6000);
  };
};

export default notificationSlice.reducer;

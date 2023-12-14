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
export default messageSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

import blogService from "../services/blogs";
import loginService from "../services/login";

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state, action) {
      return action.payload;
    },
    getUser(state, action) {
      return action.payload;
    },
    loggedUser(state, action) {
      return action.payload;
    },
  },
});

export const { loginUser } = userSlice.actions;

export const logUser = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login(username, password);
    console.log("user", user);

    window.localStorage.setItem("blogUser", JSON.stringify(user));
    blogService.setToken(user.token);

    dispatch(loginUser(user));
  };
};

export const setUser = () => {
  return async (dispatch) => {
    const loggedUser = window.localStorage.getItem("blogUser");
    console.log("logged", loggedUser);
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      blogService.setToken(user);
      dispatch(loggedUser(user));
    }
  };
};

export default userSlice.reducer;

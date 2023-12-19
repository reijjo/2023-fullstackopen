import { createSlice } from "@reduxjs/toolkit";

import blogService from "../services/blogs";

const initialState = [];

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    deleteBlog(state, action) {
      const { id } = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
    likeBlog(state, action) {
      const { id } = action.payload;
      const toLike = state.find((b) => b.id === id);

      const likedBlog = {
        ...toLike,
        likes: toLike.likes + 1,
      };
      return state.map((blog) => (blog.id !== id ? blog : likedBlog));
    },
  },
});

export const { setBlogs, deleteBlog, likeBlog } = blogSlice.actions;

export const initBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog);
    dispatch(deleteBlog(blog));
  };
};

export const likeOne = (blog) => {
  return async (dispatch) => {
    const like = await blogService.like(blog);
    dispatch(likeBlog(like));
  };
};

export default blogSlice.reducer;

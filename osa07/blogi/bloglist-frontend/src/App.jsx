import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initBlogs, likeOne } from "./reducers/blogReducer";
import { setUser } from "./reducers/userReducer";
import { setNotification } from "./reducers/notificationReducer";

import LoginStuff from "./components/LoginStuff";
import Blogs from "./components/Blogs";
import Users from "./components/Users";
import User from "./components/User";
import Blog from "./components/Blog";

import { Container, Button } from "@mui/material";

const App = () => {
  const dispatch = useDispatch();

  const blogs = useSelector(({ blogs }) => {
    return blogs;
  });

  const user = useSelector(({ user }) => {
    return user;
  });

  useEffect(() => {
    dispatch(initBlogs());
    setUser(user);
  }, [dispatch]);

  useEffect(() => {
    setUser(user);
  }, []);

  const addLike = async (blogObject) => {
    try {
      dispatch(likeOne(blogObject));
    } catch (exception) {
      dispatch(setNotification("Error liking blog"));
      console.log(exception);
    }
  };

  const deleteBlog = async (blogObject) => {
    try {
      if (
        window.confirm(`Remove blog ${blogObject.title} ${blogObject.author}`)
      ) {
        dispatch(removeBlog(blogObject));
        dispatch(setNotification(`Deleted blog '${blogObject.title}'`));
      }
    } catch (exception) {
      console.error(exception);
      dispatch(setNotification("Error deleting blog"));
    }
  };

  return (
    <Container>
      <Router>
        <LoginStuff user={user} />
        <Routes>
          <Route path="/" element={<Blogs blogs={blogs} user={user} />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />

          <Route
            path="/blogs/:id"
            element={
              <Blog user={user} likeBlog={addLike} removeBlog={deleteBlog} />
            }
          />
          <Route path="*" element={<Blogs blogs={blogs} user={user} />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;

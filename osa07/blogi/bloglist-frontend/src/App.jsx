import { useState, useEffect, useRef } from "react";
import { setNotification } from "./reducers/notificationReducer";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import { useDispatch, useSelector } from "react-redux";
import { initBlogs, removeBlog, likeOne } from "./reducers/blogReducer";
import { logUser, setUser } from "./reducers/userReducer";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [errorMessage, setErrorMessage] = useState(null);
  const [errorMessageType, setErrorMessageType] = useState("success");

  const blogFormRef = useRef();
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

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);

      dispatch(initBlogs());

      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`
        )
      );

      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      dispatch(setNotification("Error creating blog", exception));
    }
  };

  const addLike = async (blogObject) => {
    try {
      dispatch(likeOne(blogObject));
      // const likedBlog = await blogService.like(blogObject);
      // setBlogs(
      //   blogs.map((blog) => (blog.id === likedBlog.id ? likedBlog : blog))
      // );
    } catch (exception) {
      dispatch(setNotification("Error liking blog", exception));
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
      dispatch(setNotification("Error deleting blog"));
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      dispatch(logUser({ username, password }));

      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("wrong credentials"));
      setErrorMessageType("error");
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {/* <Notification message={errorMessage} type={errorMessageType} /> */}
        <Notification type={errorMessageType} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              id="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              id="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="login-button">
            login
          </button>
        </form>
      </div>
    );
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div id="main">
      <h2>blogs</h2>
      <Notification type={errorMessageType} />
      <p>
        {user.name} logged in
        <button
          onClick={() => {
            window.localStorage.removeItem("blogUser");
            window.location.replace("/");
          }}
        >
          logout
        </button>
      </p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={addLike}
          removeBlog={deleteBlog}
          user={user}
        />
      ))}
    </div>
  );
};

export default App;

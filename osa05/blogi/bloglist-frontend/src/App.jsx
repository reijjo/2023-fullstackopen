import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorMessageType, setErrorMessageType] = useState("success");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("blogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);

      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);

      // setBlogs(blogs.concat(blogObject));
      setBlogs([...blogs, newBlog]);

      setErrorMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);

      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      setErrorMessage("Error creating blog", exception);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const addLike = async (blogObject) => {
    try {
      const likedBlog = await blogService.like(blogObject);
      setBlogs(
        blogs.map((blog) => (blog.id === likedBlog.id ? likedBlog : blog))
      );
    } catch (exception) {
      setErrorMessage("Error liking blog", exception);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const deleteBlog = async (blogObject) => {
    try {
      if (
        window.confirm(`Remove blog ${blogObject.title} ${blogObject.author}`)
      ) {
        const deletedOne = await blogService.remove(blogObject);
        setBlogs(blogs.filter((blog) => blog.id !== blogObject.id));
      }
    } catch (exception) {
      setErrorMessage("Error deleting blog", exception);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("blogUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("wrong credentials");
      setErrorMessageType("error");
      setTimeout(() => {
        setErrorMessage(null);
        setErrorMessageType("success");
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} type={errorMessageType} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type={errorMessageType} />
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

      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={addLike}
          removeBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default App;

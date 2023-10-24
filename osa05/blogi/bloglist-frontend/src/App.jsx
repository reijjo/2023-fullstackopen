import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorMessageType, setErrorMessageType] = useState("success");

  const [user, setUser] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("blogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const addBlog = async (event) => {
    event.preventDefault();

    try {
      const blogObject = await blogService.create(newBlog);

      setBlogs(blogs.concat(blogObject));
      setNewBlog({ title: "", author: "", url: "" });
      setErrorMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage("Error creating blog", exception);
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

  const handleBlog = (event) => {
    const { name, value } = event.target;
    setNewBlog({
      ...newBlog,
      [name]: value,
    });
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
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="test"
            name="title"
            value={newBlog.title}
            onChange={handleBlog}
          />
        </div>
        <div>
          author:
          <input
            type="test"
            name="author"
            value={newBlog.author}
            onChange={handleBlog}
          />
        </div>
        <div>
          url:
          <input
            type="test"
            name="url"
            value={newBlog.url}
            onChange={handleBlog}
          />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setNotification } from "../reducers/notificationReducer";
import { logUser } from "../reducers/userReducer";

import Notification from "./Notification";
import Navbar from "./Navbar";

const LoginStuff = ({ user }) => {
  const [errorMessageType, setErrorMessageType] = useState("success");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

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
              autoComplete="off"
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
              autoComplete="off"
            />
          </div>
          <button type="submit" id="login-button">
            login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div id="main">
      <h2>blogs</h2>
      <Notification type={errorMessageType} />

      <Navbar user={user} />
    </div>
  );
};

export default LoginStuff;

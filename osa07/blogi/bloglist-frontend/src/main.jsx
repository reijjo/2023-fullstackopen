import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./Store";
import App from "./App";
import "./index.css";

console.log("store state", store.getState());

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

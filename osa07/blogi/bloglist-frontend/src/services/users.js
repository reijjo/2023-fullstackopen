import axios from "axios";
const baseUrl = "/api/users";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const req = axios.get(baseUrl);
  return req.then((res) => res.data);
};

const getOne = (id) => {
  const req = axios.get(`${baseUrl}/${id}`);
  return req.then((res) => res.data);
};

const userService = {
  setToken,
  getAll,
  getOne,
};

export default userService;

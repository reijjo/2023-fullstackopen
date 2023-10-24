import axios from "axios";
const baseUrl = "/api/notes";
// const baseUrl = "http://localhost:3001/api/notes";
let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  console.log("TOKEN", token);
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log("config", config);

  const response = await axios.post(baseUrl, newObject, config);
  console.log("create note response", response);
  return response.data;
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  update,
  setToken,
};

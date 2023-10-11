import axios from "axios";
const baseUrl = "/api/persons";
// const baseUrl = "http://localhost:3001/api/persons";

const getAll = () => {
  const req = axios.get(baseUrl);
  return req.then((response) => response.data);
};

const create = (newPerson) => {
  const req = axios.post(baseUrl, newPerson);
  return req.then((response) => response.data);
};

const deleteUser = (id) => {
  const req = axios.delete(`${baseUrl}/${id}`);
  return req.then((response) => response.data);
};

const updateUser = (id, update) => {
  const req = axios.put(`${baseUrl}/${id}`, update);
  return req.then((response) => response.data);
};

export default {
  getAll,
  create,
  deleteUser,
  updateUser,
};

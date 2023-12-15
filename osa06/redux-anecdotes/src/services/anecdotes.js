import axios from "axios";

const baseURL = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseURL);
  return response.data;
};

const createNew = async (content) => {
  const object = { content, votes: 0 };
  const response = await axios.post(baseURL, object);
  return response.data;
};

const getOne = async (id) => {
  const response = await axios.get(`${baseURL}/${id}`);
  return response.data;
};

const vote = async (id, object) => {
  const voted = { ...object, votes: object.votes + 1 };
  const response = await axios.put(`${baseURL}/${id}`, voted);
  return response.data;
};

const anecdoteAPI = {
  getAll,
  createNew,
  getOne,
  vote,
};

export default anecdoteAPI;

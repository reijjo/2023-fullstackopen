import { createSlice } from "@reduxjs/toolkit";
import anecdoteAPI from "../services/anecdotes";

const initialState = [];

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const { id } = action.payload;
      const toVote = state.find((a) => a.id === id);
      const votedAnecdote = {
        ...toVote,
        votes: toVote.votes + 1,
      };
      return state.map((anec) => (anec.id !== id ? anec : votedAnecdote));
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
  },
});

export const { voteAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const initAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteAPI.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteAPI.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const addVote = (id) => {
  return async (dispatch) => {
    const toVote = await anecdoteAPI.getOne(id);
    const vote = await anecdoteAPI.vote(id, toVote);
    dispatch(voteAnecdote(vote));
  };
};

export default anecdoteSlice.reducer;

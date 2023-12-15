import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload;
      const toVote = state.find((a) => a.id === id);
      const votedAnecdote = {
        ...toVote,
        votes: toVote.votes + 1,
      };
      return state.map((anec) => (anec.id !== id ? anec : votedAnecdote));
    },
    createAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

// const reducer = (state = initialState, action) => {
//   console.log("ACTION ", action);

//   switch (action.type) {
//     case "VOTE": {
//       const id = action.payload.id;
//       const toVote = state.find((a) => a.id === id);
//       const votedAnecdote = {
//         ...toVote,
//         votes: toVote.votes + 1,
//       };
//       return state.map((anec) => (anec.id !== id ? anec : votedAnecdote));
//     }
//     case "ADD":
//       return [...state, action.payload];

//     default:
//       return state;
//   }
// };

// export const voteAnecdote = (id) => {
//   return {
//     type: "VOTE",
//     payload: { id },
//   };
// };

// export const createAnecdote = (content) => {
//   return {
//     type: "ADD",
//     payload: {
//       content,
//       id: getId(),
//       votes: 0,
//     },
//   };
// };

export const { voteAnecdote, createAnecdote, setAnecdotes } =
  anecdoteSlice.actions;
export default anecdoteSlice.reducer;

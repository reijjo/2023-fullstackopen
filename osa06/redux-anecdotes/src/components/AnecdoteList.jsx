import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === "ALL") {
      return anecdotes;
    }

    return anecdotes.filter((anec) => anec.content.includes(filter));
  });

  const vote = (id) => {
    dispatch(voteAnecdote(id));
  };

  const mostVotes = (anec) => {
    return anec.sort((a, b) => b.votes - a.votes);
  };

  return (
    <>
      {anecdotes &&
        mostVotes(anecdotes).map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </>
  );
};

export default AnecdoteList;

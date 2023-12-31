import { useSelector, useDispatch } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/messageReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === "ALL") {
      return anecdotes;
    }

    return anecdotes.filter((anec) => anec.content.includes(filter));
  });

  const vote = (id, content) => {
    dispatch(addVote(id));

    dispatch(setNotification(`You voted '${content}'`, 10));
  };

  const mostVotes = (anec) => {
    return [...anec].sort((a, b) => b.votes - a.votes);
  };

  return (
    <>
      {anecdotes &&
        mostVotes(anecdotes).map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id, anecdote.content)}>
                vote
              </button>
            </div>
          </div>
        ))}
    </>
  );
};

export default AnecdoteList;

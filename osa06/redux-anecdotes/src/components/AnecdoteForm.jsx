import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { showMessage } from "../reducers/messageReducer";
import anecdoteAPI from "../sevices/anecdotes";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    const newAnecdote = await anecdoteAPI.createNew(content);
    dispatch(createAnecdote(newAnecdote));

    dispatch(showMessage(`New anecdote created: '${content}'`));

    setTimeout(() => {
      dispatch(showMessage(null));
    }, 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;

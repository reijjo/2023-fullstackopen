const PersonForm = ({
  addName,
  handleNewName,
  newName,
  handleNewNumber,
  newNumber,
}) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input onChange={handleNewName} value={newName} />
      </div>
      <div>
        number: <input onChange={handleNewNumber} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;

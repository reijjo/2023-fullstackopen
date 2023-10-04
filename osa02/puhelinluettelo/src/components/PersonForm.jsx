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
        name: <input name="new-name" onChange={handleNewName} value={newName} />
      </div>
      <div>
        number:{" "}
        <input name="new-number" onChange={handleNewNumber} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;

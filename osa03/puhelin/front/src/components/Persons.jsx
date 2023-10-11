const Persons = ({ persons, filter, delPerson }) => {
  const filtered =
    filter === ""
      ? persons
      : persons.filter((person) => person.name.toLowerCase().includes(filter));

  return (
    <>
      {filtered.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}
          <button onClick={() => delPerson(person.id)}>delete</button>
        </p>
      ))}
    </>
  );
};

export default Persons;

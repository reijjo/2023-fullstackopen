import { useState, useEffect } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState("success");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    const findPerson = persons.find(
      (person) => person.name === personObject.name
    );

    if (findPerson) {
      const updated = { ...findPerson, number: newNumber };
      if (
        window.confirm(
          `${personObject.name} is already added to phonebook, replace to old number with a new one?`
        )
      ) {
        personService
          .updateUser(findPerson.id, updated)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== findPerson.id ? person : returnedPerson
              )
            );
            setNotificationMessage(`Updated ${findPerson.name} number`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setNotificationMessage(
              `Information of ${findPerson.name} has already been removed from server`
            );
            setNotificationType("error");
            setTimeout(() => {
              setNotificationMessage(null);
              setNotificationType("success");
            }, 5000);
          });

        setNewName("");
        setNewNumber("");
      } else {
        return;
      }

      // alert(`${personObject.name} is already added to phonebook `);
    } else {
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNotificationMessage(`Added ${personObject.name}`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      });
      setNewName("");
      setNewNumber("");
    }
  };

  const deletePerson = (id) => {
    const personName = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${personName.name} ?`))
      personService.deleteUser(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setNotificationMessage(`Deleted ${personName.name}`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      });
  };

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} />

      <Filter handleFilter={handleFilter} filter={filter} />

      <h2>add a new</h2>

      <PersonForm
        addName={addName}
        handleNewName={handleNewName}
        newName={newName}
        handleNewNumber={handleNewNumber}
        newNumber={newNumber}
      />

      <h2>Numbers</h2>

      <Persons persons={persons} filter={filter} delPerson={deletePerson} />
    </div>
  );
};

export default App;

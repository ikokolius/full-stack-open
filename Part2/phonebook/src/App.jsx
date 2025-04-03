import { useState, useEffect } from 'react';
import personsService from './services/persons.js';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Persons from './components/Persons';
import Notification from './components/Notification.jsx';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState({
    message: null,
    type: 'success',
  });

  const filteredPersons =
    search === ''
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialPersons = await personsService.getAll();
        setPersons(initialPersons);
      } catch (e) {
        console.error(e.message);
      }
    };

    fetchData();
  }, []);

  const handleNewNameChange = (value) => {
    setNewName(value);
  };

  const handleNewNumberChange = (value) => {
    setNewNumber(value);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const resetForm = () => {
    setNewName('');
    setNewNumber('');
  };

  const showNotificationTemporarily = (message, type, time = 5000) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ ...notification, message: null });
    }, time);
  };

  const updateNumber = (personToUpdate) => {
    const changedPerson = { ...personToUpdate, number: newNumber };

    personsService
      .updatePerson(personToUpdate.id, changedPerson)
      .then((returnedPerson) => {
        setPersons(
          persons.map((p) => (p.id === returnedPerson.id ? returnedPerson : p))
        );
        resetForm();
      })
      .catch((e) => {
        const message =
          e.status === 404
            ? `Information of ${personToUpdate.name} has already been removed from server`
            : 'Something went wrong';

        showNotificationTemporarily(message, 'error');
        if (e.status === 404) {
          setPersons(persons.filter((p) => p.id !== personToUpdate.id));
          resetForm();
        }
      });
  };

  const actOnDuplicate = (duplicatePerson) => {
    if (newNumber !== '') {
      const replace = confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (replace) {
        updateNumber(duplicatePerson);
      }
    } else {
      alert(`${newName} is already added to phonebook`);
    }
  };

  const addPerson = (e) => {
    e.preventDefault();
    if (!newName) {
      alert('Please provide a name');
      return;
    }

    const duplicatePerson = persons.find((p) => p.name === newName);

    if (duplicatePerson) {
      actOnDuplicate(duplicatePerson);
      return;
    }

    const newPerson = {
      id: String(Number(persons.at(-1).id) + 1),
      name: newName,
      number: newNumber,
    };

    personsService
      .createPerson(newPerson)
      .then((createdPerson) => {
        showNotificationTemporarily(`Added ${newPerson.name}`, 'success');
        setPersons(persons.concat(createdPerson));
        resetForm();
      })
      .catch((e) => {
        showNotificationTemporarily(`Failed saving ${newPerson.name}`, 'error');
        console.error(e);
      });
  };

  const deletePerson = async (id) => {
    try {
      const response = await personsService.deletePerson(id);
      setPersons(persons.filter((p) => p.id !== response.id));
    } catch (e) {
      const person = persons.find((p) => p.id === id);
      showNotificationTemporarily(`Failed deleting ${person.name}`, 'error');
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter search={search} onSearchChange={handleSearchChange} />
      <h3>Add new contact</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNewNameChange}
        onNumberChange={handleNewNumberChange}
        onSubmit={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDelete={deletePerson} />
    </div>
  );
};

export default App;

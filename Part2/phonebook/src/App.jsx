import { useState } from 'react';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Persons from './components/Persons';

const dummyContacts = [
  { name: 'Arto Hellas', number: '040-123456', id: 1 },
  { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
  { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
  { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
];

const App = () => {
  const [persons, setPersons] = useState(dummyContacts);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  const filteredPersons =
    search === ''
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );

  const handleNewNameChange = (value) => {
    setNewName(value);
  };

  const handleNewNumberChange = (value) => {
    setNewNumber(value);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const addContact = (e) => {
    e.preventDefault();

    if (persons.findIndex((p) => p.name === newName) !== -1) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    setPersons(
      persons.concat({
        id: persons.length + 1,
        name: newName,
        number: newNumber,
      })
    );
    setNewName('');
    setNewNumber('');
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} onSearchChange={handleSearchChange} />
      <h3>Add new contact</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNewNameChange}
        onNumberChange={handleNewNumberChange}
        onClick={addContact}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} />
    </div>
  );
};

export default App;

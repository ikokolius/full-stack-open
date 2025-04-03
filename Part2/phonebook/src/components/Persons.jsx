import Person from './Person';

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          <Person person={person} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
};

export default Persons;

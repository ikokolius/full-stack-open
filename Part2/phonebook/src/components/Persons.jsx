import Person from './Person';

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          <Person name={person.name} number={person.number} />
        </div>
      ))}
    </div>
  );
};

export default Persons;

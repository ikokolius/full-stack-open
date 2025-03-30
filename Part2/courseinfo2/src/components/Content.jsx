import Part from './Part';

const Content = ({ parts }) => {
  const total = parts.reduce((acc, val) => acc + val.exercises, 0);

  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
      <p>
        <b>total of {total} exercises</b>
      </p>
    </div>
  );
};

export default Content;

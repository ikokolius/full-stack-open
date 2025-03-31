const PersonForm = ({
  newName,
  newNumber,
  onNameChange,
  onNumberChange,
  onClick,
}) => {
  return (
    <form>
      <div>
        <label htmlFor="name">name: </label>
        <input
          id="name"
          name="name"
          autoComplete="on"
          value={newName}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="number">phone: </label>
        <input
          id="number"
          name="number"
          autoComplete="on"
          value={newNumber}
          onChange={(e) => onNumberChange(e.target.value)}
        />
      </div>
      <div>
        <button onClick={(e) => onClick(e)} type="submit">
          add
        </button>
      </div>
    </form>
  );
};

export default PersonForm;

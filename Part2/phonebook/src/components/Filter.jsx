const Filter = ({ search, onSearchChange }) => {
  return (
    <div>
      <label htmlFor="name">search: </label>
      <input
        id="search"
        name="search"
        autoComplete="on"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default Filter;

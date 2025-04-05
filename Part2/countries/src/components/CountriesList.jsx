const CountriesList = ({ countries, onClick }) => {
  if (countries.length === 0) return null;
  return countries.map((c) => {
    return (
      <div key={c}>
        {c}{' '}
        <button
          type="button"
          onClick={() => {
            onClick(c);
          }}
        >
          Show
        </button>
      </div>
    );
  });
};

export default CountriesList;

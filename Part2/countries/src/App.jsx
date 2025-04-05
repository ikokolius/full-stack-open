import { useEffect, useState } from 'react';
import axios from 'axios';
import CountriesList from './components/CountriesList';
import Country from './components/Country';

function App() {
  const [countriesAll, setCountriesAll] = useState([]);
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const request = await axios.get(
          'https://studies.cs.helsinki.fi/restcountries/api/all'
        );
        setCountriesAll(request.data);
      } catch (e) {
        console.error(e);
      }
    };
    getData();
  }, []);

  const getWeather = async (city) => {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
          import.meta.env.VITE_OPEN_WEATHER_KEY
        }`
      );
      setWeather(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const showCountry = (name) => {
    const country = countriesAll.find((c) => c.name.common === name);
    setCountry(country);
    getWeather(country.capital);
  };

  const findCountries = (value) => {
    setSearch(value);
    setCountry(null);
    setCountries([]);
    const countries = countriesAll.filter((c) =>
      c.name.common.toLowerCase().includes(value.toLowerCase())
    );
    if (countries.length === 1) {
      showCountry(countries[0].name.common);
    } else {
      setCountries(countries.map((c) => c.name.common));
    }
  };

  return (
    <div>
      <h1>Countries</h1>
      <div>
        <label htmlFor="search">find countries </label>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(e) => findCountries(e.target.value)}
        />
      </div>
      <br />
      {country ? (
        <Country country={country} weather={weather} />
      ) : countries.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : (
        <CountriesList countries={countries} onClick={showCountry} />
      )}
    </div>
  );
}

export default App;

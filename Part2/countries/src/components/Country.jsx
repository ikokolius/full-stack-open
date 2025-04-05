import Utils from '../utils/utils.js';

const Country = ({ country, weather }) => {
  if (!country) return null;
  if (weather) {
    console.log('weather object', weather);
  }

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>Capital {country.capital[0]}</div>
      <div>
        Area {country.area} km<sup>2</sup>
      </div>
      <div>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
      </div>
      <img src={country.flags.svg} alt={country.flags.alt} width="200" />
      {weather && (
        <>
          <h3>Weather in {country.capital[0]}</h3>
          <div>Temperature {weather.main.temp} Celsius</div>
          <h4>Current weather conditions</h4>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          ></img>
          <div>{Utils.capitalize(weather.weather[0].description)}</div>
          <div>Wind {weather.wind.speed} m/s</div>
        </>
      )}
    </div>
  );
};

export default Country;

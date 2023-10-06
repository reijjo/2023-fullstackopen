import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [value, setValue] = useState("");
  const [all, setAll] = useState(null);
  const [countries, setCountries] = useState([]);
  const [theCountry, setTheCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const countryAPI = "https://studies.cs.helsinki.fi/restcountries/api";
  const weatherAPIKEY = import.meta.env.VITE_SOME_KEY;

  const getWeather = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${theCountry.latlng[0]}&lon=${theCountry.latlng[1]}&appid=${weatherAPIKEY}`
      )
      .then((response) => {
        setWeather(response.data);
      });
  };

  useEffect(() => {
    console.log("getting countries...");
    axios.get(`${countryAPI}/all`).then((response) => {
      setAll(response.data);
    });
  }, []);

  useEffect(() => {
    if (value) {
      const filtered = all.filter((maat) =>
        maat.name.common.toLowerCase().includes(value.toLowerCase())
      );
      setCountries(filtered);
    } else {
      setCountries([]);
    }
  }, [value]);

  useEffect(() => {
    if (countries.length === 1) {
      setTheCountry(countries[0]);
    } else {
      setTheCountry(null);
    }
  }, [countries]);

  useEffect(() => {
    if (theCountry) {
      getWeather();
    }
  }, [theCountry]);

  if (!all) {
    return <h1>Loading...</h1>;
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const showCountry = (name) => {
    setTheCountry(name);
  };

  return (
    <div>
      find countries{" "}
      <input
        type="text"
        onChange={handleChange}
        onFocus={() => {
          if (countries.length > 1) {
            setTheCountry(null);
          }
        }}
      />
      {/* If too many countries */}
      {countries.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : theCountry && weather ? (
        // Only one
        <>
          <h1>{theCountry.name.common}</h1>
          <div>capital {theCountry.capital}</div>
          <div>area {theCountry.area}</div>

          <h3>languages:</h3>
          <ul>
            {Object.values(theCountry.languages).map((lang, index) => (
              <li key={index}>{lang}</li>
            ))}
          </ul>

          <img src={theCountry.flags.svg} alt="flag" height="150px" />

          <h3>Weather in {theCountry.capital}</h3>
          <div>temparature {weather.main.temp} Celcius</div>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather"
            height="150px"
          />

          <div>wind {weather.wind.speed} m/s</div>
        </>
      ) : (
        // Under 10
        <>
          {countries.map((maat) => (
            <div key={maat.cca2}>
              {maat.name.common}
              <button onClick={() => showCountry(maat)}>show</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default App;

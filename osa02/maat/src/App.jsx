import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [value, setValue] = useState("");
  const [all, setAll] = useState(null);
  const [countries, setCountries] = useState([]);
  const [theCountry, setTheCountry] = useState(null);

  const countryAPI = "https://studies.cs.helsinki.fi/restcountries/api";

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

  if (!all) {
    return <h1>Loading...</h1>;
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  console.log("Countries", countries);
  console.log("THE", theCountry);

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
      ) : theCountry ? (
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

          <img src={theCountry.flags.svg} alt="flag" height="200px" />
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

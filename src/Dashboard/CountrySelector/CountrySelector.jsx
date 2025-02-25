import React, { useEffect, useState } from 'react';

const CountrySelector = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const countryNames = data.map(country => country.name.common).sort();
        setCountries(countryNames);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const fetchStates = (country) => {
    fetch(`https://countriesnow.space/api/v0.1/countries/states`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: country })
    })
      .then(response => response.json())
      .then(data => {
        setStates(data.data.states.map(state => state.name) || []);
      })
      .catch(error => console.error('Error fetching states:', error));
  };

  const fetchCities = (country, state) => {
    fetch(`https://countriesnow.space/api/v0.1/countries/state/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: country, state: state })
    })
      .then(response => response.json())
      .then(data => {
        setCities(data.data || []);
      })
      .catch(error => console.error('Error fetching cities:', error));
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setStates([]);
    setSelectedState('');
    setCities([]);
    setSelectedCity('');
    if (country) fetchStates(country);
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setCities([]);
    setSelectedCity('');
    if (selectedCountry && state) fetchCities(selectedCountry, state);
  };

  return (
    <div>
      <label htmlFor="country">Select a country:</label>
      <select id="country" value={selectedCountry} onChange={handleCountryChange}>
        <option value="">-- Select a country --</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>{country}</option>
        ))}
      </select>
      
      {states.length > 0 && (
        <div>
          <label htmlFor="state">Select a state:</label>
          <select id="state" value={selectedState} onChange={handleStateChange}>
            <option value="">-- Select a state --</option>
            {states.map((state, index) => (
              <option key={index} value={state}>{state}</option>
            ))}
          </select>
        </div>
      )}
      
      {cities.length > 0 && (
        <div>
          <label htmlFor="city">Select a city:</label>
          <select id="city" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
            <option value="">-- Select a city --</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;

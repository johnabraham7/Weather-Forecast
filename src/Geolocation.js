import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GeolocationComponent = () => {
  const [location, setLocation] = useState({});
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    const getWeatherData = async (location) => {
      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            units: 'metric',
            appid: '66346c83c575a80649c31b96fa0ff5b6', // Replace with your OpenWeatherMap API key
            lat: location.latitude,
            lon: location.longitude,
          },
        });

        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    if (location.latitude && location.longitude) {
      getWeatherData(location);
    }
  }, [location]);

  return (
    <div>
      {location.latitude && location.longitude ? (
        <div>
          <p>
            Latitude: {location.latitude} <br />
            Longitude: {location.longitude}
          </p>
          {weather ? (
            <p>
              Weather: {weather.weather[0].description} <br />
              Temperature: {weather.main.temp}°C
            </p>
          ) : (
            <p>Fetching weather data...</p>
          )}
        </div>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default GeolocationComponent;
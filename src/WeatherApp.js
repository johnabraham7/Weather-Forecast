import React, { useState, useEffect } from "react";
import { getCurrentWeather, getFiveDayForecast } from "./api";
import "./WeatherApp.css";

function WeatherApp() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState([]);
  const [bgClass, setBgClass] = useState("default-bg");

  // Parse location input to extract latitude and longitude
  const parseCoordinates = (input) => {
    try {
      // Handle formats like "17.3380° N, 78.3826° E"
      const regex = /([-+]?\d{1,2}\.\d+)[°\s]?\s*([NS])?,?\s*([-+]?\d{1,3}\.\d+)[°\s]?\s*([EW])?/i;
      const match = input.match(regex);

      if (match) {
        const lat = parseFloat(match[1]) * (match[2]?.toUpperCase() === "S" ? -1 : 1); // Convert South to negative
        const lon = parseFloat(match[3]) * (match[4]?.toUpperCase() === "W" ? -1 : 1); // Convert West to negative
        return { lat, lon };
      }

      // Handle plain "latitude, longitude" format
      const [lat, lon] = input.split(",").map((coord) => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lon)) {
        return { lat, lon };
      }

      throw new Error("Invalid coordinates format");
    } catch (error) {
      alert("Invalid coordinates format. Please enter valid latitude and longitude.");
      return null;
    }
  };

  const fetchWeather = async () => {
    const coords = parseCoordinates(location);
    if (!coords) return;
  
    try {
      const { lat, lon } = coords;
  
      // Fetch current weather and forecast
      const currentWeather = await getCurrentWeather(lat, lon);
      const forecast = await getFiveDayForecast(lat, lon);
  
      setWeatherData(currentWeather); // Set current weather
  
      // Filter forecast data to get one entry per day (e.g., 12:00 PM)
      const dailyForecast = forecast.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecastData(dailyForecast); // Set filtered forecast data
  
      // Update background class based on weather
      const weatherCondition = currentWeather.weather[0].main.toLowerCase();
      if (weatherCondition.includes("clear")) setBgClass("clear-bg");
      else if (weatherCondition.includes("clouds")) setBgClass("cloudy-bg");
      else if (weatherCondition.includes("rain")) setBgClass("rain-bg");
      else if (weatherCondition.includes("snow")) setBgClass("snow-bg");
      else if (weatherCondition.includes("thunder")) setBgClass("thunder-bg");
      else if (weatherCondition.includes("drizzle")) setBgClass("drizzle-bg");
      else if (weatherCondition.includes("mist")) setBgClass("mist-bg");
      else setBgClass("default-bg");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data. Please try again.");
    }
  };
  

  useEffect(() => {
    if (weatherData && Object.keys(weatherData).length > 0) {
      document.title = `Weather: ${weatherData.name}`;
    }
  }, [weatherData]);

  return (
    <div className={`app-container ${bgClass}`}>
      <h1>Weather Forecast</h1>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter latitude, longitude (e.g., 17.3380° N, 78.3826° E)"
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {weatherData.main && (
        <div className="weather-info">
          <h2>Current Weather</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      )}

      {forecastData.length > 0 && (
        <div className="forecast">
          <h2>5-Day Forecast</h2>
          <div className="forecast-list">
            {forecastData.map((item, index) => (
              <div className="forecast-item" key={index}>
                <p>{item.dt_txt.split(" ")[0]}</p>
                <p>{item.weather[0].description}</p>
                <p>Temp: {item.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;

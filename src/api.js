import axios from "axios";

const api = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5/",
  params: {
    units: "metric", // Change to 'imperial' if you want Fahrenheit
    appid: "66346c83c575a80649c31b96fa0ff5b6", // Replace with your OpenWeatherMap API key
  },
});

export async function getCurrentWeather(lat, lon) {
  const response = await api.get("weather", {
    params: { lat, lon },
  });
  return response.data;
}

export async function getFiveDayForecast(lat, lon) {
  const response = await api.get("forecast", {
    params: { lat, lon },
  });
  return response.data;
}
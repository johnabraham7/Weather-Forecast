import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import WeatherApp from './WeatherApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WeatherApp />
  </React.StrictMode>
);

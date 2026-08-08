const express = require('express');
const axios = require('axios');
const router = express.Router();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'your_openweather_api_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ============ GET WEATHER BY CITY ============
router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    const { main, weather, wind, clouds, sys } = response.data;
    
    res.json({
      city: response.data.name,
      country: sys.country,
      temperature: main.temp,
      feelsLike: main.feels_like,
      tempMin: main.temp_min,
      tempMax: main.temp_max,
      humidity: main.humidity,
      pressure: main.pressure,
      description: weather[0].description,
      windSpeed: wind.speed,
      cloudiness: clouds.all,
      sunrise: new Date(sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(sys.sunset * 1000).toLocaleTimeString(),
      msg: '✅ Weather data fetched successfully'
    });
  } catch (err) {
    if (err.response?.status === 404) {
      res.status(404).json({ error: '❌ City not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// ============ GET WEATHER BY COORDINATES ============
router.get('/coordinates/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    const response = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    const { main, weather, wind, clouds, sys } = response.data;
    
    res.json({
      city: response.data.name,
      country: sys.country,
      temperature: main.temp,
      feelsLike: main.feels_like,
      tempMin: main.temp_min,
      tempMax: main.temp_max,
      humidity: main.humidity,
      pressure: main.pressure,
      description: weather[0].description,
      windSpeed: wind.speed,
      cloudiness: clouds.all,
      latitude: lat,
      longitude: lon,
      msg: '✅ Weather data fetched successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET FORECAST ============
router.get('/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    const forecasts = response.data.list.slice(0, 8).map(item => ({
      date: new Date(item.dt * 1000).toLocaleString(),
      temperature: item.main.temp,
      description: item.weather[0].description,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed
    }));
    
    res.json({
      city: response.data.city.name,
      country: response.data.city.country,
      forecasts,
      msg: '✅ Forecast data fetched successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

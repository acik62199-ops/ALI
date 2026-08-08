import React, { useState } from 'react';
import axios from 'axios';

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`/api/weather/city/${city}`),
        axios.get(`/api/weather/forecast/${city}`)
      ]);
      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
    } catch (err) {
      setError('❌ City not found or API error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">🌤️ Weather Dashboard</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 p-3 rounded-lg text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? '🔄 Loading...' : '🔍 Search'}
            </button>
          </div>
        </form>

        {error && <div className="text-white text-center mb-4 bg-red-500 p-3 rounded">{error}</div>}

        {weather && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-3xl font-bold mb-4">{weather.city}, {weather.country}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-gray-600">Temperature</p>
                <p className="text-2xl font-bold">{weather.temperature}°C</p>
              </div>
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-gray-600">Feels Like</p>
                <p className="text-2xl font-bold">{weather.feelsLike}°C</p>
              </div>
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-gray-600">Humidity</p>
                <p className="text-2xl font-bold">{weather.humidity}%</p>
              </div>
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-gray-600">Wind Speed</p>
                <p className="text-2xl font-bold">{weather.windSpeed} m/s</p>
              </div>
            </div>
            <p className="text-lg capitalize text-gray-700">📍 {weather.description}</p>
            <p className="text-sm text-gray-500 mt-2">Sunrise: {weather.sunrise} | Sunset: {weather.sunset}</p>
          </div>
        )}

        {forecast && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4">📅 5-Day Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {forecast.forecasts.map((f, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded">
                  <p className="font-bold text-sm">{f.date}</p>
                  <p className="text-2xl font-bold mt-2">{f.temperature}°C</p>
                  <p className="capitalize text-sm text-gray-700">{f.description}</p>
                  <p className="text-xs text-gray-600 mt-2">💧 {f.humidity}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;
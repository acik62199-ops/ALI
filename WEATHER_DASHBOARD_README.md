# 🌤️ Weather Dashboard API

Real-time weather data and forecasts using OpenWeather API.

## Setup

1. Get API Key from [OpenWeatherMap](https://openweathermap.org/api)
2. Add to `.env`:
```
WEATHER_API_KEY=your_api_key_here
```

## Endpoints

### Get Weather by City
```bash
GET /api/weather/city/London
```
Response:
```json
{
  "city": "London",
  "country": "GB",
  "temperature": 15.2,
  "feelsLike": 14.8,
  "humidity": 72,
  "windSpeed": 4.5,
  "description": "Partly cloudy",
  "sunrise": "06:30:00 AM",
  "sunset": "08:45:00 PM"
}
```

### Get Weather by Coordinates
```bash
GET /api/weather/coordinates/51.5074/-0.1278
```

### Get 5-Day Forecast
```bash
GET /api/weather/forecast/Paris
```

## Test It
```bash
curl http://localhost:5000/api/weather/city/NewYork
```

✅ **Setup Complete!**
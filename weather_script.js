// Weather App JavaScript
// Using OpenWeatherMap API

const API_KEY = 'fe88e1e059e20be152bd5943379fa6c7'; // Demo API key
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const weatherData = document.getElementById('weatherData');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Load default city (London)
    fetchWeatherByCity('London');

    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    locationBtn.addEventListener('click', handleLocationClick);
});

// Handle search button click
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        showError('Please enter a city name');
    }
}

// Handle location button click
function handleLocationClick() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                hideLoading();
                showError('Unable to retrieve your location. Please enter a city manually.');
            }
        );
    } else {
        showError('Geolocation is not supported by your browser');
    }
}

// Fetch weather by city name
async function fetchWeatherByCity(city) {
    showLoading();
    hideError();

    try {
        // Fetch current weather
        const weatherResponse = await fetch(
            `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        );

        if (!weatherResponse.ok) {
            throw new Error('City not found');
        }

        const weatherDataJson = await weatherResponse.json();

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `${API_BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        );

        const forecastDataJson = await forecastResponse.json();

        displayWeather(weatherDataJson, forecastDataJson);
    } catch (error) {
        hideLoading();
        showError(error.message === 'City not found' ? 
            'City not found. Please check the spelling and try again.' : 
            'Failed to fetch weather data. Please try again later.');
    }
}

// Fetch weather by coordinates
async function fetchWeatherByCoordinates(lat, lon) {
    try {
        // Fetch current weather
        const weatherResponse = await fetch(
            `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        const weatherDataJson = await weatherResponse.json();

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        const forecastDataJson = await forecastResponse.json();

        displayWeather(weatherDataJson, forecastDataJson);
    } catch (error) {
        hideLoading();
        showError('Failed to fetch weather data. Please try again later.');
    }
}

// Display weather data
function displayWeather(currentWeather, forecastData) {
    hideLoading();
    hideError();

    // Update city name and date
    document.getElementById('cityName').textContent = 
        `${currentWeather.name}, ${currentWeather.sys.country}`;
    
    const date = new Date();
    document.getElementById('date').textContent = 
        date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

    // Update temperature
    document.getElementById('temperature').textContent = 
        Math.round(currentWeather.main.temp);

    // Update weather icon and description
    const iconCode = currentWeather.weather[0].icon;
    document.getElementById('weatherIcon').src = 
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weatherDescription').textContent = 
        currentWeather.weather[0].description;

    // Update weather details
    document.getElementById('windSpeed').textContent = 
        `${Math.round(currentWeather.wind.speed * 3.6)} km/h`;
    document.getElementById('humidity').textContent = 
        `${currentWeather.main.humidity}%`;
    document.getElementById('feelsLike').textContent = 
        `${Math.round(currentWeather.main.feels_like)}°C`;
    document.getElementById('pressure').textContent = 
        `${currentWeather.main.pressure} hPa`;
    document.getElementById('visibility').textContent = 
        `${(currentWeather.visibility / 1000).toFixed(1)} km`;
    document.getElementById('cloudiness').textContent = 
        `${currentWeather.clouds.all}%`;

    // Update sunrise and sunset
    document.getElementById('sunrise').textContent = 
        formatTime(currentWeather.sys.sunrise, currentWeather.timezone);
    document.getElementById('sunset').textContent = 
        formatTime(currentWeather.sys.sunset, currentWeather.timezone);

    // Display forecast
    displayForecast(forecastData);

    // Show weather data
    weatherData.classList.add('show');
}

// Display 5-day forecast
function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    // Get one forecast per day (at 12:00)
    const dailyForecasts = forecastData.list.filter(item => 
        item.dt_txt.includes('12:00:00')
    ).slice(0, 5);

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <div class="forecast-date" style="font-size: 0.9em; opacity: 0.8;">${dateStr}</div>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" 
                 alt="${forecast.weather[0].description}" 
                 class="forecast-icon">
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

// Format Unix timestamp to time string
function formatTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        hideError();
    }, 5000);
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('show');
}

// Show loading indicator
function showLoading() {
    loading.classList.add('show');
    weatherData.classList.remove('show');
}

// Hide loading indicator
function hideLoading() {
    loading.classList.remove('show');
}

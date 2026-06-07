// Weather Dashboard using OpenWeatherMap API

const API_KEY = '0a3a32d234d7c6b09a0dd15ddbcb75e2';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Load default city on page load
document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('cityInput');
    if (cityInput) {
        cityInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchWeather();
            }
        });
    }
    
    // Load default city (Mogadishu)
    searchWeather();
});

// Search weather by city
function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    
    if (!city) {
        showError('Fadlan magaalada ku qor');
        return;
    }
    
    showLoading(true);
    hideError();
    
    // Fetch current weather
    fetch(`${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=so`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Magaalada la helay ma joog');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            // Fetch forecast
            return fetch(`${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=so`);
        })
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
            showLoading(false);
        })
        .catch(error => {
            console.error('Error:', error);
            showError(error.message);
            showLoading(false);
        });
}

// Display current weather
function displayCurrentWeather(data) {
    const currentWeather = document.getElementById('currentWeather');
    const weatherDetails = document.getElementById('weatherDetails');
    
    const { main, weather, wind, visibility, sys } = data;
    const { temp, feels_like, humidity, pressure } = main;
    const { description, icon } = weather[0];
    
    const weatherIcon = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString('so-SO', { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString('so-SO', { hour: '2-digit', minute: '2-digit' });
    
    currentWeather.innerHTML = `
        <div class="current-weather-card">
            <div class="weather-header">
                <h2>${data.name}, ${data.sys.country}</h2>
                <p class="weather-date">${new Date().toLocaleDateString('so-SO')}</p>
            </div>
            <div class="weather-main">
                <img src="${weatherIcon}" alt="${description}" class="weather-icon">
                <div class="weather-temp">
                    <h1>${Math.round(temp)}°C</h1>
                    <p class="weather-description">${description}</p>
                    <p class="weather-feels">Eriga sida: ${Math.round(feels_like)}°C</p>
                </div>
            </div>
            <div class="weather-sun-times">
                <div class="sun-time">
                    <i class="fas fa-sunrise"></i>
                    <div>
                        <span>Bariga</span>
                        <p>${sunrise}</p>
                    </div>
                </div>
                <div class="sun-time">
                    <i class="fas fa-sunset"></i>
                    <div>
                        <span>Galabnimada</span>
                        <p>${sunset}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Display details
    document.getElementById('humidityValue').textContent = `${humidity}%`;
    document.getElementById('windValue').textContent = `${Math.round(wind.speed)} m/s`;
    document.getElementById('visibilityValue').textContent = `${(visibility / 1000).toFixed(1)} km`;
    document.getElementById('pressureValue').textContent = `${pressure} hPa`;
    
    weatherDetails.style.display = 'block';
    currentWeather.style.display = 'block';
}

// Display 5-day forecast
function displayForecast(data) {
    const forecastGrid = document.getElementById('forecastGrid');
    const forecastSection = document.getElementById('forecastSection');
    
    // Get unique days
    const dailyData = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('so-SO');
        if (!dailyData[date]) {
            dailyData[date] = item;
        }
    });
    
    // Create forecast cards for next 5 days
    forecastGrid.innerHTML = '';
    let count = 0;
    
    Object.entries(dailyData).forEach(([date, item]) => {
        if (count < 5) {
            const { main, weather } = item;
            const { temp_min, temp_max } = main;
            const { icon, description } = weather[0];
            const weatherIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            const dayName = new Date(item.dt * 1000).toLocaleDateString('so-SO', { weekday: 'short' });
            
            const forecastCard = document.createElement('div');
            forecastCard.className = 'forecast-card';
            forecastCard.innerHTML = `
                <h3>${dayName}</h3>
                <p class="forecast-date">${date}</p>
                <img src="${weatherIcon}" alt="${description}">
                <p class="forecast-description">${description}</p>
                <div class="forecast-temps">
                    <span class="temp-high">${Math.round(temp_max)}°</span>
                    <span class="temp-low">${Math.round(temp_min)}°</span>
                </div>
            `;
            forecastGrid.appendChild(forecastCard);
            count++;
        }
    });
    
    forecastSection.style.display = 'block';
}

// Show loading state
function showLoading(show) {
    const loading = document.getElementById('weatherLoading');
    if (loading) {
        loading.style.display = show ? 'flex' : 'none';
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('weatherError');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorDiv && errorMessage) {
        errorMessage.textContent = message;
        errorDiv.style.display = 'block';
        document.getElementById('currentWeather').style.display = 'none';
        document.getElementById('forecastSection').style.display = 'none';
        document.getElementById('weatherDetails').style.display = 'none';
    }
}

// Hide error message
function hideError() {
    const errorDiv = document.getElementById('weatherError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}
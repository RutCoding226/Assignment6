
function loadSearchHistory() {
  var cities = JSON.parse(localStorage.getItem('cities')) || [];

  var searchHistoryDiv = document.getElementById('search-history');

  searchHistoryDiv.innerHTML = '<h2>Search History</h2>';

  cities.forEach(city => {
      var cityElement = document.createElement('p');
      cityElement.textContent = city;
      cityElement.addEventListener('click', function() {
          document.getElementById('search-input').value = city;
          getWeatherForecast(new Event('submit'));
      });
      searchHistoryDiv.appendChild(cityElement);
  });
}

function formatDate(dateString) {
  var date = new Date(dateString);
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();

  return mm + '/' + dd + '/' + yyyy;
}

function getWeatherForecast(event) {
  event.preventDefault();
  var cityName = document.getElementById('search-input').value;
  var apiKey = '3327935e8d988dde8910d3b7a33aaa5e';
  var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  fetch(requestUrl)
      .then(response => response.json())
      .then(data => {
          if (data.city) {
              var cities = JSON.parse(localStorage.getItem('cities')) || [];
              if (!cities.includes(cityName)) {
                  cities.push(cityName);
                  localStorage.setItem('cities', JSON.stringify(cities));
              }

              loadSearchHistory();

              var currentWeatherDiv = document.getElementById('current-weather');
              var forecastDiv = document.getElementById('forecast');

              currentWeatherDiv.innerHTML = '';
              forecastDiv.innerHTML = '';

              var currentWeather = data.list[0];
              var fiveDayForecast = data.list.filter((forecast, index) => index % 8 === 0).slice(1, 6);
              currentWeatherDiv.innerHTML = `
                  <h2>Current Weather</h2>
                  <p>Date: ${formatDate(currentWeather.dt_txt)}</p>
                  <img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png">
                  <p>Temperature: ${currentWeather.main.temp}°F</p>
                  <p>Wind: ${currentWeather.wind.speed} MPH</p>
                  <p>Humidity: ${currentWeather.main.humidity}%</p>
              `;

              forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
              fiveDayForecast.forEach(forecast => {
                  forecastDiv.innerHTML += `
                      <div>
                          <h3>${formatDate(forecast.dt_txt)}</h3>
                          <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png">
                          <p>Temperature: ${forecast.main.temp}°F</p>
                          <p>Wind: ${forecast.wind.speed} MPH</p>
                          <p>Humidity: ${forecast.main.humidity}%</p>
                      </div>
                  `;
              });
          } else {
              console.log('City not found');
          }
      })
      .catch(error => console.error('Error:', error));
}

document.getElementById('search-form').addEventListener('submit', getWeatherForecast);
window.addEventListener('load', loadSearchHistory);

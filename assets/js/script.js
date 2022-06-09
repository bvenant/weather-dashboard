var cityForm = document.querySelector("#city-form");
var cityInput = document.querySelector("#city");
var currrentWeather = document.querySelector("#current-weather");
var searchedCity = document.querySelector("#searched-city");
var forecast = document.querySelector("#forecast");
var searchList = document.querySelector("#searchList");
var fiveDay = document.querySelector("#fiveDay");
var apiKey = "92fb9e2a80553525912a61e5eeb8ce46";
var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

var cities = [];

// Submit form funtion
var submitForm = function(event) {
    event.preventDefault();
    var city = cityInput.ariaValueMax.trim();
    if (city) {
        getCityWeather(city);
        getFiveDay(city);
        cities.unshift({city});
        cityInput.value = "";
    } else {
        alert("Please enter a city!")
    };
    saveSearch();
    pastSearch(city);
};

// Storing seached cities
var searchStorage = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var cityWeather = function(city) {
    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
        });
    });
};

// Display current weather and creating elements
var displayWeather = function(weather, searchCity) {
    currrentWeather.textContent = "";
    cityInput.textContent = searchCity;

    var currentDay = document.createElement("span")
    currentDay.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    cityInput.appendChild(currentDay);

    var icons = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    cityInput.appendChild(weatherIcon);

    var temperature = 
}
var cityForm = document.querySelector("#city-form");
var cityInput = document.querySelector("#city");
var currrentWeather = document.querySelector("#current-weather");
var searchedCity = document.querySelector("#searched-city");
var forecast = document.querySelector("#forecast");
var searchList = document.querySelector("#searchList");
var fiveDay = document.querySelector("#fiveDay");
var apiKey = "92fb9e2a80553525912a61e5eeb8ce46";

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
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
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
    cityInput.appendChild(icons);

    var temperature = document.createElement("span");
    temperature.textContent = "Temperature: " + weather.main.temp + " °F";
    temperature.classList = "list-group-item"

    var humid = document.createElement("span");
    humid.textContent = "Humidity: " + weather.main.humidity + " %";
    humid.classList = "list-group-item"

    var windSpeed = document.createElement("span");
    windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeed.classList = "list-group-item"

    currrentWeather.appendChild(temperature, humid, windSpeed);

    var latitude = weather.coord.latitude;
    var longitude = weather.coord.longitude;
    uvIndex(latitude, longitude);
}

var uvIndex = function(latitude, longitude) {
    var futureURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(futureURL)
    .then(function(response) {
        response.json().then(function(data) {
            uvIndexDisplay(data)
        });
    });
};

var uvIndexDisplay = function(index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvValue = document.createElement("span")
    uvValue.textContent = index.value

    if(index.value <=2){
        uvValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvValue.classList = "moderate "
    }
    else if(index.value >8){
        uvValue.classList = "severe"
    };
}
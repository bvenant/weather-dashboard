var cityForm = document.querySelector("#city-form");
var cityInput = document.querySelector("#city");
var currrentWeather = document.querySelector("#current-weather");
var searchedCity = document.querySelector("#searched-city");
var forecast = document.querySelector("#forecast");
var searchList = document.querySelector("#searchList");
var fiveDayCon = document.querySelector("#fiveDay");
var apiKey = "92fb9e2a80553525912a61e5eeb8ce46";

var cities = [];

// Submit form funtion
var submitForm = function(event) {
    event.preventDefault();
    var city = cityInput.value.trim();
    if (city) {
        cityWeather(city);
        fiveDay(city);
        cities.unshift({city});
        cityInput.value = "";
    } else {
        alert("Please enter a city!")
    };
    searchStorage();
    searched(city);
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
    icons.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
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
};

// Latitude and Longitute
var uvIndex = function(latitude, longitude) {
    var futureURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&latitude=${latitude}&longitude=${longitude}`
    fetch(futureURL)
    .then(function(response) {
        response.json().then(function(data) {
            uvIndexDisplay(data)
        });
    });
};

// Display UV Index
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

    uvIndexEl.appendChild(uvValue);

    currrentWeather.appendChild(uvValue);
};

var fiveDay = function(city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response) {
        response.json().then(function(data){
            displayFiveDay(data);
        });
    });
};

// Five day forecast
var displayFiveDay = function(weather) {
    forecast.textContent = "";
    fiveDayCon.textContent = "5 Day Forcast:"

    var currForecast = weather.list;
    for(var i=5; i < currForecast.length; i = i + 8) {
        var dailyForecast = currForecast[i];

        var forecastCon = document.createElement("div");
        forecastCon.classList = "card bg-secondary text-light m-2";

        var forecastFive = document.createElement("h5")
        forecastFive.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastFive.classList = "card-header text-center"
        forecastCon.appendChild(forecastFive);

        var icons = document.createElement("img")
        icons.classList = "card-body text-center";
        icons.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

        forecastCon.appendChild(icons);

        var temp = document.createElement("span");
        temp.classList = "card-body text-center";
        temp.textContent = dailyForecast.main.temp + " °F";

        forecastCon.appendChild(temp);

        var humEl = document.createElement("span");
        humEl.classList = "card-body text-center";
        humEl.textContent = dailyForecast.main.humidity + "  %";

        forecastCon.appendChild(humEl)

        fiveDayCon.appendChild(forecastCon);
    };
};

// Previous Searches
var searched = function(searched) {
    
    oldSearch = document.createElement("button");
    oldSearch.textContent = searched;
    oldSearch.classList = "d-flex w-100 btn-light border p-2";
    oldSearch.setAttribute("data-city", searched)
    oldSearch.setAttribute("type", "submit");

    searchList.prepend(oldSearch);
};

var searchHandler = function(event) {
    var city = event.target.getAttribute("data-city")
    if (city) {
        cityWeather(city);
        fiveDay(city);
    }
}

cityForm.addEventListener("submit", submitForm);
searchList.addEventListener("click", searchHandler);
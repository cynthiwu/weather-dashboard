$(document).ready(function() { 

let formInputEl = $("#formInput");
let searchButtonEl = $("#searchButton");
let navButtonEl = $(".list-group-item");
let citynameEl = $("#cityName");
let dateEl = ("(" + moment().format("L") + ")");   

// Setting up local storage for searched cities. 

const searchedCities = JSON.parse(localStorage.getItem("cities")) || [];

// Setting up the initial load for the dashboard to show results for last search city. Default search will be for Seattle. Otherwise dashboard will display last city searched and load saved searches.

if (searchedCities.length === 0) {
    weatherSearch("SEATTLE");
    console.log("hello");
};

if (searchedCities.length > 0) {
    weatherSearch(searchedCities[searchedCities.length - 1]);
    $.each(searchedCities, function(i, value) {
        addListItem(value);
    });
};

// Function to validate the search input, preventing empty string. 

function searchCity() {
    let userInput = formInputEl.val().toUpperCase().trim();
    console.log(userInput);
    
    //Preventing no answer
    if (userInput === "") {
        $("#myModal").modal("show");
    }
        else {
        weatherSearch(userInput);
    }
};

// Function for querying for input city and populating appropriate sections.

function weatherSearch(city) {

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=31b6d28ef47d7d3a64ddd0263f83b5c2",
        method: "GET",
        crossDomain: true,
        dataType: 'jsonp',
    }).then(function(response) {
        console.log(response);

        // Preventing duplicates
        checkDuplicate(city);

        // addListItem(city);
        citynameEl.text(response.name + "  " + dateEl);

        // Creating image element to hold today's weather icon.
        let icon = response.weather[0].icon;
        let iconURL = "https://openweathermap.org/img/w/" + icon + ".png";
        let newIcon = $("<img>");
        newIcon.attr({src: iconURL, alt: "Today's weather icon."})
        citynameEl.append(newIcon);

        // Populating today's weather data into the main dashboard. 
        $("#cityTemp").text(tempConversion(response.main.temp));
        $("#cityHumid").text(response.main.humidity + "%");
        $("#currentWind").text(response.wind.speed.toFixed(2) + " MPH");
        
        // Creating lat and lon variables to be used in the 5 day ajax call.
        let lat = response.coord.lat;
        let lon = response.coord.lon;

        getUVindex(lat, lon);
        getFiveDay(city);
    
    }).catch(function(error) {
        console.log(error);
        const searchedCities = JSON.parse(localStorage.getItem("cities")) || [];
        if (searchedCities.length > 0) {
            weatherSearch(searchedCities[searchedCities.length - 1]);
        }
        else {
            citynameEl.text("Invalid City");
        }
    });
    
};

function getUVindex(lat, lon) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=31b6d28ef47d7d3a64ddd0263f83b5c2",
        method: "GET",
        crossDomain: true,
    }).then(function(response) {
        let uvIndex = response.value;
        let currentUV = $("#currentUV");
        
        console.log(response);
        currentUV.text(uvIndex);

        // Color-coding for today's UV index. 

        if (uvIndex >= 0 && uvIndex <= 2) {
            currentUV.removeClass().addClass("p-2 low");
        }
        else if (uvIndex > 2 && uvIndex <= 5) {
            currentUV.removeClass().addClass("p-2 moderate");
        }
        else if (uvIndex > 5 && uvIndex <= 7) {
            currentUV.removeClass().addClass("p-2 high");
        }
        else if (uvIndex > 7 && uvIndex <= 10) {
            currentUV.removeClass().addClass("p-2 veryhigh");
        }
        else if (uvIndex > 10) {
            currentUV.removeClass().addClass("p-2 extreme");
        }
    }).catch(function(error) {
        console.log(error);
        let currentUV = $("#currentUV");
        currentUV.text("N/A");
    });
};

// Ajax call for the 5 day weather forecast. 

function getFiveDay(city) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=31b6d28ef47d7d3a64ddd0263f83b5c2",
        method: "GET",
        crossDomain: true,
        dataType: 'jsonp',
    }).then(function(response) {
        
        console.log(response);

        // Adding date to the top of each card using moment.js.
        let cardTitle = $(".card-title");
        cardTitle.each(function(index) {
            $(this).text(moment().add(index + 1, "days").format("l"));
        });

        // Adding the given day weather icon to each card. 
        let fiveIcon = $(".fiveIcon");
        fiveIcon.each(function(index) {
            let icon = response.list[index].weather[0].icon;
            let iconURL = "https://openweathermap.org/img/w/" + icon + ".png";
            let newIcon = $("<img>");
            newIcon.attr({src: iconURL, alt: "Five day forecast weather icon."});
            $(this).html(newIcon);
        });
       
        // Adding the given day temp to each card.
        let cardTemp = $(".card-temp");
        cardTemp.each(function(index) {
            $(this).text(tempConversion(response.list[index].main.temp));
        });

        // Adding the given day humidity.
        let cardHum = $(".card-hum");
        cardHum.each(function(index) {
            $(this).text(response.list[index].main.humidity + "%");
        });

    }).catch(function(error) {
        console.log(error);
        let cardTitle = $(".card-title");
        cardTitle.text("Nothing found");
    })
}

function checkDuplicate(city) {
    if (searchedCities.indexOf(city) !== -1) {
        searchedCities.splice(searchedCities.indexOf(city), 1);
        searchedCities.push(city);

        removeListItem(city);
        addListItem(city);
        localStorage.setItem("cities", JSON.stringify(searchedCities));
    }

    else {  
        searchedCities.push(city);
        localStorage.setItem("cities", JSON.stringify(searchedCities));
        addListItem(city);
    }
}


// Function for removing a duplicate list item from the search bar.

function removeListItem(item) {
    let listItem = $(".list-group-item");
    listItem.each(function() {
        console.log($(this).data("city"));
        if ($(this).data("city") === item) {
            $(this).remove();
        }
    })
};


// General function for adding new list items to the search bar. 

function addListItem(newItem) {
    let newButton = $("<button>");
    newButton.addClass("list-group-item list-group-item-action");
    newButton.attr("data-city", newItem);
    newButton.text(newItem);
    $(".list-group").prepend(newButton);
    newButton.on("click", navSearch);
};

// Adding search functionailty to dynamically added nav buttons.

function navSearch() {
    console.log($(this).data("city"));
    weatherSearch($(this).data("city"));
}

// Formula to convert kelvin to fahrenheit. 

    function tempConversion (kelvin) {
        let newTemp = ((kelvin - 273.15) * 9/5 + 32).toFixed(2) + "°F";
        return newTemp;
    };


// Click handler for the search and side-nav buttons.
    
    searchButtonEl.on("click", searchCity);
    navButtonEl.on("click", navSearch);

});









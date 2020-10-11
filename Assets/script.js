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
    weatherSearch("Seattle");
}
else {
    weatherSearch(searchedCities[searchedCities.length -1]);
}

// Need conditional here in the case the last search as invalid. 
  
if (searchedCities.length > 0) {
    $.each(searchedCities, function(i, value){
        addListItem(value);
    })
};

// Function for searching for a city and following actions after the search buttin is clicked.

function searchCity() {
    
    let userInput = formInputEl.val().toUpperCase().trim();
    
    //Preventing no answer

    if (userInput === "") {
        alert("Please enter a valid city name.");
        // $('#myModal').modal("show");
    }
        //Look into modal for this as opposed to alert.

    // Preventing duplicates
    else if (searchedCities.indexOf(userInput) !== -1) {
        searchedCities.splice(searchedCities.indexOf(userInput), 1);
        searchedCities.push(userInput);

        removeListItem(userInput);
        addListItem(userInput);
        weatherSearch(userInput);
        localStorage.setItem("cities", JSON.stringify(searchedCities));
    }

    else {  
        searchedCities.push(userInput);
        localStorage.setItem("cities", JSON.stringify(searchedCities));
        addListItem(userInput);
        weatherSearch(userInput);
    }
};

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

function weatherSearch(city) {

    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=31b6d28ef47d7d3a64ddd0263f83b5c2",
        method: "GET",
        crossDomain: true,
        dataType: 'jsonp',
    }).then(function(response) {
        console.log(response);
        
        citynameEl.text(response.name + "  " + dateEl);

        let icon = response.weather[0].icon;
        let iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
        let newIcon = $("<img>");
        newIcon.attr({src: iconURL, alt: "Today's weather icon."})
        citynameEl.append(newIcon);

        $("#cityTemp").text(tempConversion(response.main.temp));
        $("#cityHumid").text(response.main.humidity + "%");
        $("#currentWind").text(response.wind.speed.toFixed(2) + " MPH");
        
        let lat = response.coord.lat;
        let lon = response.coord.lon;

         
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=31b6d28ef47d7d3a64ddd0263f83b5c2",
            method: "GET",
            crossDomain: true,
        }).then(function(response) {
            let uvIndex = response.value;
            let currentUV = $("#currentUV");
            
            console.log(response);
            currentUV.text(uvIndex);

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
        });
    
    });

// Ajax call for the 5 day weather forecast. 

    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=31b6d28ef47d7d3a64ddd0263f83b5c2",
        method: "GET",
        crossDomain: true,
        dataType: 'jsonp',
    }).then(function(response) {
        
        console.log(response);

        let cardTitle = $(".card-title");

        cardTitle.each(function(index) {
            $(this).text(moment().add(index + 1, "days").format("l"));
        });

        let fiveIcon = $(".fiveIcon");


        fiveIcon.each(function(index) {
            let icon = response.list[index].weather[0].icon;
            let iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
            let newIcon = $("<img>");
            newIcon.attr({src: iconURL, alt: "Five day forecast weather icon."})
            $(this).html(newIcon);
        });
       
        let cardTemp = $(".card-temp");

        cardTemp.each(function(index) {
            $(this).text(tempConversion(response.list[index].main.temp));
        });

        let cardHum = $(".card-hum");

        cardHum.each(function(index) {
            $(this).text(response.list[index].main.humidity + "%");
        });

    });
}

// Formula to conver kelvin to fahrenheit. 

    function tempConversion (kelvin) {
        let newTemp = ((kelvin - 273.15) * 9/5 + 32).toFixed(2) + "°F";
        return newTemp;
    };


// Click handler for the search button.
    
    searchButtonEl.on("click", searchCity);
    navButtonEl.on("click", navSearch);

});









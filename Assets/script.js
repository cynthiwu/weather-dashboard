$(document).ready(function() { 
let formInputEl = $("#formInput");
let searchButtonEl = $("#searchButton");
let citynameEl = $("#cityName");
let dateEl = ("(" + moment().format("L") + ")");   



// Setting up the initial load for the dashboard.

//     // Set up dash for Seattle here if no previous search results.
// if (searchedCities.length === 0) {
// }



// Setting up local storage for searched cities. 

const searchedCities = JSON.parse(localStorage.getItem("cities")) || [];

  
if (searchedCities.length > 0) {
    $.each(searchedCities, function(i, value){
        addListItem(value);
    })
}


//May need a data-attribute for the city name. 

function searchCity(event) {
    if (formInputEl.val() === "") {
        alert("Please enter a valid city name.")
    }
    
    // Need conditional for duplicate values

    else {

    let newCity = formInputEl.val().toUpperCase().trim();
    searchedCities.push(newCity);
    localStorage.setItem("cities", JSON.stringify(searchedCities));

    // let newCity = searchedCities[searchedCities.length - 1];
    addListItem(newCity);
    weatherSearch(newCity);

    }
};

// General function for adding new list items to the search bar. 

function addListItem(newItem) {
    let newLink = $("<a>");
    newLink.addClass("list-group-item list-group-item-action");
    newLink.attr("data-city", newItem);
    newLink.text(newItem);
    $(".list-group").prepend(newLink);
}

function weatherSearch(city) {

    let queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=31b6d28ef47d7d3a64ddd0263f83b5c2";
    

    $.ajax({
        url: queryUrl,
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
        $("#currentWind").text(response.wind.speed.toFixed(1) + " MPH");
        
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
                currentUV.addClass("low");
            }
            else if (uvIndex > 2 && uvIndex <= 5) {
                currentUV.addClass("moderate");
            }
            else if (uvIndex > 5 && uvIndex <= 7) {
                currentUV.addClass("high");
            }
            else if (uvIndex > 7 && uvIndex <= 10) {
                currentUV.addClass("veryhigh");
            }
            else if (uvIndex > 10) {
                currentUV.addClass("extreme");
            }
        });
    
    });

//class="bg-danger p-2 rounded"

    

};

// Formula to conver kelvin to fahrenheit. 

function tempConversion (kelvin) {

    let newTemp = ((kelvin - 273.15) * 9/5 + 32).toFixed(1) + "°F";
    return newTemp;

}









searchButtonEl.on("click", searchCity);

});









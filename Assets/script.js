$(document).ready(function() { 

let formInputEl = $("#formInput");
let searchButtonEl = $("#searchButton");
let citynameEl = $("#cityName");
let dateEl = ("(" + moment().format("L") + ")");   





// Setting up local storage for searched cities. 

const searchedCities = JSON.parse(localStorage.getItem("cities")) || [];

// Setting up the initial load for the dashboard to show results for last search city. 

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


function searchCity(event) {
    if (formInputEl.val() === "") {
        alert("Please enter a valid city name.")
    }
    //Look into modal for this as opposed to alert.
    // Need conditional for duplicate values

    else {

    let newCity = formInputEl.val().toUpperCase().trim();
    searchedCities.push(newCity);
    localStorage.setItem("cities", JSON.stringify(searchedCities));

    addListItem(newCity);
    weatherSearch(newCity);

    }
};

// General function for adding new list items to the search bar. 
//May need a data-attribute for the city name. 

function addListItem(newItem) {
    let newButton = $("<button>");
    newButton.addClass("list-group-item list-group-item-action");
    newButton.attr("data-city", newItem);
    newButton.text(newItem);
    $(".list-group").prepend(newButton);
};

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
        $("#dayOne").text(moment().add(1,'days').format("l"));
        $("#dayTwo").text(moment().add(2,'days').format("l"));
        $("#dayThree").text(moment().add(3,'days').format("l"));
        $("#dayFour").text(moment().add(4,'days').format("l"));
        $("#dayFive").text(moment().add(5,'days').format("l"));

        // Am really not able to get this to work. I know I can do it individually, but what about with a for or .each?


        // for (let i = 0; i < 5; i++) {
        //     let j = 0;
        //     let fiveIcon = $(".fiveIcon");
        //     let icon2 = response.list[i].weather[0].icon;
        //     let iconURL2 = "http://openweathermap.org/img/w/" + icon2 + ".png";
        //     let newIcon2 = $("<img>");
        //     fiveIcon[i].append(newIcon2);
        //     newIcon2.attr({src: iconURL2, alt: "Five day weather icon"});
        //     console.log(newIcon2);
        // };

        let fiveIcon = $(".fiveIcon");

        fiveIcon.each(function() {
            let icon = response.list[0].weather[0].icon;
            let iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
            let newIcon = $("<img>");
            newIcon.attr({src: iconURL, alt: "Today's weather icon."})
            fiveIcon[0].append(newIcon);
            i++;
            console.log(fiveIcon);
            console.log(response.list[0].weather[0].icon);
        });
       

        $("#dayOneTemp").text(tempConversion(response.list[0].main.temp));
        $("#dayTwoTemp").text(tempConversion(response.list[1].main.temp));
        $("#dayThreeTemp").text(tempConversion(response.list[2].main.temp));
        $("#dayFourTemp").text(tempConversion(response.list[3].main.temp));
        $("#dayFiveTemp").text(tempConversion(response.list[4].main.temp));

        $("#dayOneHum").text(response.list[0].main.humidity + "%");
        $("#dayTwoHum").text(response.list[1].main.humidity + "%");
        $("#dayThreeHum").text(response.list[2].main.humidity + "%");
        $("#dayFourHum").text(response.list[3].main.humidity + "%");
        $("#dayFiveHum").text(response.list[4].main.humidity + "%");

    });
}


// Formula to conver kelvin to fahrenheit. 

    function tempConversion (kelvin) {
        let newTemp = ((kelvin - 273.15) * 9/5 + 32).toFixed(2) + "°F";
        return newTemp;
    };


// Click handler for the search button.

    searchButtonEl.on("click", searchCity);

});









$(document).ready(function() { 
let formInputEl = $("#formInput");
let searchButtonEl = $("#searchButton");

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
    let queryUrl = formInputEl.val().trim();
    $.ajax({
        url
    })

}








searchButtonEl.on("click", searchCity);

});









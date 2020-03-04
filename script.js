var APIKey = "97dd4cc64358226e6742b24a9af7c830";
var logged_string = window.localStorage.getItem("cities");
var recent_cities = [];

function initial_page() {
  // $("#currentDay").text(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
  $("#day").text(moment().format("MMMM Do YYYY"));

  if (logged_string !== null) {
    recent_cities = logged_string.split(",");
    var position = recent_cities.length;
    //load recent cities list for

    updateSaved();

    //populates 5 day forecast of most recent search:
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      recent_cities[position - 1] +
      "&APPID=" +
      APIKey;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      // Log the resulting object
      console.log(response);
      console.log(response);
      var tempF = (response.main.temp - 273.15) * 1.8 + 32; //how round this
      $(".result_city").text(response.name + " Weather");
      $(".temp").text("Temperature (F) " + tempF);
      $(".wind").text("Wind Speed: " + response.wind.speed);
      $(".humidity").text("Humidity: " + response.main.humidity);
      $(".UVindex").text("UV index " + response.main.temp); //figure out which one is the UV index
    });
  }

  //click event on #retrieve to get value from neighbor box .city and update search

  $("#retrieve").on("click", function() {
    //pulls data from input box
    var place = $(this)
      .siblings("input")
      .val();
    if (recent_cities.length < 5) {
      recent_cities.push(place);
      window.localStorage.setItem("cities", recent_cities);
    } else {
      recent_cities.splice(0, 1);
      recent_cities.push(place);
      window.localStorage.setItem("cities", recent_cities);
    }

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      place +
      "&APPID=" +
      APIKey;
    // Runs AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      // Log the resulting object
      console.log(response);
      var sky = response.weather[0].main;
      // var pic = $("<img>").attr("src", select_img(sky));
      console.log(select_img(sky));
      // console.log(pic);
      //    console.log(response[3]);
      var tempF = (response.main.temp - 273.15) * 1.8 + 32; //how round this
      // pic.appendTo("return_results");
      $(".city_img").attr("src", select_img(sky));
      $(".result_city").text(response.name + " Weather");
      $(".temp").text("Temperature (F): " + tempF);
      $(".wind").text("Wind Speed: " + response.wind.speed);
      $(".humidity").text("Humidity: " + response.main.humidity);
    });
    //updates recent search list without page refresh
    $(".5_day")
      .children()
      .not("#5_day")
      .remove();
    updateSaved();
  });
  // generate buttons on search populated by local storage

  //5 day forecast calls should be on click of the city
  $("#5_day").on("click", function() {
    //most this to initialize page once creating a 5 day forecast for a city
    test_city = "Seattle";
    // builds the URL to query the database add more with &itemkey=variable
    var queryURL5_day =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      test_city +
      "&APPID=" +
      APIKey;
    console.log(queryURL5_day);
    $.ajax({
      url: queryURL5_day,
      method: "GET"
    }).then(function(response) {
      console.log("success");
      console.log(response);
      // Log the resulting object
    });
  });

  function updateSaved() {
    for (i = 0; i < recent_cities.length; i++) {
      $(".5_day").append($("<button>").text(recent_cities[i])); //creates button tag with cities, needs to be put into a div
    }
  }

  function select_img(image_selector) {
    switch (image_selector) {
      case "Clear":
        return "./img/clear.jpeg";
      // alert("jQuery sucks!");
      // break;
      case "Clouds":
        return "./img/clouds.jpeg";
      // alert("prototype sucks!");
      // break;
      case "Rain":
        return "./img/rain.jpeg";
      // alert("mootools sucks!");
      // break;
      case "Snow":
        // return "./img/snow.jpeg";
        alert("dojo sucks!");
        break;
      case "Extreme":
        // return "./img/extreme.jpeg";
        alert("dojo sucks!");
        break;
      default:
        break;
    }
  }
}

initial_page();

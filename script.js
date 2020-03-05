var APIKey = "97dd4cc64358226e6742b24a9af7c830";
var logged_string = window.localStorage.getItem("cities");
var recent_cities = [];

function initialize_page() {
  $(".navbar-brand").text(moment().format("MMMM D, YYYY"));

  if (logged_string !== null) {
    recent_cities = logged_string.split(",");
    //load recent cities list for header

    updateSaved();

    //populates 5 day forecast of most recent search:
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      recent_cities[0] +
      "&APPID=" +
      APIKey;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      var pic = response.weather[0].main;
      // var pic = $("<img>").attr("src", select_img(sky));
      console.log(select_img(pic));
      $(".city_img").attr("src", select_img(pic));

      // Log the resulting object
      console.log(response);
      var tempF = (response.main.temp - 273.15) * 1.8 + 32; //how round this
      $(".result_city").text(response.name + " Weather");
      $(".temp").text("Temperature (F): " + tempF);
      $(".wind").text("Wind Speed: " + response.wind.speed);
      $(".humidity").text("Humidity: " + response.main.humidity);
      $(".UVindex").text("UV index " + response.main.temp); //figure out which one is the UV index
    });
  }
}

//click event on #retrieve to get value from neighbor box .city and updates search history

$("#retrieve").on("click", function() {
  //pulls data from input box
  var place = $(this)
    .siblings("input")
    .val();
  if (recent_cities.length < 5) {
    //adds to array
    recent_cities.splice(0, 0, place);
    window.localStorage.setItem("cities", recent_cities);
  } else {
    //removes and adds to beginning of array
    recent_cities.splice(0, 0, place);
    recent_cities.pop();
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
  $("#recent_5")
    .children()
    .not("#rs")
    .remove();
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
    $("#recent_5").append(
      $("<div>")
        .attr(
          "class",
          "column has-background-info has-text-white border border-white"
        )
        .attr("id", i)
        .text(recent_cities[i])
    ); //creates button tag with cities, needs to be put into a div
    var nested = $("<div>").attr("class", "columns is-gapless");
    nested.append(
      $("<div>")
        .attr("class", "column")
        .append($("<img>").attr("src", select_img("Clear")))
    );
    nested.append(
      $("<div>")
        .attr("class", "column")
        .text("68 F")
    );

    $("#" + i).append(nested);
  }
}

function select_img(image_selector) {
  switch (image_selector) {
    case "Clear":
      return "./img/clear.jpeg";
    case "Clouds":
      return "./img/clouds.jpeg";
    case "Rain":
      return "./img/rain.jpeg";
    case "Snow":
      return "./img/snow.jpeg";
    case "Extreme":
      return "./img/extreme.jpeg";
    default:
      return "";
  }
}

initialize_page();

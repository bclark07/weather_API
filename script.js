var APIKey = "97dd4cc64358226e6742b24a9af7c830";
var logged_string = localStorage.getItem("cities");
var recent_cities = [];

function initialize_page() {
  $(".navbar-brand").text(moment().format("MMMM D, YYYY"));

  if (logged_string !== null) {
    recent_cities = logged_string.split(",");
    //load recent searches list for header
    updateSaved();
    //load recent searches list for body
    today();
    weather_5day();
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
    localStorage.setItem("cities", recent_cities);
  } else {
    //removes and adds to beginning of array
    recent_cities.splice(0, 0, place);
    recent_cities.pop();
    localStorage.setItem("cities", recent_cities);
  }
  //updates recent search list without page refresh
  $("#recent_5")
    .children()
    .not("#rs")
    .remove();
  $(".5_day")
    .children()
    .not("#5_day")
    .remove();
  //re-loads recent searches list for header
  updateSaved();
  today();
  weather_5day();
});

//updates weather data from today into body
function today() {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    recent_cities[0] +
    "&APPID=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var pic = response.weather[0].main;
    $(".city_img").attr("src", select_img(pic));
    var tempF = Math.round((response.main.temp - 273.15) * 1.8 + 32);
    $(".result_city").text(response.name + " Weather");
    $(".temp").text("Temperature (F): " + tempF);
    $(".wind").text("Wind Speed: " + response.wind.speed + " m/s");
    $(".humidity").text("Humidity: " + response.main.humidity + "%");
  });
}

function weather_5day() {
  var queryURL5_day =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    recent_cities[0] +
    "&APPID=" +
    APIKey;
  $.ajax({
    url: queryURL5_day,
    method: "GET"
  }).then(function(response) {
    for (var k = 0; k < 40; k = k + 8) {
      // var sky = response.list[k].weather[0].main; //this has to stay zero
      var tempF = Math.round((response.list[k].main.temp - 273.15) * 1.8 + 32);
      console.log(tempF);
      console.log("Humidity: " + response.list[k].main.humidity + "%");
      console.log("Date " + response.list[k].dt_txt);
      $(".5_day").append($("<button>").text(tempF)); //creates button tag with cities, needs to be put into a div
      var day5 = $("<div>").attr("class", "columns is-gapless");
      // day5.append(
      //   $("<div>")
      //     .attr("class", "column")
      //     .append($("<img>").attr("src", select_img(sky)))
      // );
      day5.append(
        $("<div>")
          .attr("class", "column")
          .text("Temperature (F): " + tempF)
          .text("Humidity: " + response.list[k].main.humidity + "%")
      );
      $("#5_day" + i).append(day5);
    }
  });
}

function updateSaved() {
  for (i = 0; i < recent_cities.length; i++) {
    console.log(i);
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      recent_cities[i] +
      "&APPID=" +
      APIKey;
    $.ajax({
      url: queryURL,
      async: false, //need this to slow it down
      ajaxI: i, // Capture the current value of 'i' to reset if gets asynchronous
      method: "GET"
    }).then(function(response) {
      i = this.ajaxI;
      var sky = response.weather[0].main; //this has to stay zero
      var tempF = Math.round((response.main.temp - 273.15) * 1.8 + 32);
      //updates the top recent searches bar with current weather info
      $("#recent_5").append(
        $("<div>")
          .attr(
            "class",
            "column has-background-info has-text-white border border-white"
          )
          .attr("id", i)
          .text(recent_cities[i])
      );
      var nested = $("<div>").attr("class", "columns is-gapless");
      nested.append(
        $("<div>")
          .attr("class", "column")
          .append($("<img>").attr("src", select_img(sky)))
      );
      nested.append(
        $("<div>")
          .attr("class", "column")
          .text("Temperature (F): " + tempF)
          .text("Humidity: " + response.main.humidity + "%")
      );
      $("#" + i).append(nested);
    });
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
    case "Drizzle":
      return "./img/rain.jpeg";
    default:
      confirm("no image");
      return "";
  }
}

initialize_page();

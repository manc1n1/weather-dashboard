$(function () {
    // https://openweathermap.org/ API Key
    var apiKey = "ef033f0612881bd52c7b9b46cea380dc";

    var userInput = $("#userInput");
    var submitButton = $("#submit-btn");

    // On Enter keypress
    userInput.on("keypress", function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#curr").removeClass("visible");
            $("#future-title").removeClass("visible");
            $("#future").empty();
            fetchApi();
        }
    });

    // On Search button click
    submitButton.on("click", function () {
        $("#curr").removeClass("visible");
        $("#future-title").removeClass("visible");
        $("#future").empty();
        fetchApi();
    });

    // Fetch API using Endpoints
    function fetchApi() {
        var city = userInput.val();
        var currApiUrl =
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&appid=" +
            apiKey +
            "&units=imperial";
        var forecastApiUrl =
            "https://api.openweathermap.org/data/2.5/forecast?q=" +
            city +
            "&appid=" +
            apiKey +
            "&units=imperial";

        if (userInput.val() === "") {
            return;
        } else {
            fetch(currApiUrl)
                .then(function (response) {
                    if (response.status !== 200) {
                        alert("City not found.");
                    }
                    return response.json();
                })
                .then(function (data) {
                    createCurr(data);
                    createPrev(data, currApiUrl, forecastApiUrl);
                });
            fetch(forecastApiUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    for (let i = 0; i < data.list.length; i++) {
                        const day = data.list[i];
                        if (data.list.indexOf(day) % 8 == 0) {
                            createForecast(day);
                        }
                    }
                });
        }
    }

    // Create Current weather data
    function createCurr(data) {
        $("#curr").addClass("visible");

        $("#curr-header").text(data.name + " - " + data.weather[0].main);
        $("#curr-temp").text("Temp: " + data.main.temp + " ºF");
        $("#curr-wind").text("Wind: " + data.wind.speed + " MPH");
        $("#curr-humidity").text("Humidity: " + data.main.humidity + " %");
    }

    // Create 5-Day Forecast weather data
    function createForecast(data) {
        $("#future-title").addClass("visible");
        $("#future").addClass("visible");

        var futureContainer = $("#future");
        var futureCard = $("<div></div>");
        var futureHeader = $("<h6></h6>");
        var futureCardBody = $("<div></div>");
        var futureDesc = $("<p></p>");
        var futureTemp = $("<p></p>");
        var futureWind = $("<p></p>");
        var futureHumidity = $("<p></p>");

        futureContainer.append(futureCard.addClass("card"));
        futureCard.attr("id", "card");

        futureCard.append(futureHeader.addClass("card-header"));
        futureCard.append(futureCardBody.addClass("card-body"));

        futureHeader.text(dayjs.unix(data.dt).format("M/D/YY"));

        futureCardBody.append(futureDesc.addClass("card-text"));
        futureCardBody.append(futureTemp.addClass("card-text"));
        futureCardBody.append(futureWind.addClass("card-text"));
        futureCardBody.append(futureHumidity.addClass("card-text"));

        futureDesc.text(data.weather[0].main);
        futureTemp.text("Temp: " + data.main.temp + " ºF");
        futureWind.text("Wind: " + data.wind.speed + " MPH");
        futureHumidity.text("Humidity: " + data.main.humidity + " %");
    }

    // Create buttons for previously searched locations
    function createPrev(data, currApiUrl, forecastApiUrl) {
        var aside = $("aside");
        var prevButton = $("<button></button>");

        var currApiUrl = currApiUrl;
        var forecastApiUrl = forecastApiUrl;

        aside.append(
            prevButton.addClass(
                "d-flex justify-content-center w-100 btn btn-outline-info my-2"
            )
        );
        prevButton.text(data.name);

        prevButton.val([currApiUrl, forecastApiUrl]);

        currApiUrl = prevButton.val().split(",")[0];
        forecastApiUrl = prevButton.val().split(",")[1];

        prevButton.on("click", function () {
            $("#curr").removeClass("visible");
            $("#future-title").removeClass("visible");
            $("#future").empty();

            fetch(currApiUrl)
                .then(function (response) {
                    if (response.status !== 200) {
                        alert("City not found.");
                    }
                    return response.json();
                })
                .then(function (data) {
                    createCurr(data);
                });
            fetch(forecastApiUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    for (let i = 0; i < data.list.length; i++) {
                        const day = data.list[i];
                        if (data.list.indexOf(day) % 8 == 0) {
                            createForecast(day);
                        }
                    }
                });
        });
    }
});

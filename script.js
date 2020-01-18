$(document).ready(function (e) {

    /*
    * Today's date in moment() format
    * Used due to different functionality as opposed to Date()
    */
    var todayMoment = moment().format("M/D");

    /*
    * Today's date in Date() format
    * Used due to different functionality as opposed to moment()
    */
    var todayDate = new Date();

    /*
    * Global instance of the current month as Date Object.
    * Global instance of current year as Date object.
    * Global instance of the selected year in dropdown. For changing year via dropdown.
    * Global instance of the selected month in dropdown. For changing month via dropdown.
    */
    var currentMonth = todayDate.getMonth(),
        currentYear = todayDate.getFullYear(),
        selectYear = document.getElementById("year"),
        selectMonth = document.getElementById("month");

    //run all of the individual functions to set up the page at initial load.
    showCalendar(currentMonth, currentYear);
    onThisDay();
    news();
    wordOfTheDay();

    /* 
    * Get geolocation at load after permission granted for location access.
    */
    navigator.geolocation.getCurrentPosition(function (loc) {

        //get coordinates
        let lat = loc.coords.latitude;
        let lon = loc.coords.longitude;

        //then head to weatherGeoLocation to build URL
        weatherGeoLocation(lat, lon);
    });

    /*
    * On this Day in History
    * Finds a fun historical event from this day and populates a tile.
    */
    function onThisDay() {
        let url = "https://byabbe.se/on-this-day/",
            query = url + todayMoment + "/events.json";

        $.ajax({
            url: query,
            method: "GET"

        }).then(function (data) {

            //holds index for api object
            let index = Math.floor(Math.random() * data.events.length);

            //add to html
            $(".onThisDayTitle").html(data.date + ", " + data.events[index].year);
            $(".onThisDaySubtitle").html(data.events[index].description);
            $("#wikipediaTitle").html(data.events[index].wikipedia[0].title);
            $(".onThisDayContent").html("<a href=\"" + data.events[index].wikipedia[0].wikipedia + "\" target=\"_blank\">Learn more</a>");
        });
    }

    /*
    * Listener which runs on click of weather button.
    * Gets weather for searched city.
    */
    $(".weather-btn").on("click", function (e) {

        //first build URL
        let citySearch = $("#weather-city").val().trim(),
            APIkey = "e1014510ebbf942b1f1d07d44fa4f59b",
            query = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&units=imperial&appid=" + APIkey;

        //then, call ajax
        weatherAjax(query);

    });

    /*
    * Build the api query to get weather
    * @arg: string latitude: string of api call for latitude.
    * @arg: string longitude: string of api call for longitude.
    */
    function weatherGeoLocation(latitude, longitude) {

        //first, build URL
        lat = "?lat=" + latitude;
        lon = "&lon=" + longitude;
        let query = "https://api.openweathermap.org/data/2.5/weather" + lat + lon + "&units=imperial&appid=" + "e1014510ebbf942b1f1d07d44fa4f59b";

        //then, call ajax
        weatherAjax(query);
    }

    /*
    * Function which runs the ajax for the weather API call.
    * After query is retured, populates html accordingly.
    * @arg: query: string which holds weather api query link.
    */
    function weatherAjax(query) {

        let d = moment().format('LLLL');
        $(".date").text(d);

        $.ajax({
            url: query,
            method: "GET",
            success: function (data) {

                $(".errorBox").empty();
                $(".weather-location").text(data.name);
                $(".temperature-value").text(Math.round(data.main.temp) + "º" + "F");
                $(".temperature-description").text(data.weather[0].description);
                $(".weather-icon").html("<img src=\"./assets/" + data.weather[0].icon + ".png\" alt=\"" + data.weather[0].icon + "\"></img>");
                $(".humidity").text("Humidity: " + data.main.humidity + " %");
            },
            error: function (jqXHR, textStatus, errorThrown) {

                $(".errorBox").text(textStatus + ": " + errorThrown);
            }
        });
    }

    /*
    * Function to get data from News API and populate html.
    */
    function news() {

        let APIKey = "8cbd36d7b28e470b90b2709797dceca2",
            queryURL = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=' + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            for (let i = 0; i < response.articles.length && i < 8; i++) {
                $(".newsContent").append("<p class=\"subtitle newstitle" + (i + 1) + "\"></p>");
                $(".newsContent").append("<p class=\"newslink" + (i + 1) + "\"></p>");
                $(".newstitle" + (i + 1)).html(response.articles[i].title);
                $(".newslink" + (i + 1)).html("<a href=" + response.articles[i].url + " target=\"_blank\">Read Article</a>");
            }

        });
    }

    /*
    * Determines random word of the day and outputs definition(s) & part(s) of speech (adj, noun, etc).
    */
    function wordOfTheDay() {
        let key = "?key=64670138-b960-4366-9959-b8fdc5ecef9e",
            url = "https://dictionaryapi.com/api/v3/references/collegiate/json/";

        let randomIndex = localStorage.getItem("wordIndex");

        if ((localStorage.getItem("today") == null) || (localStorage.getItem("today") != todayMoment)) {
            localStorage.setItem("today", todayMoment); //... Then, set today in localStorage...
            randomIndex = Math.floor((Math.random() * dictionary.length) + 1); //... Next, calculate new number...
            localStorage.setItem("wordIndex", randomIndex); //... Finally, save index into localStorage.
        }

        if (randomIndex === null) {
            randomIndex = Math.floor((Math.random() * dictionary.length) + 1);
            localStorage.setItem("wordIndex", randomIndex);
        }

        let wordOfDay = dictionary[randomIndex];

        let query = url + wordOfDay + key;

        $.ajax({
            url: query,
            method: "GET"

        }).then(function (data) {

            $(".word").html(toUpper(wordOfDay));

            let jQuery = [".wordOne", ".wordTwo", ".wordThree"];

            for (let i = 0; i < data.length && i < 3; i++) {

                let definition = data[i].shortdef,
                    partOfSpeech = data[i].fl;

                $(jQuery[i]).append("<p style=\"font-style: italic;\">" + partOfSpeech + "<ul class=\"wordUL" + i + "\" >");
                for (let j = 0; j < definition.length; j++) {
                    $(".wordUL" + i).append("<li>" + toUpper(definition[j]) + "</li>");
                }
            }
        });
    }

    /*
    * When the next button is clicked on the calendar.
    * Moves the calendar forward one month.
    */
    $("#next").click(function (e) {
        //empty old calendar
        $("#calendar-body").empty();

        //if currentMonth is 11 (december)
        if (currentMonth === 11) {
            //then increment year by 1
            currentYear = currentYear + 1
        }
        
        //if month ==== 11 (december), month is reset back to 0 (january) because 12 % 12 === 0. But n = (any number less than 12 and greater than 0), so (n % 12 === n). without the modulo, when clicking next on month of december, we get month 13, which is undefined.
        currentMonth = (currentMonth + 1) % 12;

        showCalendar(currentMonth, currentYear);
    });

    /*
    * When the previous button is clicked on the calendar.
    * Moves the calendar back one month.
    */
    $("#previous").click(function (e) {
        //empty old calendar
        $("#calendar-body").empty();

        //if first month of year
        if (currentMonth === 0) {
            //subtract year & set month to 11 (december)
            currentYear = currentYear - 1;
            currentMonth = 11;
        }
        else {
            //else keep year and subtract month by 1
            currentYear = currentYear;
            currentMonth = currentMonth - 1;
        }

        //rebuild calendar
        showCalendar(currentMonth, currentYear);
    });

    /*
    * Listener which handles when user changes month or year via dropdown.
    */
    $(".jump").on("change", function (e) {

        //empty calendar
        $("#calendar-body").empty();

        //current year & current month are the text value selected in the dropdown
        currentYear = parseInt(selectYear.value);
        currentMonth = parseInt(selectMonth.value);

        //rebuild calendar
        showCalendar(currentMonth, currentYear);
    });

    /*
    * Function which creates the calendar and displays it on screen
    * @arg: string: month in the year.
    * @arg string: year
    */
    function showCalendar(month, year) {

        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthAndYear = $("#monthAndYear"),
            firstDay = (new Date(year, month)).getDay();

        //body of the calendar
        tbl = document.getElementById("calendar-body");

        //clear previous cells
        tbl.innerHTML = "";

        //populate month data
        monthAndYear.html(months[month] + " " + year);
        selectYear.value = year;
        selectMonth.value = month;

        //create all cells
        let date = 1;
        for (let i = 0; i < 6; i++) {
            //create a table row
            let row = document.createElement("tr");

            //create individual cells, populate with data.
            for (let j = 0; j < 7; j++) {

                if (i === 0 && j < firstDay) {
                    cell = document.createElement("td");
                    cellText = document.createTextNode("");
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                }
                else if (date > daysInMonth(month, year)) {
                    break;
                }

                else {
                    cell = document.createElement("td");
                    cellText = document.createTextNode(date);
                    if (date === todayDate.getDate() && year === todayDate.getFullYear() && month === todayDate.getMonth()) {
                        cell.classList.add("bg-info");
                    }
                    //highlight today's date
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    date++;
                }
            }
            //append each row into calendar body.
            tbl.append(row);
        }
    }

    /*
    * Helper function determines how many days in a month.
    * @arg: month: holds value of the month to determine how many days
    * @arg: year: holds value of the year to determine how many days. This only actually matters for February in leap years.
    */
    function daysInMonth(month, year) {
        return 32 - new Date(year, month, 32).getDate();
    }

    /*
    * Takes a string argument and returns the same string with first letter capitalized.
    * Small helper function used for printing word of day and definition onto screen.
    */
    function toUpper(input) {
        let newString = input.charAt(0).toUpperCase() + input.substring(1);
        return newString;
    }

});
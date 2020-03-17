function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getData);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function getData(pos) {
    fetch(`https://api.darksky.net/forecast/0b8bd1c4d4128997b44744c057837986/${pos.coords.latitude},${pos.coords.longitude}?units=si&exclude=flags,alerts`)
        .then(res => {
            return res.json();
        })
        .then(resData => {
            document.getElementById("location").innerHTML = resData.timezone;
            document.getElementById("current").innerHTML = `<strong><u>Currently:</u></strong><br>Temperature: ${resData.currently.temperature}°C<br>Wind Speed: ${resData.currently.windSpeed} metres/sec`;
            document.getElementById("hourly").innerHTML = `<strong><u>Today:</u></strong><br>Summary: ${resData.hourly.summary}`;
            document.getElementById("days").innerHTML = `<strong><u>Next few days:</u></strong><br>Summary: ${resData.daily.summary}`;
        })
}
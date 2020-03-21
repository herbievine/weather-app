function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getData);
    } else {
        return displayError(null, 'Geolocation is not supported by your browser!', true)
    }
}

async function getData(pos) {
    const ds_url = `darksky-weather/:${pos.coords.latitude},${pos.coords.longitude}`;

    const ds_response = await fetch(ds_url);
    const ds_json = await ds_response.json();

    if (ds_json.code) {
        displayError(ds_json.code, ds_json.error, false);
        return console.log(`API Error ${ds_json.code} (${ds_json.error})`);
    } else if (!ds_json.code) {
        return displayData(ds_json)
    }
}

async function getInput() {
    const value = document.getElementById('input').value;
    document.getElementById('input').value = '';

    const regexEscape = /script|img|>|<|=/gi;

    if (regexEscape.test(value) || regexEscape.test(value)) {
        return displayError(null, 'XSS Injection Detected', true)
    } else if (!value) {
        return displayError(null, 'Please enter a city name', true)
    } else {
        let longitude, latitude, invalid, fromSearch;

        const url = `/open-weather/${value}`;

        const response = await fetch(url);
        const json = await response.json();

        if (json.cod && json.cod.toString().split('')[0] != '2') {
            invalid = true;
            displayError(json.cod, json.message.split('.')[0], false);
            return console.log(`API Error ${json.cod} (${json.message})`);
        } else if (!json.code) {
            longitude = json.coord.lon;
            latitude = json.coord.lat;
        }

        if (!invalid) {
            const ds_url = `darksky-weather/:${latitude},${longitude}`;

            const ds_response = await fetch(ds_url);
            const ds_json = await ds_response.json();

            if (ds_json.code) {
                displayError(ds_json.code, ds_json.error, false);
                return console.log(`API Error ${ds_json.code} (${ds_json.error})`);
            } else if (!ds_json.code) {
                fromSearch = true;
                displayData(ds_json);
                return initMap(null, fromSearch, ds_json);
            }
        }
    }
}

function displayData(data) {
    let location = data.timezone.split('/')[1];

    if (location.includes('_')) {
        location = location.replace(/_/g, " ")
    }

    document.getElementById("location").innerHTML = location;
    document.getElementById("current").innerHTML = `<strong><u>Currently:</u></strong><br>Temperature: ${data.currently.temperature}°C<br>Wind Speed: ${data.currently.windSpeed} metres/sec`;
    document.getElementById("hourly").innerHTML = `<strong><u>Today:</u></strong><br>Summary: ${data.hourly.summary}`;
    document.getElementById("days").innerHTML = `<strong><u>Next few days:</u></strong><br>Summary: ${data.daily.summary}`;

    showIcon(data);
}

function displayError(errorCode, errorMsg, onlyMsg) {
    if (errorCode && !onlyMsg) {
        if (errorCode.split('')[0] === 5) {
            onlyMsg = true;
            errorMsg = 'Sorry, something went wrong...';
        }
    }

    if (!onlyMsg) {
        document.getElementById("error-container").style.height = "30px";
        document.getElementById("error-container").style.transition = "height 0.3s ease-in";
        document.getElementById("error-msg").innerHTML = `Error: ${errorCode} - ${errorMsg}`;
    } else if (onlyMsg) {
        document.getElementById("error-container").style.height = "30px";
        document.getElementById("error-container").style.transition = "height 0.3s ease-in";
        document.getElementById("error-msg").innerHTML = errorMsg;
    }

    setTimeout(() => {
        document.getElementById("error-container").style.height = "0px";
        document.getElementById("error-container").style.transition = "height 0.3s ease-out";
        document.getElementById("error-msg").innerHTML = '';
    }, 5000);
}

function showIcon(icon) {
    const skycons = new Skycons({"color": "white"});

    skycons.add(document.getElementById("current-icon"), icon.currently.icon);
    skycons.add(document.getElementById("hourly-icon"), icon.hourly.icon);
    skycons.add(document.getElementById("days-icon"), icon.daily.icon);

    skycons.play();
}

// function mapCoords() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(initMap);
//     } else {
//         return displayError(null, 'Geolocation is not supported by your browser!', true)
//     }
// }

function initMap(p, c, d) {
    if (c) {
        const focus = {lat: d.latitude, lng: d.longitude};
        const map = new google.maps.Map(document.getElementById('map'), {zoom: 10, center: focus});
        const marker = new google.maps.Marker({position: focus, map: map});
    } else if (!c) {
        const focus = {lat: p.coords.latitude, lng: p.coords.longitude};
        const map = new google.maps.Map(document.getElementById('map'), {zoom: 10, center: focus});
        const marker = new google.maps.Marker({position: focus, map: map});
    }
}

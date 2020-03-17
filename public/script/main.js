async function getInput() {
    const value = document.getElementById('input').value;

    if (!value) {
        console.log('no fields')
        // TODO get error msgs
    } else {
        let longitude, latitude, invalid, fromSearch;

        const url = `/open-weather/${value}`;

        const response = await fetch(url);
        const json = await response.json();

        if (json.cod === '401' || json.cod === '404' || json.cod === '429') {
            // TODO errors handlers
            return invalid = true;
        } else {
            longitude = json.coord.lon;
            latitude = json.coord.lat;
        }

        if (!invalid) {
            const ds_url = `darksky-weather/:${latitude},${longitude}`;

            const ds_response = await fetch(ds_url);
            const ds_json = await ds_response.json();

            fromSearch = true;
            displaySearchedData(ds_json);
            initMap(null, fromSearch, ds_json);
        }
    }
}

function displaySearchedData(data) {
    document.getElementById("location").innerHTML = data.timezone;
    document.getElementById("current").innerHTML = `<strong><u>Currently:</u></strong><br>Temperature: ${data.currently.temperature}°C<br>Wind Speed: ${data.currently.windSpeed} metres/sec`;
    document.getElementById("hourly").innerHTML = `<strong><u>Today:</u></strong><br>Summary: ${data.hourly.summary}`;
    document.getElementById("days").innerHTML = `<strong><u>Next few days:</u></strong><br>Summary: ${data.daily.summary}`;
}

function mapCoords() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

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
require('dotenv').config('../.env');

const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const port = process.env.PORT || 5000;

const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.get('/open-weather/:city', async (req, res) => {
	const city = req.params.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    res.json(json);
});

app.get('/darksky-weather/::coords', async (req, res) => {
	const coords = req.params.coords.split(',');
    const url = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${coords[0]},${coords[1]}?units=si&exclude=alerts,flags`;
    const response = await fetch(url);
    const json = await response.json();
    res.json(json);
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});
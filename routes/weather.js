// const express = require('express');
// const axios = require('axios');
// const WeatherEntry = require('../models/WeatherEntry');

// const router = express.Router();

// // GET / -> Home page
// router.get('/', async (req, res) => {
//   try {
//     const entries = await WeatherEntry.find().sort({ date: -1 });
//     res.render('index', { entries, weather: null, error: null });
//   } catch (err) {
//     res.render('index', { entries: [], weather: null, error: 'Failed to load entries' });
//   }
// });

// // GET /history -> Saved searches page
// router.get('/history', async (req, res) => {
//   try {
//     const entries = await WeatherEntry.find().sort({ date: -1 });
//     res.render('history', { entries });
//   } catch (err) {
//     res.render('history', { entries: [] });
//   }
// });

// // POST /search -> Search weather
// router.post('/search', async (req, res) => {
//   const { city, state, country } = req.body;

//   let location = city;
//   if (state) location += `, ${state}`;
//   if (country) location += `, ${country}`;

//   try {
//     const response = await axios.get('http://api.weatherstack.com/current', {
//       params: {
//         access_key: process.env.WEATHER_API_KEY,
//         query: location
//       }
//     });

//     if (!response.data.current) throw new Error();

//     const weatherData = {
//       city: location,
//       temperature: response.data.current.temperature,
//       humidity: response.data.current.humidity,
//       wind_speed: response.data.current.wind_speed,
//       wind_dir: response.data.current.wind_dir,
//       visibility: response.data.current.visibility,
//       description: response.data.current.weather_descriptions[0],
//       description: response.data.current.weather_descriptions[0]

//     };

//     // Save to MongoDB Database 
//     const entry = new WeatherEntry(weatherData);
//     await entry.save();

//     const entries = await WeatherEntry.find().sort({ date: -1 });
//     res.render('index', { entries, weather: weatherData, error: null });

//   } catch (err) {
//     const entries = await WeatherEntry.find().sort({ date: -1 });
//     res.render('index', { entries, weather: null, error: 'Location not found' });
//   }
// });

// // POST /clear -> Delete all saved weather entries
// router.post('/clear', async (req, res) => {
//   try {
//     await WeatherEntry.deleteMany({});
//     res.redirect('/'); 
//   } catch (err) {
//     console.error(err);
//     const entries = await WeatherEntry.find().sort({ date: -1 });
//     res.render('index', { entries, weather: null, error: 'Failed to clear entries' });
//   }
// });

// module.exports = router;


const express = require('express');
const axios = require('axios');
const WeatherEntry = require('../models/WeatherEntry');

const router = express.Router();

// GET / -> Home page
router.get('/', async (req, res) => {
  try {
    const entries = await WeatherEntry.find().sort({ date: -1 });
    res.render('index', { entries, weather: null, error: null });
  } catch (err) {
    res.render('index', { entries: [], weather: null, error: 'Failed to load entries' });
  }
});

// GET /history -> Saved searches
router.get('/history', async (req, res) => {
  try {
    const entries = await WeatherEntry.find().sort({ date: -1 });
    res.render('history', { entries });
  } catch (err) {
    res.render('history', { entries: [] });
  }
});

// POST /search -> Search weather
router.post('/search', async (req, res) => {
  const { city, state, country } = req.body;

  let location = city;
  if (state) location += `, ${state}`;
  if (country) location += `, ${country}`;

  try {
    const response = await axios.get('http://api.weatherstack.com/current', {
      params: {
        access_key: process.env.WEATHER_API_KEY,
        query: location
      }
    });

    if (!response.data.current) throw new Error();

    const current = response.data.current;

    const weatherData = {
      city: location,
      temperature: current.temperature,
      feelslike: current.feelslike || null,
      humidity: current.humidity || null,
      wind_speed: current.wind_speed || null,
      wind_dir: current.wind_dir || null,
      visibility: current.visibility || null,
      description: current.weather_descriptions[0] || 'N/A',
      date: new Date()
    };

    // Save to MongoDB Database 
    const entry = new WeatherEntry(weatherData);
    await entry.save();

    const entries = await WeatherEntry.find().sort({ date: -1 });
    res.render('index', { entries, weather: weatherData, error: null });

  } catch (err) {
    const entries = await WeatherEntry.find().sort({ date: -1 });
    res.render('index', { entries, weather: null, error: 'Location not found or API error' });
  }
});

// POST /clear -> Delete all saved weather entries
router.post('/clear', async (req, res) => {
  try {
    await WeatherEntry.deleteMany({});
    res.redirect('/'); 
  } catch (err) {
    console.error(err);
    const entries = await WeatherEntry.find().sort({ date: -1 });
    res.render('index', { entries, weather: null, error: 'Failed to clear entries' });
  }
});

module.exports = router;

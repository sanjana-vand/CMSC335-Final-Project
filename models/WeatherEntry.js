const mongoose = require('mongoose');

const WeatherEntrySchema = new mongoose.Schema({
  city: { 
    type: String, 
    required: true 
  },
  temperature: { 
    type: Number, 
    required: true 
  },
  feelslike: { 
    type: Number, 
    required: false 
  },
  description: { 
    type: String,
    required: true 
  },
  humidity: { 
    type: Number, 
    required: false 
  },
  wind_speed: { 
    type: Number, 
    required: false 
  },
  wind_dir: { 
    type: String, 
    required: false 
  },
  visibility: { 
    type: Number, 
    required: false 
  }
});

module.exports = mongoose.model('WeatherEntry', WeatherEntrySchema);

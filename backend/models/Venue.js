const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  venueId: String,
  venuee: String,
  latitude: String,
  longitude: String,
  category: { type: [String], default: [] },
});

module.exports = mongoose.model('Venue', VenueSchema);

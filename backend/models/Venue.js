const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  venueId: String,
  venuee: String,
  latitude: String,
  longitude: String
});

module.exports = mongoose.model('Venue', VenueSchema);

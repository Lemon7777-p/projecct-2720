const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  titlee: String,
  venueid: String,
  cat1:String,
  predateE: String, // keep as string due to inconsistent formatting
  desce: String,
  presenterorge: String
});

module.exports = mongoose.model('Event', EventSchema);

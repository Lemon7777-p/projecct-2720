const axios = require('axios'); // to fetch remote XML data
const mongoose = require('mongoose');
const xml2js = require('xml2js');

const Event = require('./models/Event');
const Venue = require('./models/Venue');

const MONGO_URI = 'mongodb://127.0.0.1:27017/my_events_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected for data loading'))
  .catch(err => console.error(err));

const EVENTS_XML_URL = 'https://www.lcsd.gov.hk/datagovhk/event/events.xml';
const VENUES_XML_URL = 'https://www.lcsd.gov.hk/datagovhk/event/venues.xml';

async function loadEvents() {
  try {
    const response = await axios.get(EVENTS_XML_URL);
    const xmlData = response.data;

    const parser = new xml2js.Parser({ explicitArray: false, trim: true });
    const result = await parser.parseStringPromise(xmlData);

    let eventsArray = result.events.event;
    if (!Array.isArray(eventsArray)) {
      eventsArray = [eventsArray];
    }

    const eventsToInsert = eventsArray.map(e => ({
      titlee: e.titlee || '',
      cat1: e.cat1 || '',
      venueid: e.venueid || '',
      predateE: e.predateE || '',
      desce: e.desce || '',
      presenterorge: e.presenterorge || ''
    }));

    await Event.deleteMany({});
    await Event.insertMany(eventsToInsert);
    console.log(`Inserted ${eventsToInsert.length} events.`);
  } catch (err) {
    console.error('Error loading events:', err);
  }
}

async function loadVenues() {
  try {
    const response = await axios.get(VENUES_XML_URL);
    const xmlData = response.data;

    const parser = new xml2js.Parser({ explicitArray: false, trim: true });
    const result = await parser.parseStringPromise(xmlData);

    let venuesArray = result.venues.venue;
    if (!Array.isArray(venuesArray)) {
      venuesArray = [venuesArray];
    }

    const venuesToInsert = venuesArray.map(v => ({
      venueId: v.$.id,
      venuee: v.venuee || '',
      latitude: v.latitude || '',
      longitude: v.longitude || ''
    }));

    await Venue.deleteMany({});
    await Venue.insertMany(venuesToInsert);
    console.log(`Inserted ${venuesToInsert.length} venues.`);
  } catch (err) {
    console.error('Error loading venues:', err);
  }
}

async function run() {
  try {
    await loadEvents();
    await loadVenues();
  } catch (err) {
    console.error('Error loading data:', err);
  } finally {
    mongoose.connection.close();
  }
}

run();

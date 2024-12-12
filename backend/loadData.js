const fs = require('fs');
const mongoose = require('mongoose');
const xml2js = require('xml2js');

const Event = require('./models/Event');
const Venue = require('./models/Venue');

const MONGO_URI = 'mongodb://127.0.0.1:27017/my_events_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected for data loading'))
  .catch(err => console.error(err));

async function loadEvents() {
  const xmlData = fs.readFileSync('./events.xml', 'utf8');
  const parser = new xml2js.Parser({ explicitArray: false, trim: true });
  const result = await parser.parseStringPromise(xmlData);

  // Uncomment this to inspect the structure
  // console.log("Events result:", JSON.stringify(result, null, 2));

  let eventsArray = result.events.event;
  if (!Array.isArray(eventsArray)) {
    eventsArray = [eventsArray];
  }

  // Assuming xml2js returns the fields as strings directly:
  const eventsToInsert = eventsArray.map(e => ({
    titlee: e.titlee || '',
    venueid: e.venueid || '',
    predateE: e.predateE || '', 
    desce: e.desce || '',
    presenterorge: e.presenterorge || ''
  }));

  await Event.deleteMany({});
  await Event.insertMany(eventsToInsert);
  console.log(`Inserted ${eventsToInsert.length} events.`);
}

async function loadVenues() {
  const xmlData = fs.readFileSync('./venues.xml', 'utf8');
  const parser = new xml2js.Parser({ explicitArray: false, trim: true });
  const result = await parser.parseStringPromise(xmlData);

  // Uncomment this to inspect the structure
  // console.log("Venues result:", JSON.stringify(result, null, 2));

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

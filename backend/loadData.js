const mongoose = require('mongoose');
const xml2js = require('xml2js');
const axios = require('axios');  // For fetching remote XML files

const Event = require('./models/Event');
const Venue = require('./models/Venue');

// Helper to load events from remote XML
async function loadEvents() {
  try {
    const response = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/events.xml');
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
  } catch (error) {
    console.error('Error loading events:', error);
  }
}

// Helper to load venues from remote XML
async function loadVenues() {
  try {
    const response = await axios.get('https://www.lcsd.gov.hk/datagovhk/event/venues.xml');
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
  } catch (error) {
    console.error('Error loading venues:', error);
  }
}

module.exports = { loadEvents, loadVenues };

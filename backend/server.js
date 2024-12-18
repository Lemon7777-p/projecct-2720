const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userActions = require('./routes/userActions');
const adminActions = require('./routes/adminActions');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://127.0.0.1:27017/my_events_db';

// Wrap the connection in an async function and wait for the connection to be established
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);  // Exit the process if connection fails
  }
};

// Connect to the database first before starting the server
connectToDatabase().then(() => {
  // After MongoDB connection is established, set up the routes
  app.use('/auth', authRoutes);
  app.use('/user', userActions);
  app.use('/admin', adminActions);

  // Start the server after connection
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
});

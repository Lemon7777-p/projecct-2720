// server.js
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

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected."))
  .catch(err => console.error("MongoDB connection error:", err));

app.use('/auth', authRoutes);
app.use('/user', userActions);
app.use('/admin', adminActions);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

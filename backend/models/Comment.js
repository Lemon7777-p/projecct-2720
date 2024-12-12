const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  venueId: { type: String, required: true },
  user: { type: String, required: true }, // Username of the commenter
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);

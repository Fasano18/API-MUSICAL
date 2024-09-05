const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: String,
  genre: String,
  duration: Number,
  year: Number,
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);
module.exports = Song;

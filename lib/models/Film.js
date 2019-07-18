const mongoose = require('mongoose');

const filmSChema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true
  },
  cast: {
    type: [{
      role: {
        type: String,
        required: false,
      },
      actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
      }
    }],
  }
});

const Film = mongoose.model('Film', filmSChema);

module.exports = Film;

const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
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
      actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
      },
      role: {
        type: String,
        required: false,
      }
    }],
  }
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;

const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: false
  },
  pob: {
    type: String,
    required: false
  }
});

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;

require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('./seedData');
const connect = require('../lib/utils/connect');

const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Reviewer = require('../lib/models/Reviewer');
const Film = require('../lib/models/Film');

beforeAll(() => {
  return connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seedData();
});

afterAll(() => {
  return mongoose.connection.close();
});

const getStudio = () => {
  return Studio
    .findOne()
    .then(studio => JSON.parse(JSON.stringify(studio)));
};

const getActor = () => {
  return Actor
    .findOne()
    .then(actor => JSON.parse(JSON.stringify(actor)));
};

const getReviewer = () => {
  return Reviewer
    .findOne()
    .then(reviewer => JSON.parse(JSON.stringify(reviewer)));
};

const getFilm = () => {
  return Film
    .findOne()
    .then(film => JSON.parse(JSON.stringify(film)));
};

module.exports = {
  getStudio,
  getActor,
  getReviewer,
  getFilm
};

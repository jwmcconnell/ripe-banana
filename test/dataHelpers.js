require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('./seedData');
const connect = require('../lib/utils/connect');

const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

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

module.exports = {
  getStudio,
  getActor
};

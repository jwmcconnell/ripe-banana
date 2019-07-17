require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('./seedData');
const connect = require('../lib/utils/connect');

const Studio = require('../lib/models/Studio');

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

module.exports = {
  getStudio
};

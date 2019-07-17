const Studio = require('../lib/models/Studio');

const seedStudios = [
  {
    name: 'Fox'
  }
];

function seedData() {
  return Promise.all(seedStudios.map(studio => {
    const { name, address } = studio;
    return Studio.create({ name, address });
  }));
}

module.exports = seedData;

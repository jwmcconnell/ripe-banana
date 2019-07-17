const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

const seedStudios = [
  {
    name: 'Fox'
  },
  {
    name: 'Black Box',
    address: {
      city: 'New York',
      state: 'New York',
      country: 'USA'
    }
  }
];

const seedActors = [
  {
    name: 'Tom Hardy'
  },
  {
    name: 'Hugh Jackman',
    dob: new Date(),
    pob: 'Australia'
  }
];

function seedData() {
  return Promise.all(seedStudios.map(studio => {
    const { name, address } = studio;
    return Studio.create({ name, address });
  }))
    .then(() => {
      return Promise.all(seedActors.map(actor => {
        const { name, dob, pob } = actor;
        return Actor.create({ name, dob, pob });
      }));
    });
}

module.exports = seedData;

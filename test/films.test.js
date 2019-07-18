require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');

const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');

describe('film routes', () => {
  it('creates and returns a film', async() => {
    const actors = await Actor.create([{ name: 'somename' }, { name: 'othername' }]);
    const studio = await Studio.create({ name: 'studio-name' });
    return request(app)
      .post('/api/v1/films')
      .send({
        title: 'lance`s movie',
        studio: studio._id,
        released: 2019,
        cast: [{ actor: actors[0]._id }, { actor: actors[1]._id }]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'lance`s movie',
          studio: studio._id.toString(),
          released: 2019,
          cast: [
            expect.objectContaining({
              actor: actors[0]._id.toString()
            }),
            expect.objectContaining({
              actor: actors[1]._id.toString()
            })
          ],
          __v: 0
        });
      });
  });

  it('returns a list of all films', async() => {
    const actors = await Actor.create([{ name: 'somename' }, { name: 'othername' }]);
    const studio = await Studio.create([{ name: 'studio-name' }, { name: 'other-studio-name' }]);
    const films = await Film.create([{
      title: 'Crazy Film',
      studio: studio[0]._id,
      released: 2014,
      cast: [{ actor: actors[0]._id }, { actor: actors[1]._id }]
    },
    {
      title: 'Great Film',
      studio: studio[1]._id,
      released: 2010,
      cast: [{ actor: actors[1]._id }]
    }]);

    let filmsWithStudio = [
      {
        _id: films[0]._id,
        title: 'Crazy Film',
        studio: { _id: studio[0]._id, name: studio[0].name },
        released: 2014,
      },
      {
        _id: films[1]._id,
        title: 'Great Film',
        studio: { _id: studio[1]._id, name: studio[1].name },
        released: 2010,
      }
    ];
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        const filmsJSON = JSON.parse(JSON.stringify(filmsWithStudio));
        filmsJSON.forEach(f => {
          delete f.__v;
          delete f.cast;
          expect(res.body).toContainEqual(f);
        });
      });
  });
});

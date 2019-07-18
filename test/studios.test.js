require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');

const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');

describe('studio routes', () => {
  it('creates a studio and returns it', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({
        name: 'Paramount',
        address: {
          city: 'Los Angeles',
          state: 'California',
          country: 'USA'
        }
      })
      .then(res => {
        expect(res.body).toEqual(expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String),
          __v: 0
        }));
      });
  });

  it('returns a list of studios', () => {
    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          name: expect.any(String)
        });
      });
  });

  it('returns a studio with its films by id', async() => {
    const actors = await Actor.create([{ name: 'somename' }, { name: 'othername' }]);
    const studio = await Studio.create({
      name: 'studio-name',
      address: {
        city: 'somecity',
        state: 'somestate',
        country: 'somecountry'
      }
    });
    const films = await Film.create([{
      title: 'Crazy Film',
      studio: studio._id,
      released: 2014,
      cast: [{ actor: actors[0]._id }, { actor: actors[1]._id }]
    },
    {
      title: 'Great Film',
      studio: studio._id,
      released: 2010,
      cast: [{ actor: actors[1]._id }]
    }]);

    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        const filmsJSON = JSON.parse(JSON.stringify(films));
        filmsJSON.forEach(film => {
          delete film.studio;
          delete film.cast;
          delete film.released;
          delete film.__v;
          expect(res.body.films).toContainEqual(film);
        });
        expect(res.body).toEqual({
          _id: studio._id.toString(),
          name: 'studio-name',
          address: {
            city: 'somecity',
            state: 'somestate',
            country: 'somecountry'
          },
          films: expect.any(Array)
        });
      });
  });
});

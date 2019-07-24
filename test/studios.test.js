require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');

const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');

describe('studio routes', () => {
  let films;
  let studios;
  beforeEach(async() => {
    const actors = await Actor.create([{ name: 'somename' }, { name: 'othername' }]);
    studios = await Studio.create([{
      name: 'studio-name',
      address: {
        city: 'somecity',
        state: 'somestate',
        country: 'somecountry'
      }
    },
    {
      name: 'delete-studio',
      address: {
        city: 'deletecity',
        state: 'deletestate',
        country: 'deletecountry'
      }
    }
    ]);
    films = await Film.create([{
      title: 'Crazy Film',
      studio: studios[0]._id,
      released: 2014,
      cast: [{ actor: actors[0]._id }, { actor: actors[1]._id }]
    },
    {
      title: 'Great Film',
      studio: studios[0]._id,
      released: 2010,
      cast: [{ actor: actors[1]._id }]
    }]);
  });

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
    return request(app)
      .get(`/api/v1/studios/${studios[0]._id}`)
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
          _id: studios[0]._id.toString(),
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

  it('deletes and returns the deleted studio', () => {
    return request(app)
      .delete(`/api/v1/studios/${studios[1]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: studios[1]._id.toString(),
          name: 'delete-studio',
          address: {
            city: 'deletecity',
            state: 'deletestate',
            country: 'deletecountry'
          },
          __v: 0
        });
      });
  });

  it('returns an error when trying to delete a studio which has a film', () => {
    return request(app)
      .delete(`/api/v1/studios/${studios[0]._id}`)
      .then(res => {
        expect(res.status).toEqual(409);
      });
  });
});

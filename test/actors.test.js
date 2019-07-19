const { getActor } = require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');

describe('actor routes', () => {
  let actors;
  beforeEach(async() => {
    actors = await Actor.create([
      { name: 'somename', dob: new Date('03-18-1996'), pob: 'Cleveland' },
      { name: 'othername' },
      { name: 'to-be-deleted' }
    ]);
    const studio = await Studio.create([{ name: 'studio-name' }, { name: 'other-studio-name' }]);
    await Film.create([{
      title: 'Crazy Film',
      studio: studio[0]._id,
      released: 2014,
      cast: [{ actor: actors[0]._id, role: 'Lead' }, { actor: actors[1]._id, role: 'Supporting' }]
    },
    {
      title: 'Great Film',
      studio: studio[1]._id,
      released: 2010,
      cast: [{ actor: actors[1]._id }]
    }]);
  });

  it('creates and returns an actor', () => {
    const myDate = new Date(96, 2, 18);
    return request(app)
      .post('/api/v1/actors')
      .send({
        name: 'Jack McConnell',
        dob: myDate,
        pob: 'Cleveland'
      })
      .then(res => {
        expect(res.body).toEqual(expect.objectContaining({
          _id: expect.any(String),
          name: 'Jack McConnell',
          dob: myDate.toISOString(),
          pob: 'Cleveland',
          __v: 0
        }));
      });
  });

  it('returns a list of all actors', () => {
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body[0]).toEqual(expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String),
        }));
      });
  });

  it('returns an actor by their id', async() => {
    return request(app)
      .get(`/api/v1/actors/${actors[0]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: expect.any(String),
          dob: expect.any(String),
          pob: expect.any(String),
          films: expect.any(Array)
        });
        expect(res.body.films[0]).toEqual({
          _id: expect.any(String),
          title: expect.any(String),
          released: expect.any(Number)
        });
      });
  });

  it('updates and returns the updated actor', async() => {
    const myDate = new Date(99, 5, 8);
    const { _id } = await getActor();
    return request(app)
      .put(`/api/v1/actors/${_id}`)
      .send({
        name: 'updated-name',
        dob: myDate,
        pob: 'Columbus'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id,
          name: 'updated-name',
          dob: myDate.toISOString(),
          pob: 'Columbus',
          __v: 0
        });
      });
  });

  it('deletes and returns the deleted actor', () => {
    return request(app)
      .delete(`/api/v1/actors/${actors[2]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: actors[2]._id.toString(),
          name: actors[2].name,
          __v: 0
        });
      });
  });

  it('returns an error when attempting to delete an actor who is in a film', () => {
    return request(app)
      .delete(`/api/v1/actors/${actors[0]._id}`)
      .then(res => {
        expect(res.status).toEqual(409);
      });
  });
});

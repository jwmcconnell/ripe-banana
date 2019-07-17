require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');

const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

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
        cast: [
          {
            actor: actors[0]._id
          },
          {
            actor: actors[1]._id
          }
        ]
      })
      .then(res => {
        expect(res.body).toEqual(expect.objectContaining({
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
        }));
      });
  });
});

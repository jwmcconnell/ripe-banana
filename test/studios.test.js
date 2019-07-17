const { getStudio } = require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');

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
        expect(res.body[0]).toEqual(expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String),
          __v: 0
        }));
      });
  });

  it('returns a studio by its id', async() => {
    const { _id } = await getStudio();
    return request(app)
      .get(`/api/v1/studios/${_id}`)
      .then(res => {
        expect(res.body).toEqual(expect.objectContaining({
          _id,
          name: expect.any(String),
          __v: 0
        }));
      });
  });
});

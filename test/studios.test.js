require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');

describe('app routes', () => {
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
});

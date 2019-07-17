require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');

describe('actor routes', () => {
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
});

require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');

describe('reviewer routes', () => {
  it('creates and returns a reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({
        name: 'test-name',
        company: 'test-company'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'test-name',
          company: 'test-company',
          __v: 0
        });
      });
  });

  it('returns a list of reviewers', () => {
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          name: expect.any(String),
          company: expect.any(String),
          __v: 0
        });
      });
  });
});

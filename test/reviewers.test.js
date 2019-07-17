const { getReviewer } = require('./dataHelpers');
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

  it('returns a reviewer by their id', async() => {
    const { _id, name, company } = await getReviewer();
    return request(app)
      .get(`/api/v1/reviewers/${_id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id,
          name,
          company,
          __v: 0
        });
      });
  });

  it('updates and returs a reviewer by their id', async() => {
    const { _id } = await getReviewer();
    return request(app)
      .put(`/api/v1/reviewers/${_id}`)
      .send({
        name: 'updated-name',
        company: 'updated-company'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id,
          name: 'updated-name',
          company: 'updated-company',
          __v: 0
        });
      });
  });
});

const { getReviewer } = require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');

const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');

describe('reviewer routes', () => {

  let reviewer;
  let film;
  beforeEach(async() => {
    const actors = await Actor.create([{ name: 'somename' }, { name: 'othername' }]);
    const studio = await Studio.create({
      name: 'studio-name',
      address: {
        city: 'somecity',
        state: 'somestate',
        country: 'somecountry'
      }
    });
    film = await Film.create({
      title: 'Crazy Film',
      studio: studio._id,
      released: 2014,
      cast: [{ actor: actors[0]._id }, { actor: actors[1]._id }]
    });
    reviewer = await Reviewer.create({ name: 'jack-reviewer', company: 'jacks-reviews' });
    await Review.create([
      {
        rating: 5,
        reviewer: reviewer._id,
        review: 'Simply amazing.',
        film: film._id
      },
      {
        rating: 3,
        reviewer: reviewer._id,
        review: 'Enjoyable',
        film: film._id
      }
    ]);
  });

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
        });
      });
  });

  it('returns a reviewer by their id', async() => {
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id.toString(),
          name: reviewer.name,
          company: reviewer.company,
          reviews: expect.any(Array)
        });
        expect(res.body.reviews[0]).toEqual({
          _id: expect.any(String),
          rating: expect.any(Number),
          review: expect.any(String),
          film: {
            _id: expect.any(String),
            title: expect.any(String)
          }
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

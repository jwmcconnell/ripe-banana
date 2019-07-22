require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');

const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');

describe('review routes', () => {
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

  it('creates a review and returns it', async() => {
    return request(app)
      .post('/api/v1/reviews')
      .send({
        rating: 4,
        reviewer: reviewer._id,
        review: 'Its an absolute wonder!',
        film: film._id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          reviewer: reviewer._id.toString(),
          rating: 4,
          review: 'Its an absolute wonder!',
          film: film._id.toString(),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0
        });
      });
  });

  it('creates a review and returns it', async() => {
    return request(app)
      .post('/api/v1/reviews')
      .send({
        rating: 0,
        reviewer: reviewer._id,
        review: 'Its an absolute wonder!',
        film: film._id
      })
      .then(res => {
        expect(res.status).toEqual(400);
      });
  });

  it('creates a review and returns it', async() => {
    return request(app)
      .post('/api/v1/reviews')
      .send({
        rating: 6,
        reviewer: reviewer._id,
        review: 'Its an absolute wonder!',
        film: film._id
      })
      .then(res => {
        expect(res.status).toEqual(400);
      });
  });

  it('returns a list of reviews limited to the 100 most recent', async() => {
    let manyReviews = new Array(150);
    for(let i = 0; i < manyReviews.length; i++) {
      manyReviews[i] = i;
    }

    await Promise.all(manyReviews.map((review, i) => {
      return Review.create({
        rating: 3,
        reviewer: reviewer._id,
        review: i.toString(),
        film: film._id
      });
    }));

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body.length).toEqual(100);
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          rating: expect.any(Number),
          review: expect.any(String),
          film: {
            _id: expect.any(String),
            title: expect.any(String)
          },
        });
      });
  });
});

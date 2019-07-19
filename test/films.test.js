const { getFilm } = require('./dataHelpers');
const request = require('supertest');
const app = require('../lib/app');

const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
const Film = require('../lib/models/Film');

describe('film routes', () => {
  let films;
  let studios;
  beforeEach(async() => {
    const actors = await Actor.create([{ name: 'somename' }, { name: 'othername' }]);
    studios = await Studio.create([{ name: 'studio-name' }, { name: 'other-studio-name' }]);
    films = await Film.create([{
      title: 'Crazy Film',
      studio: studios[0]._id,
      released: 2014,
      cast: [{ actor: actors[0]._id, role: 'Lead' }, { actor: actors[1]._id, role: 'Supporting' }]
    },
    {
      title: 'Great Film',
      studio: studios[1]._id,
      released: 2010,
      cast: [{ actor: actors[1]._id, role: 'Lead' }]
    }]);
  });

  it('creates and returns a film', async() => {
    const actors = await Actor.create([{ name: 'sally' }, { name: 'jacob' }]);
    const studio = await Studio.create({ name: 'studio-name' });
    return request(app)
      .post('/api/v1/films')
      .send({
        title: 'lance`s movie',
        studio: studio._id,
        released: 2019,
        cast: [{ actor: actors[0]._id }, { actor: actors[1]._id }]
      })
      .then(res => {
        expect(res.body).toEqual({
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
        });
      });
  });

  it('returns a list of all films', async() => {
    let filmsWithStudio = [
      {
        _id: films[0]._id,
        title: 'Crazy Film',
        studio: { _id: studios[0]._id, name: studios[0].name },
        released: 2014,
      },
      {
        _id: films[1]._id,
        title: 'Great Film',
        studio: { _id: studios[1]._id, name: studios[1].name },
        released: 2010,
      }
    ];
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        const filmsJSON = JSON.parse(JSON.stringify(filmsWithStudio));
        filmsJSON.forEach(f => {
          expect(res.body).toContainEqual(f);
        });
      });
  });

  it('returns a film retrieved by it`s _id', async() => {
    const reviewer = await Reviewer.create({ name: 'jack-reviewer', company: 'jacks-reviews' });
    await Review.create([
      {
        rating: 5,
        reviewer: reviewer._id,
        review: 'Simply amazing.',
        film: films[0]._id
      },
      {
        rating: 3,
        reviewer: reviewer._id,
        review: 'Enjoyable',
        film: films[0]._id
      }
    ]);

    return request(app)
      .get(`/api/v1/films/${films[0]._id}`)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
          title: 'Crazy Film',
          studio: {
            _id: studios[0]._id.toString(),
            name: 'studio-name'
          },
          released: 2014,
          cast: expect.any(Array),
          reviews: expect.any(Array)
        });
        expect(res.body.cast[0]).toEqual({
          _id: expect.any(String),
          role: expect.any(String),
          actor: {
            _id: expect.any(String),
            name: expect.any(String)
          }
        });
        expect(res.body.reviews[0]).toEqual({
          _id: expect.any(String),
          rating: expect.any(Number),
          review: expect.any(String),
          reviewer: {
            _id: expect.any(String),
            name: expect.any(String)
          }
        });
      });
  });

  it('deletes and returns a film', async() => {
    const { _id } = await getFilm();
    return request(app)
      .delete(`/api/v1/films/${_id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: expect.any(String),
          studio: expect.any(String),
          released: expect.any(Number),
          cast: expect.any(Array),
          __v: 0
        });
      });
  });
});

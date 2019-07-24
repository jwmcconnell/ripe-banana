const { Router } = require('express');
const Film = require('../models/Film');
const Review = require('../models/Review');


module.exports = Router()
  .post('/', (req, res, next) => {
    const { title, studio, released, cast } = req.body;
    Film
      .create({ title, studio, released, cast })
      .then(film => res.send(film))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Film
      .find()
      .select({ __v: false, cast: false })
      .populate('studio', 'name')
      .then(films => res.send(films))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Promise.all([
      Film
        .findById(req.params.id)
        .select({ __v: false, _id: false })
        .populate('cast.actor', 'name')
        .populate('studio', 'name')
        .lean(),
      Review
        .find({ film: req.params.id })
        .select({
          __v: false,
          createdAt: false,
          updatedAt: false,
          film: false
        })
        .populate('reviewer', 'name')
        .lean()
    ])
      .then(([film, reviews]) => res.send({ ...film, reviews }))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Film
      .findByIdAndDelete(req.params.id)
      .then(film => res.send(film))
      .catch(next);
  });

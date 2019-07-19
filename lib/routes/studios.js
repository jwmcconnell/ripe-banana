const { Router } = require('express');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { name, address } = req.body;
    Studio
      .create({ name, address })
      .then(studio => res.send(studio))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Studio
      .find()
      .select({
        __v: false,
        address: false
      })
      .then(studios => res.send(studios))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Promise.all([
      Studio
        .findById(req.params.id)
        .lean()
        .select({ __v: false }),
      Film
        .find({ studio: req.params.id })
        .lean()
        .select({ __v: false, studio: false, cast: false, released: false })
    ])
      .then(([studio, films]) => res.send({ ...studio, films }))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Film
      .find({ studio: req.params.id })
      .then(studios => {
        if(studios.length === 0) return req.params.id;
        const err = new Error('Can not delete studio which has a film.');
        err.status = 409;
        throw err;
      })
      .then(id => {
        Studio
          .findByIdAndDelete(id)
          .then(studio => res.send(studio));
      })
      .catch(next);
  });

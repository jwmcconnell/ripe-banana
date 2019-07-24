const { Router } = require('express');
const Actor = require('../models/Actor');
const Film = require('../models/Film');


module.exports = Router()
  .post('/', (req, res, next) => {
    const { name, dob, pob } = req.body;
    Actor
      .create({ name, dob, pob })
      .then(actor => res.send(actor))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Actor
      .find()
      .select({ __v: false })
      .then(actors => res.send(actors))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Promise.all([
      Actor
        .findById(req.params.id)
        .lean()
        .select({ __v: false, _id: false }),
      Film
        .find({ 'cast.actor': req.params.id })
        .select({ cast: false, __v: false, studio: false })
        .lean()
    ])
      .then(([actor, films]) => res.send({ ...actor, films }))
      .catch(next);

  })
  .put('/:id', (req, res, next) => {
    const { name, dob, pob } = req.body;
    Actor
      .findByIdAndUpdate(req.params.id, { name, dob, pob }, { new: true })
      .then(actor => res.send(actor))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Film
      .find({ 'cast.actor': req.params.id })
      .then(films => {
        if(films.length === 0) return req.params.id;
        const err = new Error('Can not delete actor who is in a film.');
        err.status = 409;
        throw err;
      })
      .then(id => {
        Actor
          .findByIdAndDelete(id)
          .then(actor => res.send(actor));
      })
      .catch(next);
  });

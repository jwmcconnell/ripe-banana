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
      .then(([actor, films]) => res.send({ ...actor, films }));

  })
  .put('/:id', (req, res, next) => {
    const { name, dob, pob } = req.body;
    Actor
      .findByIdAndUpdate(req.params.id, { name, dob, pob }, { new: true })
      .then(actor => res.send(actor))
      .catch(next);
  });

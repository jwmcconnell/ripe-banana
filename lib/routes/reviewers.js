const { Router } = require('express');
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { name, company } = req.body;
    Reviewer
      .create({ name, company })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .select({ __v: 0 })
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Promise.all([
      Reviewer
        .findById(req.params.id)
        .select({ __v: false })
        .lean(),
      Review
        .find({ reviewer: req.params.id })
        .populate('film', 'title')
        .select({ __v: false, createdAt: false, updatedAt: false, reviewer: false })
        .lean()
    ])
      .then(([reviewer, reviews]) => res.send({ ...reviewer, reviews }))
      .catch(next);
  })
  .put('/:id', (req, res, next) => {
    const { name, company } = req.body;
    Reviewer
      .findByIdAndUpdate(req.params.id, { name, company }, { new: true })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  });

const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { rating, reviewer, review, film } = req.body;
    Review
      .create({ rating, reviewer, review, film })
      .then(review => res.send(review))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Review
      .find()
      .select({
        __v: false,
        createdAt: false,
        updatedAt: false,
        reviewer: false
      })
      .limit(100)
      .populate('film', 'title')
      .then(films => res.send(films))
      .catch(next);
  });

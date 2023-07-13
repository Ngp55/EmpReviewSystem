const express = require('express');
const router = express.Router(); 
const reviewsController = require('../controllers/review_controller');

router.post('/newReview/:id' , reviewsController.newReview);

module.exports = router;


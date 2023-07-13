const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');
// const empController = require('../controllers/employee_controller');



router.get('/', homeController.home);
// router.use('/users',require('./users'));
// router.get('/emp', empController.employee);

router.use('/users', require('./users'));
router.use('/admin', require('./admin'));
router.use('/reviews', require('./reviews'));

console.log('router Index is loaded');




module.exports = router;
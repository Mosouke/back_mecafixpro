const express = require('express');
const router = express.Router();
const carController = require('../controllers/CarsController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', carController.getCars);
router.get('/:car_id', carController.getCar);
router.post('/add/:client_id', carController.createCar);
router.put('/update/:car_id', carController.updateCar);

module.exports = router;

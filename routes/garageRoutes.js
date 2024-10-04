const express = require('express');
const router = express.Router();
const garageController = require('../controllers/GaragesController');
const authMiddleware = require('../middleware/auth');


router.get('/', garageController.getGarages);

router.get('/:garage_id', garageController.getGarage);

router.get('/city/:city', garageController.getGaragesByCity);

router.post('/add', authMiddleware, garageController.createGarage);

router.put('/update/:garage_id', authMiddleware, garageController.updateGarage);

module.exports = router;

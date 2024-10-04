const express = require('express');
const router = express.Router();
const garageController = require('../controllers/GaragesController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');  // Import correct des middlewares


router.get('/', garageController.getGarages);

router.get('/:garage_id', garageController.getGarage);

router.get('/city/:city', garageController.getGaragesByCity);

router.post('/add', authMiddleware, adminMiddleware, garageController.createGarage);

router.put('/update/:garage_id', authMiddleware, adminMiddleware, garageController.updateGarage);

module.exports = router;

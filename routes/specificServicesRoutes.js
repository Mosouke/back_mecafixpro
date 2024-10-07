const express = require('express');
const router = express.Router();
const specificServicesController = require('../controllers/SpecificServicesControllers');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', specificServicesController.getSpecificServices);

router.get('/:specificServices_id', specificServicesController.getSpecificService);

router.post('/add', authMiddleware, adminMiddleware, specificServicesController.createSpecificServices);

router.put('/update/:specificServices_id', authMiddleware, adminMiddleware, specificServicesController.updateSpecificService);

module.exports = router;

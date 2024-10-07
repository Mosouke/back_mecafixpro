const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/ServController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', serviceController.getServices);

router.get('/:service_id', serviceController.getService);

router.post('/add', authMiddleware, adminMiddleware, serviceController.createService);

router.put('/update/:service_id', authMiddleware, adminMiddleware, serviceController.updateService);

module.exports = router;
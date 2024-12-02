// @ts-nocheck
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/ServController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

/**
 * @module routes/services
 */

/**
 * @route GET /services
 * @group Services - Operations about services
 * @returns {Array.<Service>} 200 - An array of services
 * @returns {Error}  default - Unexpected error
 */
router.get('/', serviceController.getAllServices);

/**
 * @route GET /services/{service_id}
 * @param {number} service_id.path.required - ID du service
 * @group Services - Operations about services
 * @returns {Service} 200 - Un service
 * @returns {Error}  default - Service non trouvé
 */
router.get('/:service_id', serviceController.getService);

/**
 * @route POST /services/add
 * @group Services - Operations about services
 * @param {Service.model} Service.body.required - Service to add
 * @security JWT
 * @returns {Service} 201 - Service créé
 * @returns {Error}  default - Unexpected error
 */
router.post('/add', authMiddleware, adminMiddleware, serviceController.createService);

/**
 * @route PUT /services/update/{service_id}
 * @param {number} service_id.path.required - ID du service
 * @param {Service.model} Service.body.required - Service à mettre à jour
 * @security JWT
 * @group Services - Operations about services
 * @returns {Service} 200 - Service mis à jour
 * @returns {Error}  default - Service non trouvé ou mise à jour échouée
 */
router.put('/update/:service_id', authMiddleware, adminMiddleware, serviceController.updateService);

module.exports = router;

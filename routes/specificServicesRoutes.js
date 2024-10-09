// @ts-nocheck
const express = require('express');
const router = express.Router();
const specificServicesController = require('../controllers/SpecificServicesControllers');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

/**
 * @module routes/specificServices
 */

/**
 * @route GET /specific-services
 * @group Specific Services - Operations about specific services
 * @returns {Array.<SpecificService>} 200 - An array of specific services
 * @returns {Error}  default - Unexpected error
 */
router.get('/', specificServicesController.getSpecificServices);

/**
 * @route GET /specific-services/{specificServices_id}
 * @param {number} specificServices_id.path.required - ID du service spécifique
 * @group Specific Services - Operations about specific services
 * @returns {SpecificService} 200 - Un service spécifique
 * @returns {Error}  default - Service spécifique non trouvé
 */
router.get('/:specificServices_id', specificServicesController.getSpecificService);

/**
 * @route POST /specific-services/add
 * @group Specific Services - Operations about specific services
 * @param {SpecificService.model} SpecificService.body.required - Service spécifique à ajouter
 * @security JWT
 * @returns {SpecificService} 201 - Service spécifique créé
 * @returns {Error}  default - Unexpected error
 */
router.post('/add', authMiddleware, adminMiddleware, specificServicesController.createSpecificServices);

/**
 * @route PUT /specific-services/update/{specificServices_id}
 * @param {number} specificServices_id.path.required - ID du service spécifique
 * @param {SpecificService.model} SpecificService.body.required - Service spécifique à mettre à jour
 * @security JWT
 * @group Specific Services - Operations about specific services
 * @returns {SpecificService} 200 - Service spécifique mis à jour
 * @returns {Error}  default - Service spécifique non trouvé ou mise à jour échouée
 */
router.put('/update/:specificServices_id', authMiddleware, adminMiddleware, specificServicesController.updateSpecificService);

module.exports = router;

// @ts-nocheck
const express = require('express');
const router = express.Router();
const garageController = require('../controllers/GaragesController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

/**
 * @module routes/garages
 */

/**
 * @route GET /garages
 * @group Garages - Operations about garages
 * @returns {Array.<Garage>} 200 - An array of garages
 * @returns {Error}  default - Unexpected error
 */
router.get('/', garageController.getGarages);

/**
 * @route GET /garages/{garage_id}
 * @param {number} garage_id.path.required - ID du garage
 * @group Garages - Operations about garages
 * @returns {Garage} 200 - Un garage
 * @returns {Error}  default - Garage non trouvé
 */
router.get('/:garage_id', garageController.getGarage);

/**
 * @route GET /garages/city/{city}
 * @param {string} city.path.required - Nom de la ville
 * @group Garages - Operations about garages
 * @returns {Array.<Garage>} 200 - An array of garages in the specified city
 * @returns {Error}  default - Unexpected error
 */
router.get('/city/:city', garageController.getGaragesByCity);

/**
 * @route POST /garages/add
 * @group Garages - Operations about garages
 * @param {Garage.model} Garage.body.required - Garage to add
 * @security JWT
 * @returns {Garage} 201 - Garage créé
 * @returns {Error}  default - Unexpected error
 */
router.post('/add', authMiddleware, adminMiddleware, garageController.createGarage);

/**
 * @route PUT /garages/update/{garage_id}
 * @param {number} garage_id.path.required - ID du garage
 * @param {Garage.model} Garage.body.required - Garage à mettre à jour
 * @security JWT
 * @group Garages - Operations about garages
 * @returns {Garage} 200 - Garage mis à jour
 * @returns {Error}  default - Garage non trouvé ou mise à jour échouée
 */
router.put('/update/:garage_id', authMiddleware, adminMiddleware, garageController.updateGarage);

module.exports = router;

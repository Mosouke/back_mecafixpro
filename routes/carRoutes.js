// @ts-nocheck
const express = require('express');
const router = express.Router();
const carController = require('../controllers/CarsController');
const { authMiddleware } = require('../middleware/auth');

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

/**
 * @route GET /cars
 * @group Cars - Operations about cars
 * @returns {Array.<Object>} 200 - An array of car objects.
 * @returns {Object} 500 - Internal server error.
 */
router.get('/', carController.getAllCars);

/**
 * @route GET /cars/{car_id}
 * @group Cars - Operations about cars
 * @param {number} car_id.path.required - ID of the car to fetch.
 * @returns {Object} 200 - Car object.
 * @returns {Object} 404 - Car not found.
 * @returns {Object} 500 - Internal server error.
 */
router.get('/:car_id', carController.getCar);

/**
 * @route POST /cars/add/{client_id}
 * @group Cars - Operations about cars
 * @param {number} client_id.path.required - ID of the client adding the car.
 * @param {Object} req - The request object containing car data.
 * @param {string} req.body.car_marque - Brand of the car.
 * @param {string} req.body.car_modele - Model of the car.
 * @param {number} req.body.car_year - Year of the car.
 * @returns {Object} 201 - Car successfully created.
 * @returns {Object} 400 - Bad request if validation fails.
 * @returns {Object} 500 - Internal server error.
 */
router.post('/add/:client_id', carController.createCar);

/**
 * @route PUT /cars/update/{car_id}/{client_id}
 * @group Cars - Operations about cars
 * @param {number} car_id.path.required - ID of the car to update.
 * @param {number} client_id.path.arequired - ID of the client updating the car.
 * @param {Object} req - The request object containing updated car data.
 * @param {string} req.body.car_marque - Brand of the car (optional).
 * @param {string} req.body.car_modele - Model of the car (optional).
 * @param {number} req.body.car_year - Year of the car (optional).
 * @returns {Object} 200 - Car successfully updated.
 * @returns {Object} 404 - Car not found.
 * @returns {Object} 400 - Bad request if validation fails.
 * @returns {Object} 500 - Internal server error.
 */
router.put('/update/:car_id/:client_id', carController.updateCar);

module.exports = router;

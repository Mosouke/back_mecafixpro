// @ts-nocheck
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authMiddleware } = require('../middleware/auth');
const { validateClientCreation, validateClientUpdate } = require('../middleware/validator');

/**
 * @route GET /clients
 * @group Clients - Operations about clients
 * @returns {Array.<Object>} 200 - An array of client objects.
 * @returns {Object} 500 - Internal server error.
 */
router.get('/', authMiddleware, clientController.getClients);

/**
 * @route GET /clients/{client_id}
 * @group Clients - Operations about clients
 * @param {number} client_id.path.required - ID of the client to fetch.
 * @returns {Object} 200 - Client object.
 * @returns {Object} 404 - Client not found.
 * @returns {Object} 500 - Internal server error.
 * @security {}
 */
router.get('/:client_id', authMiddleware, clientController.getClient);

/**
 * @route POST /clients/add
 * @group Clients - Operations about clients
 * @param {Object} req - The request object containing client data.
 * @param {string} req.body.client_image_name - Name of the client's image.
 * @param {string} req.body.client_name - Name of the client.
 * @param {string} req.body.client_last_name - Last name of the client.
 * @param {string} req.body.client_phone_number - Phone number of the client.
 * @param {string} req.body.client_address - Address of the client.
 * @returns {Object} 201 - Client successfully created.
 * @returns {Object} 400 - Bad request if validation fails.
 * @returns {Object} 500 - Internal server error.
 * @security {}
 */
router.post('/add', authMiddleware, validateClientCreation, clientController.createClient);

/**
 * @route PUT /clients/update/{client_id}
 * @group Clients - Operations about clients
 * @param {number} client_id.path.required - ID of the client to update.
 * @param {Object} req - The request object containing updated client data.
 * @param {string} req.body.client_image_name - Name of the client's image (optional).
 * @param {string} req.body.client_name - Name of the client (optional).
 * @param {string} req.body.client_last_name - Last name of the client (optional).
 * @param {string} req.body.client_phone_number - Phone number of the client (optional).
 * @param {string} req.body.client_address - Address of the client (optional).
 * @returns {Object} 200 - Client successfully updated.
 * @returns {Object} 404 - Client not found.
 * @returns {Object} 400 - Bad request if validation fails.
 * @returns {Object} 500 - Internal server error.
 * @security {}
 */
router.put('/update/:client_id', authMiddleware, validateClientUpdate, clientController.updateClient);

module.exports = router;

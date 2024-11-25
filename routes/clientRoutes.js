// @ts-nocheck
const express = require('express');
const router = express.Router();
// const clientController = require('../controllers/clientController');
// const { authMiddleware, adminMiddleware } = require('../middleware/auth');
// const { validateUserClientUpdate } = require('../middleware/validator');

// /**
//  * @route GET /user-client-profile
//  * @group User Client - Operations regarding the authenticated user client
//  * @description Retrieve the authenticated user client's information.
//  * @returns {Object} 200 - User client object.
//  * @returns {Object} 404 - User client not found.
//  * @returns {Object} 500 - Internal server error.
//  */
// router.get('/user-client-profile', authMiddleware, clientController.getUserClientById);

// /**
//  * @route PUT /user-client/update/{user_client_id}
//  * @group User Client - Operations regarding updating a user client
//  * @param {number} user_client_id.path.required - ID of the user client to update.
//  * @param {Object} req - Express request object containing updated user client data.
//  * @param {string} req.body.client_image_url - URL of the uploaded client image (optional).
//  * @param {string} req.body.client_name - User client's first name (optional).
//  * @param {string} req.body.client_last_name - User client's last name (optional).
//  * @param {string} req.body.client_phone_number - User client's phone number (optional).
//  * @param {string} req.body.client_address - User client's address (optional).
//  * @returns {Object} 200 - User client updated successfully.
//  * @returns {Object} 404 - User client not found.
//  * @returns {Object} 400 - Bad request if validation fails.
//  * @returns {Object} 500 - Internal server error.
//  */
// router.put(
//     '/user-client/update/:user_client_id',
//     authMiddleware, 
//     validateUserClientUpdate, 
//     clientController.updateUserClient 
// );

// /**
//  * @route GET /admin-only
//  * @group Admin - Operations restricted to admin users
//  * @description Example of an admin-only route.
//  * @returns {Object} 200 - Access granted.
//  * @returns {Object} 403 - Forbidden if the user is not an admin.
//  */
// router.get('/admin-only', authMiddleware, adminMiddleware, (req, res) => {
//     res.status(200).json({ message: 'Access granted to admin area' });
// });

module.exports = router;

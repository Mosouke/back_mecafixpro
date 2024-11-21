// @ts-nocheck
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { validateUserCreation, validateUserLogin, validateUserClientUpdate } = require('../middleware/validator');



/**
 * @route POST /register
 * @group Authentication - Operations about authentication
 * @param {Object} req.body.mail_user_client - The email of the user client.
 * @param {string} req.body.password - The password of the user client.
 * @returns {Object} 201 - User client successfully registered.
 * @returns {Object} 400 - Bad request if validation fails.
 * @returns {Object} 500 - Internal server error.
 */
router.post('/register', validateUserCreation, authController.register);

/**
 * @route POST /login
 * @group Authentication - Operations about authentication
 * @param {Object} req.body.mail_user_client - The email of the user client.
 * @param {string} req.body.password - The password of the user client.
 * @returns {Object} 200 - User client successfully logged in.
 * @returns {Object} 401 - Unauthorized if credentials are invalid.
 * @returns {Object} 500 - Internal server error.
 */
router.post('/login', validateUserLogin, authController.login);

/**
 * @route GET /verify-token
 * @group Authentication - Operations about authentication
 * @returns {Object} 200 - Token valid.
 * @returns {Object} 401 - Invalid or missing token.
 */
router.get('/verify-token', authMiddleware, authController.verifyToken);

/**
 * @route GET /user-client-profile
 * @group User Client - Operations regarding the authenticated user client
 * @description Retrieve the authenticated user client's information.
 * @returns {Object} 200 - User client object.
 * @returns {Object} 404 - User client not found.
 * @returns {Object} 500 - Internal server error.
 */
router.get('/user-client-profile', authMiddleware, authController.getUserClientById);



/**
 * @route PUT /user-client/update/{user_client_id}
 * @group User Client - Operations regarding updating a user client
 * @param {number} user_client_id.path.required - ID of the user client to update.
 * @param {Object} req - Express request object containing updated user client data.
 * @param {string} req.body.client_image_url - URL of the uploaded client image (optional).
 * @param {string} req.body.client_name - User client's first name (optional).
 * @param {string} req.body.client_last_name - User client's last name (optional).
 * @param {string} req.body.client_phone_number - User client's phone number (optional).
 * @param {string} req.body.client_address - User client's address (optional).
 * @returns {Object} 200 - User client updated successfully.
 * @returns {Object} 404 - User client not found.
 * @returns {Object} 400 - Bad request if validation fails.
 * @returns {Object} 500 - Internal server error.
 */
router.put(
    '/user-client/update/:user_client_id',
    authMiddleware, 
    validateUserClientUpdate, 
    authController.updateUserClient 
);

/**
 * @route GET /admin-only
 * @group Admin - Operations restricted to admin users
 * @description Example of an admin-only route.
 * @returns {Object} 200 - Access granted.
 * @returns {Object} 403 - Forbidden if the user is not an admin.
 */
router.get('/admin-only', authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted to admin area' });
});

module.exports = router;

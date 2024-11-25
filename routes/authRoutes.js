// @ts-nocheck
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { validateUserCreation, validateUserLogin } = require('../middleware/validator');

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

module.exports = router;

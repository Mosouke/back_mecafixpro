// @ts-nocheck
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
    validateUserCreation,
    validateUserLogin,
} = require('../middleware/validator');

/**
 * @route POST /register
 * @group Authentication - Operations about authentication
 * @param {Object} req.body.mail_user - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @returns {Object} 201 - User successfully registered.
 * @returns {Object} 400 - Bad request if validation fails.
 * @returns {Object} 500 - Internal server error.
 */
router.post('/register', validateUserCreation, authController.register);

/**
 * @route POST /login
 * @group Authentication - Operations about authentication
 * @param {Object} req.body.mail_user - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @returns {Object} 200 - User successfully logged in.
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
 * @route GET /user-mail
 * @group User - Operations about user information
 * @description Retrieve the email of the authenticated user.
 * @returns {Object} 200 - The user's email.
 * @returns {Object} 401 - Unauthorized if the user is not authenticated.
 * @returns {Object} 500 - Internal server error.
 */
router.get('/user-mail', authMiddleware, authController.userMail);

/**
 * @route GET /admin-only
 * @group Admin - Operations restricted to admin users
 * @description Example of an admin-only route.
 * @returns {Object} 200 - Access granted.
 * @returns {Object} 403 - Forbidden if the user is not an admin.
 * 
 */
router.get('/admin-only', authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted to admin area' });
});

module.exports = router;
// @ts-nocheck
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route POST /register
 * @group Authentication - Operations about authentication
 * @param {Object} req - The request object containing user registration data.
 * @param {string} req.body.mail_user - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {number} req.body.fk_role_id - The role ID associated with the user.
 * @returns {Object} 201 - User successfully registered.
 * @returns {Object} 400 - Bad request if validation fails.
 * @returns {Object} 500 - Internal server error.
 * @security {}
 */
router.post('/register', authController.register);

/**
 * @route POST /login
 * @group Authentication - Operations about authentication
 * @param {Object} req - The request object containing user login data.
 * @param {string} req.body.mail_user - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @returns {Object} 200 - User successfully logged in.
 * @returns {Object} 401 - Unauthorized if credentials are invalid.
 * @returns {Object} 500 - Internal server error.
 * @security {}
 */
router.post('/login', authController.login);

module.exports = router;

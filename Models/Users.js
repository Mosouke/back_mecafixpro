/**
 * @file Models/Users.js
 * @description Model for the Users table in the database using Sequelize ORM. 
 * Includes methods for comparing passwords.
 */

//@ts-nocheck

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const bcrypt = require('bcryptjs');

/**
 * Sequelize model for the Users table.
 * 
 * @typedef {Object} Users
 * @property {string} mail_user - The email of the user, must be unique and valid.
 * @property {string} password - The password of the user, hashed before saving.
 * @property {number} fk_role_id - Foreign key referencing the role of the user.
 */
const Users = sequelize.define('users', {
    mail_user: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fk_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

/**
 * Compares a plain text password with the user's hashed password.
 * 
 * @function
 * @name comparePassword
 * @memberof Users
 * @param {string} password - The plain text password to compare.
 * @returns {Promise<boolean>} - A promise that resolves to true if passwords match, false otherwise.
 */
Users.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = Users;

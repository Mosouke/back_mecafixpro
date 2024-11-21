// @ts-nocheck
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

/**
 * Sequelize model representing the 'Roles' table.
 * This table defines the different roles in the application, 
 * such as 'client', 'pro_invité', 'pro', and 'admin'.
 *
 * @typedef {Object} Roles
 * @property {number} role_id - The unique identifier for the role (Primary Key).
 * @property {string} role_name - The name of the role, constrained to the following values: 'client', 'pro_invité', 'pro', 'admin'.
 */
const Roles = sequelize.define('roles', {
    /**
     * The unique identifier for each role.
     * 
     * @type {number}
     */
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    /**
     * The name of the role.
     * Allowed values are 'client', 'pro_invité', 'pro', 'admin'.
     * 
     * @type {'client' | 'pro_invité' | 'pro' | 'admin'}
     */
    role_name: {
        type: DataTypes.ENUM('client', 'pro_invité', 'pro', 'admin'),
        allowNull: false,
        unique: true,
    },
    tableName: 'roles',
    timestamps: false,
});

module.exports = Roles;

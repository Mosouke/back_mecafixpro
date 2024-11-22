// @ts-nocheck
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

/**
 * Sequelize model representing the 'Roles' table.
 * This table defines the different roles in the application, 
 * such as 'client', 'pro_invité', 'pro', and 'admin'.
 */
const Roles = sequelize.define('roles', {
    /**
     * The unique identifier for each role.
     * 
     * @type {number}
     */
    role_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    /**
     * The name of the role.
     * Allowed values are 'client', 'pro_invité', 'pro', 'admin'.
     */
    role_name: {
        type: DataTypes.ENUM('client', 'pro_invité', 'pro', 'admin'), 
        allowNull: false,
        unique: true, 
    },
}, {
   
    tableName: 'roles',
    timestamps: false, 
});

module.exports = Roles;

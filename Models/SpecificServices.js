// @ts-nocheck
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

/**
 * Sequelize model representing the 'SpecificServices' table.
 * This table holds information related to specific services that belong to a general service.
 *
 * @typedef {Object} SpecificServices
 * @property {number} specificService_id - The unique identifier for the specific service (Primary Key).
 * @property {string} specificService_name - The name of the specific service.
 * @property {number} fk_service_id - The foreign key linking to the general service.
 */
const SpecificServices = sequelize.define('specificServices', {
    /**
     * The unique identifier for each specific service.
     * 
     * @type {number}
     */
    specificService_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The name of the specific service.
     * 
     * @type {string}
     */
    specificService_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});


module.exports = SpecificServices;

// @ts-nocheck
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

/**
 * Sequelize model representing the 'Services' table.
 * This table holds information related to services offered by garages.
 *
 * @typedef {Object} Services
 * @property {number} service_id - The unique identifier for the service (Primary Key).
 * @property {string} service_name - The name of the service.
 * @property {number} fk_garage_id - The foreign key linking to the garage offering the service.
 */
const Services = sequelize.define('service', {
    /**
     * The unique identifier for each service.
     * 
     * @type {number}
     */
    service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    /**
     * The name of the service.
     * 
     * @type {string}
     */
    service_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Importing Garages model to establish association
const Garages = require('./Garages');



module.exports = Services;

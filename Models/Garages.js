// @ts-nocheck
const sequelize = require('../config/config');
const { DataTypes } = require('sequelize');

/**
 * Sequelize model representing the 'Garages' table.
 * This table holds information related to garages in the application.
 *
 * @typedef {Object} Garages
 * @property {number} garage_id - The unique identifier for the garage (Primary Key).
 * @property {string} garage_name - The name of the garage.
 * @property {string} garage_address - The address of the garage.
 * @property {string} garage_phone - The phone number of the garage (must be 10 digits).
 * @property {string} garage_city - The city where the garage is located.
 * @property {string} garage_postal_code - The postal code of the garage (must be 5 digits).
 * @property {number} [fk_eval_id] - Foreign key linking to the 'Evaluations' table (optional).
 */
const Garages = sequelize.define('garages', {
    /**
     * The unique identifier for each garage.
     * 
     * @type {number}
     */
    garage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The name of the garage.
     * 
     * @type {string}
     */
    garage_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /**
     * The address of the garage.
     * 
     * @type {string}
     */
    garage_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /**
     * The phone number of the garage.
     * It must be a numeric value and exactly 10 digits long.
     * 
     * @type {string}
     */
    garage_phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true, // Ensures the phone number is numeric
            len: [10, 10],   // Length of 10 characters
        },
    },
    /**
     * The city where the garage is located.
     * 
     * @type {string}
     */
    garage_city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /**
     * The postal code of the garage.
     * It must be a numeric value and exactly 5 digits long.
     * 
     * @type {string}
     */
    garage_postal_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true, // Ensures the postal code is numeric
            len: [5, 5],     // Length of 5 characters
        },
    },
    /**
     * Foreign key linking to the evaluation associated with the garage.
     * This field is optional and will link to the 'Evaluations' table when created.
     * 
     * @type {number}
     * @optional
     */
    fk_eval_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional field for future use
    },
});

module.exports = Garages;

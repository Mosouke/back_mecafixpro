// @ts-nocheck
const sequelize = require('../config/config');
const { DataTypes } = require('sequelize');
const Clients = require('./Clients');

/**
 * Sequelize model representing the 'Cars' table.
 * This table holds information related to the cars owned by clients in the application.
 *
 * @typedef {Object} Cars
 * @property {number} car_id - The unique identifier for the car (Primary Key).
 * @property {string} car_marque - The brand of the car.
 * @property {string} car_modele - The model of the car.
 * @property {number} car_year - The year the car was manufactured. Must be between 1886 and the current year.
 * @property {number} fk_client_id - Foreign key linking to the 'Clients' table.
 */
const Cars = sequelize.define('cars', {
    /**
     * The unique identifier for each car.
     * 
     * @type {number}
     */
    car_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The brand of the car.
     * 
     * @type {string}
     */
    car_marque: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /**
     * The model of the car.
     * 
     * @type {string}
     */
    car_modele: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /**
     * The year the car was manufactured.
     * It must be between 1886 (the year the first car was invented) and the current year.
     * 
     * @type {number}
     */
    car_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1886,
            max: new Date().getFullYear(),
        },
    },
    /**
     * Foreign key linking to the client that owns the car (relationship to 'Clients' table).
     * 
     * @type {number}
     */
    fk_client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

/**
 * Associates the 'Cars' model with the 'Clients' model.
 * A car belongs to a single client, with a foreign key 'fk_client_id' referencing 'client_id' in 'Clients'.
 */
Cars.belongsTo(Clients, { foreignKey: 'fk_client_id', targetKey: 'client_id' });

module.exports = Cars;

// @ts-nocheck
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Users = require('./Users'); // Import du modèle Users

/**
 * Sequelize model representing the 'Clients' table.
 * This table holds information related to the clients in the application.
 *
 * @typedef {Object} Clients
 * @property {number} client_id - The unique identifier for the client (Primary Key).
 * @property {string} client_image_name - The name of the image associated with the client.
 * @property {string} client_name - The first name of the client.
 * @property {string} client_last_name - The last name of the client.
 * @property {string} [client_phone_number] - The phone number of the client (optional).
 * @property {string} client_address - The address of the client.
 */
const Clients = sequelize.define('clients', {
    /**
     * The unique identifier for each client.
     * 
     * @type {number}
     */
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The name of the client's profile image.
     * 
     * @type {string}
     */
    client_image_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /**
     * The first name of the client.
     * 
     * @type {string}
     */
    client_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /**
     * The last name of the client.
     * 
     * @type {string}
     */
    client_last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /**
     * The phone number of the client (optional).
     * 
     * @type {string|null}
     */
    client_phone_number: {
        type: DataTypes.STRING,
        allowNull: true,  
    },
    /**
     * The address of the client.
     * 
     * @type {string}
     */
    client_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Define relationship: A client belongs to a user (One-to-Many relationship)
Clients.belongsTo(Users, {
    foreignKey: {
        allowNull: false,  
    },
    as: 'user',  
    onDelete: 'CASCADE', 
});

module.exports = Clients;

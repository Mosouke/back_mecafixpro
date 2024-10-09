// @ts-nocheck
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

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
 * @property {string} fk_mail_user - The foreign key linking to the user email (relationship to 'Users' table).
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
     * @type {string|undefined}
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
    /**
     * Foreign key linking to the email in the 'Users' table.
     * 
     * @type {string}
     */
    fk_mail_user: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
});

module.exports = Clients;

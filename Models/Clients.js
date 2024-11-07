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
    client_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    client_image_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    client_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    client_last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    client_phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    client_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true, // Ajout de la contrainte unique pour garantir One-to-One
        references: {
            model: 'users',
            key: 'id_user',
        }
    }
});


// Define relationship: A client belongs to a user (One-to-Many relationship)
Clients.belongsTo(Users, {
    foreignKey: {
        allowNull: false,  
    },
    as: 'user', 
    key: 'id_user', 
    onDelete: 'CASCADE', 
});

module.exports = Clients;

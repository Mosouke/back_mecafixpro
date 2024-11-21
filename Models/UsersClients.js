// @ts-nocheck
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Roles = require('./Roles'); 

const UsersClients = sequelize.define('users_clients', {
    user_client_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    mail_user_client: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,  
        validate: {
            isEmail: true 
        }
    },
    password_user_client: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_client_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    user_client_last_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    user_client_phone_number: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    user_client_address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    user_client_image_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Roles, // Dépend de la table des rôles
            key: 'role_id'
        },
        allowNull: false
    }
}, {
    tableName: 'users_clients',
    timestamps: true,  
});

// Définition des associations avec d'autres modèles
UsersClients.belongsTo(Roles, { foreignKey: 'role_id', as: 'role' });
Roles.hasMany(UsersClients, { foreignKey: 'role_id', as: 'users_clients' });

module.exports = UsersClients;

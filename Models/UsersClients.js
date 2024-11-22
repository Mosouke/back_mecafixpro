// @ts-nocheck
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Roles = require('./Roles'); 

const UsersClients = sequelize.define('users_clients', {
    user_client_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true,
        allowNull: false,
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
    role_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        references: {
            model: Roles, 
            key: 'role_id'
        },
        allowNull: false
    }
}, {
    tableName: 'users_clients',
    timestamps: true,  
});

// Changez l'alias en 'clientRole' pour éviter les doublons avec d'autres alias
UsersClients.belongsTo(Roles, { foreignKey: 'role_id', as: 'clientRole' });
Roles.hasMany(UsersClients, { foreignKey: 'role_id', as: 'users_clients' });

module.exports = UsersClients;

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
        allowNull: true
    },
    user_client_last_name: {
        type: DataTypes.STRING(100),
        allowNull: true
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
        references: {
            model: Roles,
            key: 'role_id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
}, {
    tableName: 'users_clients',
    timestamps: true,
});

// Relation avec la table des rôles
UsersClients.belongsTo(Roles, { foreignKey: 'role_id', as: 'clientRole' });
Roles.hasMany(UsersClients, { foreignKey: 'role_id', as: 'users_clients' });

UsersClients.beforeCreate(async (userClient) => {
    if (!userClient.role_id) {
        const clientRole = await Roles.findOne({ where: { role_name: 'client' } });
        if (clientRole) {
            userClient.role_id = clientRole.role_id;
        } else {
            throw new Error('Le rôle "client" est introuvable dans la base de données.');
        }
    }
});

module.exports = UsersClients;

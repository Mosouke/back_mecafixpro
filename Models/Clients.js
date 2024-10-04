const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Clients = sequelize.define('clients', {
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,  
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
    fk_mail_user: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
});

module.exports = Clients;

const sequelize = require('../config/config');
const { DataTypes } = require('sequelize');
const Clients = require('./Clients');  

const Cars = sequelize.define('cars', {
    car_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    car_marque: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    car_modele: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    car_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1886, 
            max: new Date().getFullYear(),
        },
    },
    fk_client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});


Cars.belongsTo(Clients, { foreignKey: 'fk_client_id', targetKey: 'client_id' });

module.exports = Cars;

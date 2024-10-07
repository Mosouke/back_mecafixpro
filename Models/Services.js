const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');


const Services = sequelize.define('service', {
    service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    service_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});


const Garages = require('./Garages'); 
Services.belongsTo(Garages, { foreignKey: 'fk_garage_id', targetKey: 'garage_id' });

module.exports = Services;

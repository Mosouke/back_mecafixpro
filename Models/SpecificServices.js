const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const SpecificServices = sequelize.define('specificServices', {
    specificService_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    specificService_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const Services = require('./Services');
SpecificServices.belongsTo(Services, { foreignKey: 'fk_service_id', targetKey: 'service_id' });    

module.exports = SpecificServices;
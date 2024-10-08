const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Appointments = sequelize.define('appointments', {
    appt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    appt_date_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    appt_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    appt_comment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fk_client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fk_garage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fk_service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fk_specific_service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const Client = require('./Clients');
const Garage = require('./Garages');
const Service = require('./Services');
const SpecificService = require('./SpecificServices');

Appointments.belongsTo(Client, { foreignKey: 'fk_client_id', targetKey: 'client_id' });
Appointments.belongsTo(Garage, { foreignKey: 'fk_garage_id', targetKey: 'garage_id' });
Appointments.belongsTo(Service, { foreignKey: 'fk_service_id', targetKey: 'service_id' });
Appointments.belongsTo(SpecificService, { foreignKey: 'fk_specific_service_id', targetKey: 'specificService_id' });

module.exports = Appointments;
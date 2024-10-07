const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Appointments = sequelize.define('appointments', {
    appt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    appt_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    appt_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    appt_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    appt_comment: {
        type: DataTypes.STRING,
        allowNull: false,
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

Appointments.belongsTo(Clients, { foreignKey: 'fk_client_id', targetKey: 'client_id' });
Appointments.belongsTo(Garages, { foreignKey: 'fk_garage_id', targetKey: 'garage_id' });
Appointments.belongsTo(Services, { foreignKey: 'fk_service_id', targetKey: 'service_id' });
Appointments.belongsTo(SpecificServices, { foreignKey: 'fk_specific_service_id', targetKey: 'specificService_id' });

module.exports = Appointments;
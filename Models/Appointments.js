// @ts-nocheck
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

/**
 * Sequelize model representing the 'Appointments' table.
 * This table holds information related to appointments made by clients at garages for specific services.
 *
 * @typedef {Object} Appointments
 * @property {number} appt_id - The unique identifier for the appointment (Primary Key).
 * @property {Date} appt_date_time - The date and time of the appointment.
 * @property {string} appt_status - The status of the appointment (e.g., scheduled, completed, canceled).
 * @property {string} [appt_comment] - Optional comments related to the appointment.
 * @property {number} fk_client_id - The foreign key linking to the client making the appointment.
 * @property {number} fk_garage_id - The foreign key linking to the garage where the appointment is scheduled.
 * @property {number} fk_service_id - The foreign key linking to the general service associated with the appointment.
 * @property {number} fk_specific_service_id - The foreign key linking to the specific service associated with the appointment.
 */
const Appointments = sequelize.define('appointments', {
    /**
     * The unique identifier for each appointment.
     * 
     * @type {number}
     */
    appt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The date and time of the appointment.
     * 
     * @type {Date}
     */
    appt_date_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    /**
     * The status of the appointment.
     * 
     * @type {string}
     */
    appt_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /**
     * Optional comments related to the appointment.
     * 
     * @type {string}
     */
    appt_comment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    /**
     * Foreign key linking to the client.
     * 
     * @type {number}
     */
    fk_client_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    /**
     * Foreign key linking to the garage.
     * 
     * @type {number}
     */
    fk_garage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    /**
     * Foreign key linking to the general service.
     * 
     * @type {number}
     */
    fk_service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    /**
     * Foreign key linking to the specific service.
     * 
     * @type {number}
     */
    fk_specific_service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// Importing related models to establish associations
const Client = require('./Clients');
const Garage = require('./Garages');
const Service = require('./Services');
const SpecificService = require('./SpecificServices');

/**
 * Establishes relationships where each appointment belongs to:
 * - A client
 * - A garage
 * - A general service
 * - A specific service
 */
Appointments.belongsTo(Client, { foreignKey: 'fk_client_id', targetKey: 'client_id' });
Appointments.belongsTo(Garage, { foreignKey: 'fk_garage_id', targetKey: 'garage_id' });
Appointments.belongsTo(Service, { foreignKey: 'fk_service_id', targetKey: 'service_id' });
Appointments.belongsTo(SpecificService, { foreignKey: 'fk_specific_service_id', targetKey: 'specificService_id' });

module.exports = Appointments;

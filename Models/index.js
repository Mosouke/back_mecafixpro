// @ts-nocheck
const Users = require('./Users');
const Roles = require('./Roles');
const Clients = require('./Clients');
const Cars = require('./Cars');
const Garages = require('./Garages');
const Services = require('./Services');
const SpecificServices = require('./SpecificServices');
const Appointments = require('./Appointments');
const sequelize = require('../config/config');
const { alt } = require('joi');

/**
 * Establishes relationships between models.
 * - Users belong to a Role.
 * - Roles have many Users.
 * - Cars belong to a Client.
 * - Clients have many Cars.
 * - Services belong to a Garage.
 * - Garages have many Services.
 * - SpecificServices belong to a Service.
 * - Services have many SpecificServices.
 * - Users have one Client.
 * - Clients belong to one User.
 */

// Users belong to Roles
Users.belongsTo(Roles, { foreignKey: 'fk_role_id', as: 'role' });
Roles.hasMany(Users, { foreignKey: 'fk_role_id', as: 'users' });

// Cars belong to Clients
Cars.belongsTo(Clients, { foreignKey: 'fk_client_id', targetKey: 'client_id' });
Clients.hasMany(Cars, { foreignKey: 'fk_client_id', targetKey: 'client_id' });

// Services belong to Garages
Services.belongsTo(Garages, { foreignKey: 'fk_garage_id', targetKey: 'garage_id' });
Garages.hasMany(Services, { foreignKey: 'fk_garage_id', targetKey: 'garage_id' });

// SpecificServices belong to Services
SpecificServices.belongsTo(Services, { foreignKey: 'fk_service_id', targetKey: 'service_id' });
Services.hasMany(SpecificServices, { foreignKey: 'fk_service_id', targetKey: 'service_id' });

// Users have one Client, Clients belong to one User
Users.hasOne(Clients, { foreignKey: 'userId' });
Clients.belongsTo(Users, { foreignKey: 'userId' });

/**
 * Initializes predefined roles in the database.
 * @async
 * @function initRoles
 * @returns {Promise<void>}
 */
async function initRoles() {
    const roles = ['client', 'pro_invité', 'pro', 'admin'];
    for (const role of roles) {
        await Roles.findOrCreate({
            where: { role_name: role },
            defaults: { role_name: role },
            logging: false 
        });
    }
}

/**
 * Initializes the database by syncing models and creating predefined roles.
 * @async
 * @function initDatabase
 * @returns {Promise<void>}
 */
async function initDatabase() {
    try {
        await sequelize.sync({ force: false, alter: true });
        await initRoles();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Start the database initialization
initDatabase();

/**
 * Exporting all models and sequelize instance for further usage.
 * @module Models
 * @exports {Object} - All models and sequelize instance
 */
module.exports = {
    Users,
    Roles,
    Clients,
    Cars,
    Garages,
    Services,
    SpecificServices,
    Appointments,
    sequelize
};
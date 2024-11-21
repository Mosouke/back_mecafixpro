const UsersClients = require('./UsersClients');  
const Roles = require('./Roles');
const Cars = require('./Cars');
const Garages = require('./Garages');
const Services = require('./Services');
const SpecificServices = require('./SpecificServices');
const Appointments = require('./Appointments');
const sequelize = require('../config/config');

/**
 * Establish relationships between models.
 * - UsersClients belong to a Role.
 * - Roles have many UsersClients.
 * - Cars belong to a UserClient (no longer need the Client model).
 * - UsersClients (now the "Client" too) have many Cars.
 * - Services belong to a Garage.
 * - Garages have many Services.
 * - SpecificServices belong to a Service.
 * - Services have many SpecificServices.
 */


UsersClients.belongsTo(Roles, { foreignKey: 'fk_role_id', as: 'userRoleAssociation' }); 
Roles.hasMany(UsersClients, { foreignKey: 'fk_role_id', as: 'clients' });

Cars.belongsTo(UsersClients, { foreignKey: 'fk_user_client_id', targetKey: 'user_client_id' });
UsersClients.hasMany(Cars, { foreignKey: 'fk_user_client_id', targetKey: 'user_client_id' });

Services.belongsTo(Garages, { foreignKey: 'fk_garage_id', targetKey: 'garage_id' });
Garages.hasMany(Services, { foreignKey: 'fk_garage_id', targetKey: 'garage_id' });

SpecificServices.belongsTo(Services, { foreignKey: 'fk_service_id', targetKey: 'service_id' });
Services.hasMany(SpecificServices, { foreignKey: 'fk_service_id', targetKey: 'service_id' });

// Initialize roles
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

// Initialize database
async function initDatabase() {
    try {
        await sequelize.sync({ force: false, alter: false });
        await initRoles();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Start initialization
initDatabase();

module.exports = {
    UsersClients,  
    Roles,
    Cars,
    Garages,
    Services,
    SpecificServices,
    Appointments,
    sequelize
};

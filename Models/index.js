const UsersClients = require('./UsersClients');  
const Roles = require('./Roles');
const Cars = require('./Cars');
const Garages = require('./Garages');
const Services = require('./Services');
const SpecificServices = require('./SpecificServices');
const Appointments = require('./Appointments');
const Evaluations = require('./Evaluations');
const sequelize = require('../config/config');

// Establish relationships between models
UsersClients.belongsTo(Roles, { foreignKey: 'role_id', as: 'userRoleAssociation' }); 
Roles.hasMany(UsersClients, { foreignKey: 'role_id', as: 'clients' });

Cars.belongsTo(UsersClients, { foreignKey: 'fk_user_client_id', targetKey: 'user_client_id', as: 'owner' });
UsersClients.hasMany(Cars, { foreignKey: 'fk_user_client_id', targetKey: 'user_client_id', as: 'userCars' });

Services.belongsTo(Garages, { foreignKey: 'fk_garage_id', targetKey: 'garage_id', as: 'garage' });
Garages.hasMany(Services, { foreignKey: 'fk_garage_id', targetKey: 'garage_id', as: 'services' });

SpecificServices.belongsTo(Services, { foreignKey: 'fk_service_id', targetKey: 'service_id', as: 'generalService' });
Services.hasMany(SpecificServices, { foreignKey: 'fk_service_id', targetKey: 'service_id', as: 'specificServices' });

Appointments.belongsTo(UsersClients, { foreignKey: 'fk_user_client_id', targetKey: 'user_client_id', as: 'client' });
UsersClients.hasMany(Appointments, { foreignKey: 'fk_user_client_id', targetKey: 'user_client_id', as: 'appointments' });

Appointments.belongsTo(Garages, { foreignKey: 'fk_garage_id', targetKey: 'garage_id', as: 'garage' });
Garages.hasMany(Appointments, { foreignKey: 'fk_garage_id', targetKey: 'garage_id', as: 'appointments' });

Appointments.belongsTo(Services, { foreignKey: 'fk_service_id', targetKey: 'service_id', as: 'service' });
Services.hasMany(Appointments, { foreignKey: 'fk_service_id', targetKey: 'service_id', as: 'appointments' });

Appointments.belongsTo(SpecificServices, { foreignKey: 'fk_specific_service_id', targetKey: 'specificService_id', as: 'specificService' });
SpecificServices.hasMany(Appointments, { foreignKey: 'fk_specific_service_id', targetKey: 'specificService_id', as: 'appointments' });

Evaluations.belongsTo(Appointments, { foreignKey: 'fk_appt_id', targetKey: 'appt_id', as: 'appointment' });
Appointments.hasMany(Evaluations, { foreignKey: 'fk_appt_id', targetKey: 'appt_id', as: 'evaluations' });

Evaluations.belongsTo(Garages, { foreignKey: 'fk_garage_id', targetKey: 'garage_id', as: 'garage' });
Garages.hasMany(Evaluations, { foreignKey: 'fk_garage_id', targetKey: 'garage_id', as: 'evaluations' });

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
    Evaluations,
    sequelize
};

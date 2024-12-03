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
UsersClients.belongsTo(Roles, { foreignKey: 'role_id'}); 
Roles.hasMany(UsersClients, { foreignKey: 'role_id' });

Cars.belongsTo(UsersClients, { foreignKey: 'fk_user_client_id', targetKey: 'user_client_id' });
UsersClients.hasMany(Cars, { foreignKey: 'fk_user_client_id', targetKey: 'user_client_id'});

Services.belongsTo(Garages, { foreignKey: 'fk_garage_id', targetKey: 'garage_id'});
Garages.hasMany(Services, { foreignKey: 'fk_garage_id', targetKey: 'garage_id'});

SpecificServices.belongsTo(Services, { foreignKey: 'fk_service_id', targetKey: 'service_id' });
Services.hasMany(SpecificServices, { foreignKey: 'fk_service_id', targetKey: 'service_id' });

Appointments.belongsTo(UsersClients, { foreignKey: 'fk_user_client_id', targetKey: 'user_client_id' });
UsersClients.hasMany(Appointments, { foreignKey: 'fk_user_client_id', targetKey: 'user_client_id' });
Appointments.belongsTo(Garages, { foreignKey: 'fk_garage_id', targetKey: 'garage_id'});
Garages.hasMany(Appointments, { foreignKey: 'fk_garage_id', targetKey: 'garage_id'});

Appointments.belongsTo(Services, { foreignKey: 'fk_service_id', targetKey: 'service_id'});
Services.hasMany(Appointments, { foreignKey: 'fk_service_id', targetKey: 'service_id'});

Appointments.belongsTo(SpecificServices, { foreignKey: 'fk_specific_service_id', targetKey: 'specificService_id' });
SpecificServices.hasMany(Appointments, { foreignKey: 'fk_specific_service_id', targetKey: 'specificService_id'});

Evaluations.belongsTo(Appointments, { foreignKey: 'fk_appt_id', targetKey: 'appt_id'});
Appointments.hasMany(Evaluations, { foreignKey: 'fk_appt_id', targetKey: 'appt_id'});

Evaluations.belongsTo(Garages, { foreignKey: 'fk_garage_id', targetKey: 'garage_id'});
Garages.hasMany(Evaluations, { foreignKey: 'fk_garage_id', targetKey: 'garage_id'});

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

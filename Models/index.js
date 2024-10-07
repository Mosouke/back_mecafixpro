const Users = require('./Users');
const Roles = require('./Roles');
const Clients = require('./Clients');
const Cars = require('./Cars');
const Garages = require('./Garages');
const Services = require('./Services');
const SpecificServices = require('./SpecificServices');
const sequelize = require('../config/config');

Users.belongsTo(Roles, { foreignKey: 'fk_role_id', as: 'role' });
Roles.hasMany(Users, { foreignKey: 'fk_role_id', as: 'users' });

Cars.belongsTo(Clients, { foreignKey: 'fk_client_id', targetKey: 'client_id' });
Clients.hasMany(Cars, { foreignKey: 'fk_client_id', targetKey: 'client_id' });


Services.belongsTo(Garages, { foreignKey: 'fk_garage_id', targetKey: 'garage_id' });
Garages.hasMany(Services, { foreignKey: 'fk_garage_id', targetKey: 'garage_id' });

SpecificServices.belongsTo(Services, { foreignKey: 'fk_service_id', targetKey: 'service_id' });
Services.hasMany(SpecificServices, { foreignKey: 'fk_service_id', targetKey: 'service_id' });

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

async function initDatabase() {
    try {
        await sequelize.sync({ force: false });
        await initRoles();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initDatabase();

module.exports = {
    Users,
    Roles,
    Clients,
    Cars,
    Garages,
    Services,
    SpecificServices, 
    sequelize
};

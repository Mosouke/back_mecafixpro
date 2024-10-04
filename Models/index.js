const Users = require('./Users');
const Roles = require('./Roles');
const Clients = require('./Clients');
const Cars = require('./Cars');
const Garages = require('./Garages');
const sequelize = require('../config/config');

// Associations entre les modèles
Users.belongsTo(Roles, { foreignKey: 'fk_role_id', as: 'role' });
Roles.hasMany(Users, { foreignKey: 'fk_role_id', as: 'users' });

Cars.belongsTo(Clients, { foreignKey: 'fk_client_id', targetKey: 'client_id' });
Clients.hasMany(Cars, { foreignKey: 'fk_client_id', targetKey: 'client_id' });

async function initRoles() {
    const roles = ['client', 'pro_invité', 'pro'];
    for (const role of roles) {
        await Roles.findOrCreate({
            where: { role_name: role },
            defaults: { role_name: role },
            logging: false // Correction ici
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
    sequelize
};

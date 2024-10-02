const Users = require('./Users');
const Roles = require('./Roles');
const sequelize = require('../config/config');

Users.belongsTo(Roles, { foreignKey: 'fk_role_id', as: 'role' });
Roles.hasMany(Users, { foreignKey: 'fk_role_id', as: 'users' });

async function initRoles() {
    const roles = ['client', 'pro_invité', 'pro'];
    for (const role of roles) {
        await Roles.findOrCreate({
            where: { role_name: role },
            defaults: { role_name: role }
        });
    }
    console.log('Roles initialized');
}

async function initDatabase() {
    try {
        await sequelize.sync({ force: false });
        console.log('Database & tables created!');
        await initRoles();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initDatabase();

module.exports = {
    Users,
    Roles,
    sequelize
};
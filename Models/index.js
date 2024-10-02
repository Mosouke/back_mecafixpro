const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json')['development'];
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.Users = require('./Users')(sequelize, DataTypes);
db.Clients = require('./Clients')(sequelize, DataTypes);
db.Cars = require('./Cars')(sequelize, DataTypes);
const Service = require('./Service');
const SpecificService = require('./SpecificService');

Service.hasMany(SpecificService, { foreignKey: 'fk_service_id' });
SpecificService.belongsTo(Service, { foreignKey: 'fk_service_id' });

module.exports = { Service, SpecificService };


module.exports = db;

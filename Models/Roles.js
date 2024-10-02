const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Roles = sequelize.define('roles', {
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    role_name: {
        type: DataTypes.ENUM('client', 'pro_invité', 'pro'),
        allowNull: false,
        unique: true,
    },
});

module.exports = Roles;
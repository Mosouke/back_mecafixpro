const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const bcrypt = require('bcryptjs');

const Users = sequelize.define('users', {
    mail_user: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fk_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

Users.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = Users;
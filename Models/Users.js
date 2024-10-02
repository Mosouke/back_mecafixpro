const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_mail: {
            type: DataTypes.STRING,
            unique: true
        },
        user_pass: DataTypes.STRING
    });

    Users.beforeCreate(async (user) => {
        user.user_pass = await bcrypt.hash(user.user_pass, 10);
    });

    return Users;
};

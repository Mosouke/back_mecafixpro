module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client', {
        client_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        client_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        client_lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        client_phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        client_address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fk_user_mail: {
            type: DataTypes.STRING,
            references: {
                model: 'Users',
                key: 'user_mail',
            },
        },
        client_image_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    return Client;
};

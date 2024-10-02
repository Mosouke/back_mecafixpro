module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        service_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
        },
        service_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Service;
};

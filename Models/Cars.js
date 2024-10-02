module.exports = (sequelize, DataTypes) => {
    const Car = sequelize.define('Car', {
        car_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        car_marque: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        car_model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        car_years: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        car_license_plate: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    });
    return Car;
};

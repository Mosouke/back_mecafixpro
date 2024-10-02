module.exports = (sequelize, DataTypes) => {
    const SpecificService = sequelize.define('SpecificService', {
        specific_service_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
        },
        specific_service_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fk_service_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Service', 
                key: 'service_id', 
            },
        },
    });
    return SpecificService;
};

module.exports = (sequelize, DataTypes) => {
    const ServiceSpecificService = sequelize.define('ServiceSpecificService', {
        fk_service_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Service',
                key: 'service_id',
            },
            primaryKey: true, 
        },
        fk_specific_service_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'SpecificService',
                key: 'specific_service_id',
            },
            primaryKey: true, 
        },
    });
    return ServiceSpecificService;
};

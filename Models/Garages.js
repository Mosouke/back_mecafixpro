const sequelize = require('../config/config');
const { DataTypes } = require('sequelize');

// Définition du modèle Garages
const Garages = sequelize.define('garages', {
    garage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    garage_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    garage_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    garage_phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {        
            isNumeric: true, // Assure que le numéro de téléphone est numérique
            len: [10, 10],   // Longueur de 10 caractères
        },
    },
    garage_city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    garage_postal_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true, // Assure que le code postal est numérique
            len: [5, 5],     // Longueur de 5 caractères
        },
    },
    fk_eval_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // À relier à la table Evaluations lorsque créée
    },
});

module.exports = Garages;

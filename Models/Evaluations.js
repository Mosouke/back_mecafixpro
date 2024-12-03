const {DataTypes} = require('sequelize');
const sequilize = require("../config/config.js");

const Evaluations = sequilize.define('evaluations', {
    eval_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    eval_note: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    eval_coment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eval_date: {
        type: DataTypes.DATE,
        allowNull: false    
    },
    fk_appt_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'appointments',
            key: 'appt_id'
        }
    },
    fk_garage_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Garages', // Nom de la table
            key: 'garage_id',
        },
    }
});

module.exports = Evaluations;
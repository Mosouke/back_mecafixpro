const Sequelize = require('sequelize');
require('dotenv').config();
const pg = require('pg');

const {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DIALECT,
} = process.env;

// Vérifier les variables d'environnement
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_DIALECT) {
    throw new Error("Une ou plusieurs variables d'environnement de base de données sont manquantes.");
}

// Configurer Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT, // Assurez-vous que DB_DIALECT = 'postgres'
    logging: false,
    dialectModule: pg,
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false,
        } : undefined,
    },
});

// Tester la connexion
sequelize.authenticate()
    .then(() => {
        console.log('✅ Connexion à la base de données réussie.');
    })
    .catch(err => {
        console.error('❌ Erreur de connexion à la base de données:', err.message);
    });

module.exports = sequelize;

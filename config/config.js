const Sequelize = require('sequelize');
require('dotenv').config();

const {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DIALECT
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_DIALECT) {
    throw new Error('Une ou plusieurs variables d\'environnement de base de données sont manquantes.');
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    logging: false,  // Désactivez le logging des requêtes SQL
    dialectOptions: {
       
        charset: 'utf8mb4',  
        // collate: 'utf8mb4_unicode_ci'  
    },
});


sequelize.authenticate()
    .then(() => {
        console.log('Connexion à la base de données réussie.');
    })
    .catch(err => {
        console.error('Erreur de connexion à la base de données:', err);
    });

module.exports = sequelize;

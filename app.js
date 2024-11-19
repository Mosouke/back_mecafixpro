// @ts-nocheck
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import des fichiers de routes
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const carRoutes = require('./routes/carRoutes');
const garageRoutes = require('./routes/garageRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const specificServiceRoutes = require('./routes/specificServicesRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Import des modèles
const { sequelize, Roles } = require('./Models');

// Création de l'application Express
const app = express();


/**
 * Configuration des options CORS.
 * @type {import('cors').CorsOptions}
 */
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Middleware CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/**
 * Middleware pour parser les requêtes JSON.
 */
app.use(bodyParser.json());

/**
 * Route de test pour vérifier si le serveur fonctionne.
 * @route GET /
 * @group General - Routes générales
 * @returns {string} 200 - Message indiquant que le serveur fonctionne
 */
app.get("/", (req, res) => {
    res.send("Route test OK v1.2");
});

/**
 * Routes de l'application
 * @route /api/auth - Routes pour l'authentification
 * @route /api/client - Routes pour les clients
 * @route /api/car - Routes pour les voitures
 * @route /api/garage - Routes pour les garages
 * @route /api/service - Routes pour les services
 * @route /api/specifiqueService - Routes pour les services spécifiques
 * @route /api/appointment - Routes pour les rendez-vous
 */
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/car', carRoutes);
app.use('/api/garage', garageRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/specifiqueService', specificServiceRoutes);
app.use('/api/appointment', appointmentRoutes);

/**
 * Gestion des erreurs 404 pour les routes inexistantes.
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

/**
 * Middleware global de gestion des erreurs.
 * @param {Error} err - Objet erreur
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Configuration du port
const PORT = process.env.PORT || 5432;

/**
 * Initialise les rôles par défaut dans la base de données.
 * @async
 * @function initRoles
 * @returns {Promise<void>}
 */
async function initRoles() {
    const roles = ['client', 'pro_invité', 'pro', 'admin'];
    for (const role of roles) {
        await Roles.findOrCreate({
            where: { role_name: role },
            defaults: { role_name: role },
        });
    }
}

/**
 * Fonction principale pour initialiser l'application.
 * @async
 * @function initApp
 * @returns {Promise<void>}
 */
async function initApp() {
    try {
        // Synchronisation avec la base de données sans la recréer
        await sequelize.sync({ force: false, alter: false });

        // Initialisation des rôles
        await initRoles();

        // Lancement du serveur
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error initializing app:', error.message);
    }
}

// Démarrage de l'application
initApp();

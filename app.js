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

// Import des middlewares
const { authMiddleware, adminMiddleware } = require('./middleware/auth'); 
const upload = require('./middleware/upload'); 

// Import des modèles
const { sequelize, Roles } = require('./Models');

// Création de l'application Express
const app = express();

// Configuration des options CORS.
const corsOptions = {
    origin: 'https://front-react-mecafixpro.vercel.app', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Middleware CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware pour parser les requêtes JSON.
app.use(bodyParser.json());

// Route de test pour vérifier si le serveur fonctionne.
app.get("/", (req, res) => {
    res.send("Route test OK v1.2");
});

// Routes de l'application
// Authentification
app.use('/api/auth', authRoutes);

// Gestion des clients
app.use('/api/client', authMiddleware, clientRoutes); // Auth middleware pour sécuriser les routes client

// Routes des autres entités
app.use('/api/car', carRoutes);
app.use('/api/garage', garageRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/specifiqueService', specificServiceRoutes);
app.use('/api/appointment', appointmentRoutes);

// Exemple de route pour upload d'image (si nécessaire)
app.post('/api/client/upload', authMiddleware, upload.single('image'), (req, res) => {
    try {
        res.status(200).json({ message: 'Image téléchargée avec succès', file: req.file });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors du téléchargement de l\'image.' });
    }
});

// Gestion des erreurs 404 pour les routes inexistantes.
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Middleware global de gestion des erreurs.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Configuration du port
const PORT = process.env.PORT || 5432;

// Initialise les rôles par défaut dans la base de données.
async function initRoles() {
    const roles = ['client', 'pro_invité', 'pro', 'admin'];
    for (const role of roles) {
        await Roles.findOrCreate({
            where: { role_name: role },
            defaults: { role_name: role },
        });
    }
}

// Fonction principale pour initialiser l'application.
async function initApp() {
    try {
        await sequelize.sync({ force: false, alter: true });

        await initRoles();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error initializing app:', error.message);
    }
}

// Démarrage de l'application
initApp();

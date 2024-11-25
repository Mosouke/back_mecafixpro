// @ts-nocheck
const express = require('express');
const authRoutes = require('./routes/authRoutes'); 
const carRoutes = require('./routes/carRoutes');
const garageRoutes = require('./routes/garageRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const specificServiceRoutes = require('./routes/specificServicesRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const cors = require('cors');
const { sequelize, Roles } = require('./Models');
const { body } = require('express-validator');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());

const allowedOrigins = [
    'https://front-react-mecafixpro.vercel.app', 
    'http://localhost:5173', 
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.options('*', cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));


app.get("/", (req, res) => {
    res.send("Route test OK v1.3");
});

/**
 * Route definitions.
 * Now all client-related routes are handled by authRoutes.
 */
app.use('/api/auth', authRoutes); 
app.use('/api/car', carRoutes);
app.use('/api/garage', garageRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/specifiqueService', specificServiceRoutes);
app.use('/api/appointment', appointmentRoutes);


/**
 * Handle 404 errors for undefined routes.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

/**
 * Global error handler.
 * 
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5432;

/**
 * Initialize default roles in the database.
 * 
 * @async
 */
async function initRoles() {
    const roles = ['client', 'pro_invité', 'pro', 'admin'];
    for (const role of roles) {
        await Roles.findOrCreate({
            where: { role_name: role },
            defaults: { role_name: role }
        });
    }
}

/**
 * Initialize the application.
 * 
 * @async
 */
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

// Start the application
initApp();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const carRoutes = require('./routes/carRoutes');
const garageRoutes = require('./routes/garageRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const specificServiceRoutes = require('./routes/specificServicesRoutes');
const { sequelize, Roles } = require('./Models');
const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/car', carRoutes);
app.use('/api/garage', garageRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/specifiqueService', specificServiceRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 3000;

async function initRoles() {
    const roles = ['client', 'pro_invité', 'pro', 'admin'];
    for (const role of roles) {
        await Roles.findOrCreate({
            where: { role_name: role },
            defaults: { role_name: role }
        });
    }
}

async function initApp() {
    try {
        await sequelize.sync({ force: false, alter: false });

        await initRoles();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error initializing app:', error.message);
    }
}

initApp();

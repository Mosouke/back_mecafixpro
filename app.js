const express = require('express');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const carRoutes = require('./routes/carRoutes');
const { sequelize, Roles } = require('./Models');
const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/car', carRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 3000;

async function initRoles() {
    const roles = ['client', 'pro_invité', 'pro'];
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

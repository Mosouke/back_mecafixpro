const express = require('express');
const authRoutes = require('./routes/authRoutes');
const { sequelize, Roles } = require('./Models');  
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

async function initRoles() {
    const roles = ['client', 'pro_invité', 'pro'];
    for (const role of roles) {
        await Roles.findOrCreate({
            where: { role_name: role },
            defaults: { role_name: role }
        });
    }
    console.log('Roles initialized');
}

async function initApp() {
    try {
        await sequelize.sync({ force: false, alter: true });
        console.log('Database synchronized');

        await initRoles();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

initApp();
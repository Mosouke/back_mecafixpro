const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Users, Roles } = require('../Models');
require('dotenv').config();

exports.login = async (req, res) => {
    try {
        const { mail_user, password } = req.body;
        const user = await Users.findOne({ where: { mail_user } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Wrong password' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }       
};

exports.register = async (req, res) => {
    try {
        const { mail_user, password } = req.body;
        // le mot de pass doit être entre 4 et 100 caractères
        if (password.length < 4 || password.length > 100) {
            return res.status(400).json({ message: 'Password must be between 4 and 100 characters long' });
        }
        const user = await Users.findOne({ where: { mail_user } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
       
        // Trouver ou créer le rôle 'client'
        const [clientRole, created] = await Roles.findOrCreate({
            where: { role_name: 'client' },
            defaults: { role_name: 'client' }
        });

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.create({
            mail_user, 
            password: hashPassword,
            fk_role_id: clientRole.role_id  
        });

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ token });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ error: error.message });
    }
};
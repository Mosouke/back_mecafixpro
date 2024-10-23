const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const { Users } = require('../Models');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET; 

/**
 * Enregistrer un nouvel utilisateur
 * @param {Object} req - Objet de requête
 * @param {Object} res - Objet de réponse
 */
exports.register = async (req, res) => {
    const { mail_user, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({ mail_user, password: hashedPassword });
        const token = jwt.sign({ id: user.id, mail_user: user.mail_user }, JWT_SECRET, { expiresIn: '60d' }); 

        return res.status(201).json({ token }); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Connecter un utilisateur existant
 * @param {Object} req - Objet de requête
 * @param {Object} res - Objet de réponse
 */
exports.login = async (req, res) => {
    const { mail_user, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await Users.findOne({ where: { mail_user } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, mail_user: user.mail_user }, JWT_SECRET, { expiresIn: '60d' }); 

        return res.status(200).json({ token }); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Vérifier un token JWT
 * @param {Object} req - Objet de requête
 * @param {Object} res - Objet de réponse
 */
exports.verifyToken = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Users.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        return res.status(200).json({ message: 'Token is valid', user });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};

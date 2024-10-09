// @ts-nocheck
const { Users } = require('../Models');
const { validationResult } = require('express-validator');
/**
 * Enregistrer un nouvel utilisateur
 * @param {Object} req - Objet de requête
 * @param {Object} res - Objet de réponse
 */
exports.register = async (req, res) => {
    const { mail_user, password } = req.body;

    try {
        // Logique d'enregistrement
        const user = await Users.create({ mail_user, password });
        return res.status(201).json(user);
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

    try {
        // Logique de connexion
        const user = await Users.findOne({ where: { mail_user } });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

// @ts-nocheck
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../Models');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '1d'; 

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

/**
 * Enregistrer un nouvel utilisateur dans la base de données.
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
 */
exports.register = async (req, res) => {
    const { mail_user, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userExists = await Users.findOne({ where: { mail_user } });
        if (userExists) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await Users.create({ mail_user, password: hashedPassword });
        const token = jwt.sign({ id: user.id_user, mail_user: user.mail_user }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

        return res.status(201).json({ token });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de l\'enregistrement.' });
    }
};

/**
 * Connecter un utilisateur existant.
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
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
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const token = jwt.sign(
            { id: user.id_user, mail_user: user.mail_user },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        return res.status(200).json({ token });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la connexion.' });
    }
};

/**
 * Obtenir l'email de l'utilisateur authentifié.
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
 */
exports.userMail = async (req, res) => {
    try {
        const user = await Users.findByPk(req.user.id, { attributes: ['mail_user'] });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        return res.status(200).json({ email: user.mail_user });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'email:', error);
        return res.status(500).json({ error: 'Une erreur interne est survenue' });
    }
};

/**
 * Vérifier la validité d'un token JWT.
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
 */
exports.verifyToken = async (req, res) => {
    return res.status(200).json({ message: 'Token valide', user: { id: req.user.id, mail_user: req.user.mail_user } });
};
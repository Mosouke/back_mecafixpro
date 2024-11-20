// @ts-nocheck
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UsersClients } = require('../Models');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '1d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

/**
 * Enregistrer un nouvel utilisateur avec des informations client.
 */
exports.register = async (req, res) => {
    const { 
        mail_user_client, 
        password, 
        user_client_name, 
        user_client_last_name, 
        user_client_phone_number, 
        user_client_address 
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userExists = await UsersClients.findOne({ where: { mail_user_client } });
        if (userExists) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await UsersClients.create({
            mail_user_client,
            password: hashedPassword,
            user_client_name: user_client_name || null,
            user_client_last_name: user_client_last_name || null,
            user_client_phone_number: user_client_phone_number || null,
            user_client_address: user_client_address || null,
        });

        const token = jwt.sign(
            { id_user_client: user.id_user_client, mail_user_client: user.mail_user_client },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        return res.status(201).json({ token, user });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de l\'enregistrement.' });
    }
};

/**
 * Connecter un utilisateur existant.
 */
exports.login = async (req, res) => {
    const { mail_user_client, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await UsersClients.findOne({ where: { mail_user_client } });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const token = jwt.sign(
            { id_user_client: user.id_user_client, mail_user_client: user.mail_user_client },
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
 * Récupérer les informations utilisateur et client associées.
 */
exports.getUserAndClientInfo = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        const user = await UsersClients.findByPk(req.user.id_user_client, {
            attributes: [
                'mail_user_client',
                'user_client_name',
                'user_client_last_name',
                'user_client_phone_number',
                'user_client_address',
                'user_client_image_name',
            ],
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Erreur lors de la récupération des informations:', error);
        return res.status(500).json({ error: 'Une erreur interne est survenue' });
    }
};

/**
 * Mettre à jour les informations client d’un utilisateur existant.
 */
exports.updateClientInfo = async (req, res) => {
    const { 
        user_client_name, 
        user_client_last_name, 
        user_client_phone_number, 
        user_client_address, 
        user_client_image_name 
    } = req.body;

    try {
        const updated = await UsersClients.update(
            { 
                user_client_name, 
                user_client_last_name, 
                user_client_phone_number, 
                user_client_address, 
                user_client_image_name 
            },
            { where: { id_user_client: req.user.id_user_client } }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }

        const updatedClient = await UsersClients.findOne({ where: { id_user_client: req.user.id_user_client } });
        res.status(200).json(updatedClient);
    } catch (error) {        
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

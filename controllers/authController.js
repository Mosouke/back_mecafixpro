// @ts-nocheck
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UsersClients } = require('../Models');
const { validationResult } = require('express-validator');


const { createUploadthing } = require('uploadthing');
const { fileRouter } = require('../middleware/uploadThing');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '1d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

const uploadHandler = uploadthing.createUploadthingHandler({ router: fileRouter });

/**
 * Enregistrer un nouvel utilisateur-client.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.register = async (req, res) => {
    const { mail_user_client, password, client_name, client_last_name, client_phone_number, client_address } = req.body;

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
        const newUserClient = await UsersClients.create({
            mail_user_client,
            password: hashedPassword,
            client_name,
            client_last_name,
            client_phone_number,
            client_address,
            client_image_name: null, // À définir après l'upload si nécessaire
        });

        const token = jwt.sign(
            { id: newUserClient.user_client_id, mail_user_client: newUserClient.mail_user_client },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        return res.status(201).json({ token, user: newUserClient });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de l\'enregistrement.' });
    }
};

/**
 * Connecter un utilisateur-client existant.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
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
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        const token = jwt.sign(
            { id: user.user_client_id, mail_user_client: user.mail_user_client },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        return res.status(200).json({ token, user });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la connexion.' });
    }
};

/**
 * Obtenir tous les utilisateurs-clients.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getAllUsersClients = async (req, res) => {
    try {
        const usersClients = await UsersClients.findAll({
            attributes: [
                'user_client_id',
                'mail_user_client',
                'client_name',
                'client_last_name',
                'client_phone_number',
                'client_address',
                'client_image_name',
            ],
        });
        return res.status(200).json(usersClients);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs-clients :', error);
        return res.status(500).json({ error: 'Une erreur est survenue.' });
    }
};

/**
 * Obtenir les informations d'un utilisateur-client spécifique.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getUserClientById = async (req, res) => {
    try {
        const { user_client_id } = req.params;

        const userClient = await UsersClients.findOne({
            where: { user_client_id },
            attributes: [
                'user_client_id',
                'mail_user_client',
                'client_name',
                'client_last_name',
                'client_phone_number',
                'client_address',
                'client_image_name',
            ],
        });

        if (!userClient) {
            return res.status(404).json({ message: 'Utilisateur-client non trouvé.' });
        }

        return res.status(200).json(userClient);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur-client :', error);
        return res.status(500).json({ error: 'Une erreur est survenue.' });
    }
};

/**
 * Mettre à jour les informations d'un utilisateur-client.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.updateUserClient = async (req, res) => {
    const { user_client_id } = req.params;
    const { client_name, client_last_name, client_phone_number, client_address } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Gestion des fichiers avec UploadThing
        const client_image_url = req.body.files?.[0]?.url || null;

        const [updated] = await UsersClients.update(
            { client_name, client_last_name, client_phone_number, client_address, client_image_name: client_image_url },
            { where: { user_client_id } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Utilisateur-client non trouvé.' });
        }

        const updatedUserClient = await UsersClients.findOne({ where: { user_client_id } });
        return res.status(200).json(updatedUserClient);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur-client :', error);
        return res.status(500).json({ error: 'Une erreur est survenue.' });
    }
};

/**
 * Vérifier la validité d'un token JWT.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.verifyToken = async (req, res) => {
    return res.status(200).json({ message: 'Token valide', user: { id: req.user.id, mail_user_client: req.user.mail_user_client } });
};

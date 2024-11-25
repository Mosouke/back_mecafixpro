// @ts-nocheck
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UsersClients, Cars, Roles } = require('../Models');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '1d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

/**
 * Enregistrer un nouvel utilisateur-client.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.register = async (req, res) => {
    const { mail_user_client, password_user_client } = req.body;

    if (!mail_user_client || !password_user_client) {
        return res.status(400).json({ error: 'L\'email et le mot de passe sont requis.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Vérification si l'utilisateur existe déjà
        const userExists = await UsersClients.findOne({ where: { mail_user_client } });
        if (userExists) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
        }

        // Récupérer le rôle "client" depuis la table des rôles
        const clientRole = await Roles.findOne({ where: { role_name: 'client' } });
        if (!clientRole) {
            return res.status(500).json({ error: 'Le rôle "client" est introuvable dans la base de données.' });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password_user_client, 12);

        // Création de l'utilisateur avec des valeurs par défaut pour les autres champs
        const newUserClient = await UsersClients.create({
            mail_user_client,
            password_user_client: hashedPassword,
            client_name: 'Nom par défaut',
            client_last_name: 'Nom de famille par défaut',
            client_phone_number: '0123456789',
            client_address: 'Adresse par défaut',
            role_id: clientRole.role_id, // Associer le rôle "client"
        });

        // Créer une voiture par défaut associée à l'utilisateur
        const newCar = await Cars.create({
            car_marque: 'Marque par défaut', 
            car_modele: 'Modèle par défaut',
            car_year: 2020, 
            car_license_plate: 'AA-123-BB', 
            fk_user_client_id: newUserClient.user_client_id,
        });

        // Générer un token JWT
        const token = jwt.sign(
            { id: newUserClient.user_client_id, mail_user_client: newUserClient.mail_user_client },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        // Répondre avec le token et les données de l'utilisateur
        return res.status(201).json({
            token,
            user_client: {
                id: newUserClient.user_client_id,
                mail_user_client: newUserClient.mail_user_client,
                client_name: newUserClient.client_name,
                client_last_name: newUserClient.client_last_name,
                client_phone_number: newUserClient.client_phone_number,
                client_address: newUserClient.client_address,
            },
            car: {
                id: newCar.car_id,
                car_brand: newCar.car_brand,
                car_model: newCar.car_model,
                car_year: newCar.car_year,
                car_plate: newCar.car_plate,
            }
        });

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
    const { mail_user_client, password_user_client } = req.body;

    console.log('Requête de connexion reçue avec :', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Erreurs de validation :', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Vérifier l'existence de l'utilisateur
        const user = await UsersClients.findOne({ where: { mail_user_client } });
        if (!user) {
            console.log('Utilisateur non trouvé pour l\'email :', mail_user_client);
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        // Comparer le mot de passe
        const isPasswordValid = await bcrypt.compare(password_user_client, user.password_user_client);
        if (!isPasswordValid) {
            console.log('Mot de passe incorrect pour l\'utilisateur :', mail_user_client);
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        // Générer un JWT
        const token = jwt.sign(
            { id: user.user_client_id, mail_user_client: user.mail_user_client },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        console.log('Connexion réussie pour l\'utilisateur :', mail_user_client);

        // Retourner la réponse
        return res.status(200).json({
            token,
            user: {
                id: user.user_client_id,
                email: user.mail_user_client,
                name: user.user_client_name,
                lastName: user.user_client_last_name,
            },
        });

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
            { client_name, client_last_name, client_phone_number, client_address },
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
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token manquant ou invalide' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Vérification des données de l'utilisateur
        const user = await UsersClients.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé.' });
        }

        return res.status(200).json({
            message: 'Token valide',
            user_client: {
                user_client_id: user.user_client_id,
                mail_user_client: user.mail_user_client,
            }
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Le token a expiré. Veuillez vous reconnecter.',
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Le token est invalide.',
            });
        }

        console.error('Erreur serveur:', err);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};
/**
 * Vérifier la validité d'un token JWT.
 */
exports.verifyToken = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    return res.status(200).json({
        message: 'Token valide',
        user_client: req.user,
    });
};
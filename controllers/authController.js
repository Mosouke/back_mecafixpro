const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UsersClients, Roles, Cars } = require('../Models');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '1d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

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
        const userExists = await UsersClients.findOne({ where: { mail_user_client } });
        if (userExists) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
        }

        const clientRole = await Roles.findOne({ where: { role_name: 'client' } });
        if (!clientRole) {
            return res.status(500).json({ error: 'Le rôle "client" est introuvable.' });
        }

        const hashedPassword = await bcrypt.hash(password_user_client, 12);

        // Utilisation d'une transaction Sequelize pour garantir la cohérence
        const newUserClient = await sequelize.transaction(async (transaction) => {
            const user = await UsersClients.create({
                mail_user_client,
                password_user_client: hashedPassword,
                user_client_name: 'Nom par défaut',
                user_client_last_name: 'Nom de famille par défaut',
                user_client_phone_number: '0123456789',
                user_client_address: 'Adresse par défaut',
                role_id: clientRole.role_id,
            }, { transaction });

            await Cars.create({
                car_marque: 'Marque par défaut',
                car_modele: 'Modèle par défaut',
                car_year: 2020,
                car_license_plate: 'AA-123-BB',
                fk_user_client_id: user.user_client_id,
            }, { transaction });

            return user;
        });

        const token = jwt.sign(
            { id: newUserClient.user_client_id, mail_user_client: newUserClient.mail_user_client },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        return res.status(201).json({
            token,
            user_client: {
                id: newUserClient.user_client_id,
                mail_user_client: newUserClient.mail_user_client,
                client_name: newUserClient.user_client_name,
                client_last_name: newUserClient.user_client_last_name,
                client_phone_number: newUserClient.user_client_phone_number,
                client_address: newUserClient.user_client_address,
            },
            car: {
                car_brand: 'Marque par défaut',
                car_model: 'Modèle par défaut',
                car_year: 2020,
                car_plate: 'AA-123-BB',
            },
        });

    } catch (error) {
        console.error('Erreur lors de l\'enregistrement :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de l\'enregistrement.' });
    }
};

exports.login = async (req, res) => {
    const { mail_user_client, password_user_client } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await UsersClients.findOne({ where: { mail_user_client } });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        const isPasswordValid = await bcrypt.compare(password_user_client, user.password_user_client);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        const token = jwt.sign(
            { id: user.user_client_id, mail_user_client: user.mail_user_client },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

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

exports.verifyToken = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }
    return res.status(200).json({
        message: 'Token valide',
        user_client_id: req.user,
    });
};

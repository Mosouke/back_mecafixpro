// @ts-nocheck
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../services/emailService');
const { UsersClients, Roles, Cars } = require('../Models');
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
            user_client_name: 'Nom par défaut',
            user_client_last_name: 'Nom de famille par défaut',
            user_client_phone_number: '0123456789',
            user_client_address: 'Adresse par défaut',
            role_id: clientRole.role_id,
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
                car_marque: newCar.car_marque,
                car_modele: newCar.car_modele,
                car_year: newCar.car_year,
                car_license_plate: newCar.car_license_plate,
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Vérifier l'existence de l'utilisateur
        const user = await UsersClients.findOne({ where: { mail_user_client } });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        // Comparer le mot de passe
        const isPasswordValid = await bcrypt.compare(password_user_client, user.password_user_client);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        // Générer un JWT
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

exports.forgotPassword = async (req, res) => {
    const { mail_user_client } = req.body;
  
    try {
      const user = await UsersClients.findOne({ where: { mail_user_client } });
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
  
      user.reset_password_token = resetToken;
      user.reset_password_expires = Date.now() + 3600000; // 1 heure
      await user.save();
  
    
      const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
      const message = `
        <h1>Réinitialisation de votre mot de passe</h1>
        <p>Bonjour ${user.user_client_name ? user.user_client_name : user.mail_user_client},</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
        <p>Ce lien expirera dans une heure.</p>
      `;
  
     
      await sendEmail(mail_user_client, "Réinitialisation du mot de passe", message);
  
      res.status(200).json({ message: "E-mail de réinitialisation envoyé." });
  
    } catch (error) {
      console.error("Erreur lors de la récupération du mot de passe :", error);
      res.status(500).json({ error: "Erreur du serveur. Réessayez plus tard." });
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
        user_client_id: req.user,
    });
};

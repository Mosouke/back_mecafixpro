// @ts-nocheck
const jwt = require('jsonwebtoken');
const { UsersClients, Roles } = require('../Models');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

/**
 * Middleware pour authentifier les utilisateurs basé sur le token JWT.
 * @param {import('express').Request} req - L'objet requête.
 * @param {import('express').Response} res - L'objet réponse.
 * @param {import('express').NextFunction} next - La fonction suivante dans la chaîne de middleware.
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Token d'authentification manquant ou invalide",
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded JWT:', decoded);
        
        // Recherche de l'utilisateur dans le modèle UsersClients
        const user_client = await UsersClients.findByPk(decoded.id_user_client, {
            include: [{ model: Roles, as: 'role' }],  // On inclut les rôles associés
            attributes: ['id_user_client', 'mail_user_client', 'role_id'], // Récupérer l'email et le rôle
        });

        if (!user_client) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé',
            });
        }

        req.user_client = user_client;  // On utilise 'user_client' ici pour rester cohérent
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré',
            });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token invalide',
            });
        } else {
            console.error('Erreur inattendue:', err);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur lors de l'authentification",
            });
        }
    }
};

/**
 * Middleware pour vérifier si l'utilisateur authentifié a des privilèges d'administrateur.
 * @param {import('express').Request} req - L'objet requête.
 * @param {import('express').Response} res - L'objet réponse.
 * @param {import('express').NextFunction} next - La fonction suivante dans la chaîne de middleware.
 */
const adminMiddleware = async (req, res, next) => {
    if (!req.user_client || !req.user_client.role) {
        return res.status(403).json({
            success: false,
            message: 'Accès refusé, utilisateur non authentifié.',
        });
    }

    // Vérification du rôle de l'utilisateur : on s'assure que l'utilisateur a bien le rôle 'admin'
    if (req.user_client.role.role_name === 'admin') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Accès refusé, privilèges insuffisants.',
    });
};

module.exports = {
    authMiddleware,
    adminMiddleware
};

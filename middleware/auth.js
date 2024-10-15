const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Users, Roles } = require('../Models'); // Assurez-vous que le chemin est correct

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    /* istanbul ignore next */
    throw new Error('JWT_SECRET must be defined in environment variables');
}

/**
 * Middleware for authenticating users based on JWT token.
 * 
 * @async
 * @function authMiddleware
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - Calls next middleware or responds with an error.
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
        const user = await Users.findByPk(decoded.userId, {
            include: [{ model: Roles, as: 'role' }],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé',
            });
        }

        req.user = user; 
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
 * Middleware to check if the authenticated user has admin privileges.
 * 
 * @async
 * @function adminMiddleware
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - Calls next middleware or responds with an error.
 */
const adminMiddleware = async (req, res, next) => {
    // Vérifie si l'utilisateur est authentifié et a un rôle
    if (!req.user || !req.user.role) {
        return res.status(403).json({
            success: false,
            message: 'Accès refusé, utilisateur non authentifié.',
        });
    }

    // Vérifie si l'utilisateur a un rôle d'admin
    if (req.user.role.role_name === 'admin') {
        return next(); // Passe au middleware suivant
    }

    return res.status(403).json({
        success: false,
        message: 'Accès refusé, utilisateur non autorisé.',
    });
};

module.exports = {
    authMiddleware,
    adminMiddleware
};

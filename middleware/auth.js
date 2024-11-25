// @ts-nocheck
const jwt = require('jsonwebtoken');
const { UsersClients, Roles } = require('../Models');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

/**
 * Middleware pour authentifier les utilisateurs basé sur le token JWT.
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Token d'authentification manquant ou invalide.",
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token corrompu ou vide.",
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Payload JWT décodé :", decoded); 

        const user = await UsersClients.findByPk(decoded.user_client_id, {
            include: [{ model: Roles, as: 'role', attributes: ['role_name'] }],
            attributes: ['user_client_id', 'mail_user_client', 'fk_role_id'],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non trouvé.",
            });
        }

        req.user = {
            user_client_id: user.user_client_id,
            mail_user_client: user.mail_user_client,
            role_name: user.role ? user.role.role_name : null,
        };

        

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Le token a expiré. Veuillez vous reconnecter.",
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Le token est invalide. Vérifiez vos informations.",
            });
        }

        console.error("Erreur inattendue lors de l'authentification :", err);
        return res.status(500).json({
            success: false,
            message: "Erreur serveur lors de l'authentification.",
        });
    }
};

/**
 * Middleware pour vérifier si l'utilisateur authentifié a des privilèges d'administrateur.
 */
const adminMiddleware = async (req, res, next) => {
    if (!req.user || !req.user.role_name) {
        return res.status(403).json({
            success: false,
            message: "Accès refusé : utilisateur non authentifié ou rôle manquant.",
        });
    }

    if (req.user.role_name === 'admin') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Accès refusé : privilèges administrateurs nécessaires.",
    });
};

module.exports = {
    authMiddleware,
    adminMiddleware,
};

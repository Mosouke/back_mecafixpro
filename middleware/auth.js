const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Users } = require('../Models');  

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token d\'authentification manquant ou invalide'
            });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await Users.findByPk(decoded.userId);  // Utilise "Users" ici

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            req.user = user;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expiré'
                });
            } else if (err instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    success: false,
                    message: 'Token invalide'
                });
            }
            throw err;
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de l\'authentification'
        });
    }
};

module.exports = authMiddleware;

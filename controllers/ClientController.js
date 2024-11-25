const { UsersClients } = require('../Models');
const { validationResult } = require('express-validator');

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
                'user_client_name',
                'user_client_last_name',
                'user_client_phone_number',
                'user_client_address',
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
        console.log("Client Controller")
        const { user_client_id } = req.params;

        const userClient = await UsersClients.findOne({
            where: { user_client_id },
            attributes: [
                'user_client_id',
                'mail_user_client',
                'user_client_name',
                'user_client_last_name',
                'user_client_phone_number',
                'user_client_address',
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
    const { user_client_name, user_client_last_name, user_client_phone_number, user_client_address } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Gestion des fichiers avec UploadThing
        const client_image_url = req.body.files?.[0]?.url || null;

        const [updated] = await UsersClients.update(
            { user_client_name, user_client_last_name, user_client_phone_number, user_client_address },
            { where: { user_client_id } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Utilisateur-client non trouvé.' });
        }

        return res.status(200).json({ message: 'Utilisateur-client mis à jour.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur-client :', error);
        return res.status(500).json({ error: 'Une erreur est survenue.' });
    }
};

/**
 * Supprimer un utilisateur-client.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteUserClient = async (req, res) => {
    try {
        const { user_client_id } = req.params;
        const deleted = await UsersClients.destroy({ where: { user_client_id } });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Utilisateur-client non trouvé.' });
        }

        return res.status(200).json({ message: 'Utilisateur-client supprimé.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur-client :', error);
        return res.status(500).json({ error: 'Une erreur est survenue.' });
    }
};

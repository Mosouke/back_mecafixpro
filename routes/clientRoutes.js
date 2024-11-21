// @ts-nocheck
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authMiddleware } = require('../middleware/auth');
const { validateClientCreation, validateClientUpdate } = require('../middleware/validator');
const upload = require('../middleware/multer');

/**
 * @route GET /clients
 * @group Clients - Opérations concernant les clients
 * @returns {Array.<Object>} 200 - Un tableau d'objets client.
 * @returns {Object} 500 - Erreur interne du serveur.
 */
router.get('/', authMiddleware, clientController.getClients);

/**
 * @route GET /clients/profile
 * @group Clients - Opérations concernant les clients
 * @returns {Object} 200 - Objet client.
 * @returns {Object} 404 - Client non trouvé.
 * @returns {Object} 500 - Erreur interne du serveur.
 */
router.get('/profile', authMiddleware, clientController.getClient);

/**
 * @route POST /clients/add
 * @group Clients - Opérations concernant les clients
 * @param {Object} req - L'objet de requête contenant les données du client.
 * @param {string} req.body.client_image_name - Nom de l'image du client.
 * @param {string} req.body.client_name - Nom du client.
 * @param {string} req.body.client_last_name - Nom de famille du client.
 * @param {string} req.body.client_phone_number - Numéro de téléphone du client.
 * @param {string} req.body.client_address - Adresse du client.
 * @returns {Object} 201 - Client créé avec succès.
 * @returns {Object} 400 - Mauvaise requête si la validation échoue.
 * @returns {Object} 500 - Erreur interne du serveur.
 */
router.post('/add', authMiddleware, upload.single('client_image'), validateClientCreation, clientController.createClient);

/**
 * @route PUT /clients/update/{client_id}
 * @group Clients - Opérations concernant les clients
 * @param {number} client_id.path.required - ID du client à mettre à jour.
 * @param {Object} req - L'objet de requête contenant les données mises à jour du client.
 * @param {string} req.body.client_image_name - Nom de l'image du client (optionnel).
 * @param {string} req.body.client_name - Nom du client (optionnel).
 * @param {string} req.body.client_last_name - Nom de famille du client (optionnel).
 * @param {string} req.body.client_phone_number - Numéro de téléphone du client (optionnel).
 * @param {string} req.body.client_address - Adresse du client (optionnel).
 * @returns {Object} 200 - Client mis à jour avec succès.
 * @returns {Object} 404 - Client non trouvé.
 * @returns {Object} 400 - Mauvaise requête si la validation échoue.
 * @returns {Object} 500 - Erreur interne du serveur.
 */
router.put('/update/:client_id', authMiddleware, upload.single('client_image'), validateClientUpdate, clientController.updateClient);

module.exports = router;

// @ts-nocheck
const { Clients } = require('../Models');
const { validationResult } = require('express-validator');

/**
 * @module controllers/clientController
 */

/**
 * Get all clients.
 * 
 * @function getClients
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing all clients or an error message
 */
exports.getClients = async (req, res) => {
    try {
        const clients = await Clients.findAll();
        res.status(200).json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get a specific client by ID.
 * 
 * @function getClient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the client or an error message
 */
exports.getClient = async (req, res) => {
    try {
        const { client_id } = req.params;
        const client = await Clients.findOne({ where: { client_id } });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create a new client.
 * 
 * @function createClient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the created client or an error message
 */
exports.createClient = async (req, res) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userEmail = req.user.mail_user;  
        if (!userEmail) {
            console.error('User not authenticated'); 
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { client_image_name, client_name, client_last_name, client_phone_number, client_address } = req.body;

        const client = await Clients.create({
            client_image_name,
            client_name,
            client_last_name,
            client_phone_number,
            client_address,
            fk_mail_user: userEmail 
        });

        res.status(201).json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update an existing client by ID.
 * 
 * @function updateClient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the updated client or an error message
 */
exports.updateClient = async (req, res) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { client_id } = req.params;
        const { client_image_name, client_name, client_last_name, client_phone_number, client_address } = req.body;

        const [updated] = await Clients.update(
            { client_image_name, client_name, client_last_name, client_phone_number, client_address },
            { where: { client_id } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const updatedClient = await Clients.findOne({ where: { client_id } });
        res.status(200).json(updatedClient);
    } catch (error) {        
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// @ts-nocheck
const { Clients } = require('../Models');
const { validationResult } = require('express-validator');

/**
 * Create a new client.
 * 
 * @function createClient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the created client or an error message
 * @throws {Error} 400 - Bad request if validation fails
 * @throws {Error} 401 - Unauthorized if the user is not authenticated
 * @throws {Error} 500 - Internal server error if unable to create the client
 */
exports.createClient = async (req, res) => {
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

        // Vérifier si le client existe déjà pour cet utilisateur
        const existingClient = await Clients.findOne({
            where: { fk_mail_user: userEmail }
        });

        if (existingClient) {
            return res.status(400).json({ message: 'Client profile already exists for this user' });
        }

        // Données du client à créer
        const { client_image_name = 'default_image.png', client_name, client_last_name, client_phone_number = '0000000000', client_address = 'Non renseignée' } = req.body;

        // Créer le nouveau client
        const client = await Clients.create({
            client_image_name,
            client_name,
            client_last_name,
            client_phone_number,
            client_address,
            fk_mail_user: userEmail  // Lier l'utilisateur au client par l'email
        });

        res.status(201).json(client);  // Retourner les informations du client créé
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get all clients.
 * 
 * @function getClients
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing all clients or an error message
 * @throws {Error} 500 - Internal server error if unable to fetch clients
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
 * @throws {Error} 404 - Client not found if the specified ID does not exist
 * @throws {Error} 500 - Internal server error if unable to fetch the client
 */
exports.getClient = async (req, res) => {
    try {
        // Récupération de l'ID à partir de la requête
        const { client_id } = req.user;
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
 * Update an existing client by ID.
 * 
 * @function updateClient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the updated client or an error message
 * @throws {Error} 400 - Bad request if validation fails
 * @throws {Error} 404 - Client not found if the specified ID does not exist
 * @throws {Error} 500 - Internal server error if unable to update the client
 */
exports.updateClient = async (req, res) => {
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

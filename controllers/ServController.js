// @ts-nocheck
const { Services, Garages } = require('../Models');

/**
 * @module controllers/serviceController
 */

/**
 * Get all services.
 * 
 * @function getServices
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing all services or an error message
 */
exports.getAllServices = async (req, res) => {
    try {
        const services = await Services.findAll();
        res.status(200).json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get a specific service by ID.
 * 
 * @function getService
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the service or an error message
 */
exports.getService = async (req, res) => {
    try {
        const { service_id } = req.params;
        const service = await Services.findOne({ where: { service_id } });
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create new services from an array of service names.
 * 
 * @function createService
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object indicating the services were created successfully or an error message
 */
exports.createService = async (req, res) => {
    try {
        const { service_name } = req.body; 
        console.log('Received service names:', service_name); 

        if (!Array.isArray(service_name) || service_name.length === 0) {
            return res.status(400).json({ message: 'service_name must be an array of strings' });
        }

        for (let name of service_name) {
            console.log('Creating service:', name); 
            const service = await Services.create({ service_name: name, fk_garage_id: null });
            console.log('Service created:', service); 
        }

        res.status(201).json({ message: 'Services created successfully' });
    } catch (error) {
        console.error('Error creating services:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update an existing service and optionally associate it with a garage.
 * 
 * @function updateService
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the updated service or an error message
 */
exports.updateService = async (req, res) => {
    try {
        const { service_id } = req.params;
        const { service_name, garage_id } = req.body;  // garage_id added for optional association

        // Update the service
        const [updated] = await Services.update(
            { service_name, fk_garage_id: garage_id || null }, // Assign garage_id if provided; otherwise, keep null
            { where: { service_id } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const updatedService = await Services.findOne({ where: { service_id } });
        res.status(200).json(updatedService);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: error.message });
    }
};

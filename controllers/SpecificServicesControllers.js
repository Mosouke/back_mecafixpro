// @ts-nocheck
const { SpecificServices } = require('../Models');

/**
 * @module controllers/specificServiceController
 */

/**
 * Get all specific services.
 * 
 * @function getSpecificServices
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing all specific services or an error message
 */
exports.getSpecificServices = async (req, res) => {
    try {
        const specificServices = await SpecificServices.findAll();
        res.status(200).json(specificServices);
    } catch (error) {
        console.error('Error fetching SpecificServices:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get a specific service by ID.
 * 
 * @function getSpecificService
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the specific service or an error message
 */
exports.getSpecificService = async (req, res) => {
    try {
        const { specificServices_id } = req.params;
        const specificService = await SpecificServices.findOne({ where: { id: specificServices_id } });
        if (!specificService) {
            return res.status(404).json({ message: 'Specific Service not found' });
        }
        res.status(200).json(specificService);
    } catch (error) {
        console.error('Error fetching specificService:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create new specific services from an array of service entries.
 * 
 * @function createSpecificServices
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object indicating the services were created successfully or an error message
 */
exports.createSpecificServices = async (req, res) => {
    try {
        const { specificService_entries } = req.body;
        console.log('Received specificService entries:', specificService_entries);

        if (!Array.isArray(specificService_entries) || specificService_entries.length === 0) {
            return res.status(400).json({ message: 'specificService_entries must be an array of objects' });
        }

        const createdSpecificServices = [];
        for (let entry of specificService_entries) {
            const { specificService_name, fk_service_id } = entry;

            if (!specificService_name || typeof specificService_name !== 'string') {
                return res.status(400).json({ message: 'Each entry must have a valid specificService_name' });
            }

            console.log('Creating specific service:', specificService_name);
            const specificService = await SpecificServices.create({ specificService_name, fk_service_id });
            console.log('Specific Service created:', specificService);
            createdSpecificServices.push(specificService);
        }

        res.status(201).json({ message: 'Specific Services created successfully', createdSpecificServices });
    } catch (error) {
        console.error('Error creating Specific Services:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update an existing specific service by ID.
 * 
 * @function updateSpecificService
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the updated specific service or an error message
 */
exports.updateSpecificService = async (req, res) => {
    try {
        const { specificServices_id } = req.params;
        const { specificService_name } = req.body;

        if (!specificService_name || typeof specificService_name !== 'string') {
            return res.status(400).json({ message: 'specificService_name must be a string' });
        }

        const [updated] = await SpecificServices.update(
            { specificService_name },
            { where: { id: specificServices_id } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Specific Service not found' });
        }

        const updatedSpecificService = await SpecificServices.findOne({ where: { id: specificServices_id } });
        res.status(200).json(updatedSpecificService);
    } catch (error) {
        console.error('Error updating Specific Service:', error);
        res.status(500).json({ error: error.message });
    }
};

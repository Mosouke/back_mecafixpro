const { Services, Garages } = require('../Models');

// Récupérer tous les services
exports.getServices = async (req, res) => {
    try {
        const services = await Services.findAll();
        res.status(200).json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un service par ID
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

exports.createService = async (req, res) => {
    try {
        const { service_name } = req.body; 
        console.log('Received service names:', service_name); 

        if (!Array.isArray(service_name) || service_name.length === 0) {
            return res.status(400).json({ message: 'service_name must be an array of strings' });
        }

        for (let name of service_name) {
            console.log('Creating service:', name); 
            const services = await Services.create({ service_name: name, fk_garage_id: null });
            console.log('Service created:', services); 
        }

        res.status(201).json({ message: 'Services created successfully' });
    } catch (error) {
        console.error('Error creating services:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un service et optionnellement l'associer à un garage
exports.updateService = async (req, res) => {
    try {
        const { service_id } = req.params;
        const { service_name, garage_id } = req.body;  // garage_id ajouté pour permettre l'assignation lors de la mise à jour

        // Mise à jour du service
        const [updated] = await Services.update(
            { service_name, fk_garage_id: garage_id || null }, // Si garage_id est fourni, l'assigner ; sinon, garder null
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

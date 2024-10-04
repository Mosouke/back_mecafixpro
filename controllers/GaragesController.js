const Garages = require('../Models/Garages');

exports.getGarages = async (req, res) => {
    try {
        const garages = await Garages.findAll();
        res.status(200).json(garages);
    } catch (error) {
        console.error('Error fetching garages:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getGarage = async (req, res) => {
    try {
        const { garage_id } = req.params;
        const garage = await Garages.findOne({ where: { garage_id } });
        if (!garage) {
            return res.status(404).json({ message: 'Garage not found' });
        }
        res.status(200).json(garage);
    } catch (error) {
        console.error('Error fetching garage:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.createGarage = async (req, res) => {
    try {
        const { garage_name, garage_address, garage_phone, garage_city, garage_postal_code } = req.body;
        
        if (!garage_name || !garage_address || !garage_phone || !garage_city || !garage_postal_code /* || !eval_id */) {
            console.error('Missing required fields');
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Vérifie si l'évaluation existe (à décommenter plus tard)
        /*
        const eval = await Evaluations.findOne({ where: { eval_id } });
        if (!eval) {
            return res.status(404).json({ message: 'Évaluation non trouvée' });
        }
        */

        const garage = await Garages.create({
            garage_name,
            garage_address,
            garage_phone,
            garage_city,
            garage_postal_code,
            // fk_eval_id: eval.eval_id // À décommenter plus tard si nécessaire
        });

        res.status(201).json(garage);
    } catch (error) {
        console.error('Error creating garage:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateGarage = async (req, res) => {
    try {
        const { garage_id /* , eval_id */ } = req.params;  // je conserve eval_id pour l'utilisation future
        const { garage_name, garage_address, garage_phone, garage_city, garage_postal_code } = req.body;

        // Vérifie si l'évaluation existe (à décommenter plus tard)
        /*
        const eval = await Evaluations.findOne({ where: { eval_id } });
        if (!eval) {
            return res.status(404).json({ message: 'Évaluation non trouvée' });
        }
        */

        const [updated] = await Garages.update(
            { 
                garage_name, 
                garage_address, 
                garage_phone, 
                garage_city, 
                garage_postal_code, 
                // fk_eval_id: eval_id // À décommenter plus tard si nécessaire
            },
            { where: { garage_id } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Garage not found' });
        }

        const updatedGarage = await Garages.findOne({ where: { garage_id } });
        res.status(200).json(updatedGarage);
    } catch (error) {
        console.error('Error updating garage:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getGaragesByCity = async (req, res) => {
    try {
        const { city } = req.params; // Utilise req.params au lieu de req.query
        const garages = await Garages.findAll({
            where: {
                garage_city: city 
            }
        });
        
        if (garages.length === 0) {
            return res.status(404).json({ message: 'No garages found in this city' });
        }
        
        res.status(200).json(garages);
    } catch (error) {
        console.error('Error fetching garages by city:', error);
        res.status(500).json({ error: error.message });
    }
};

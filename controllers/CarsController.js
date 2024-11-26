// @ts-nocheck
const { Cars, UsersClients } = require('../Models');

/**
 * Get all cars.
 */
exports.getAllCars = async (req, res) => {
    try {
        const cars = await Cars.findAll();
        res.status(200).json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get a specific car by ID.
 */
exports.getCar = async (req, res) => {
    try {
        const { car_id } = req.params;  // Change here to use req.params
        const car = await Cars.findOne({ where: { car_id } });
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error) {
        console.error('Error fetching car:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create a new car associated with a client.
 */
exports.createCar = async (req, res) => {
    try {
        const { car_marque, car_modele, car_year, car_license_plate } = req.body;
        const { client_id } = req.params;

        if (!car_marque || !car_modele || !car_year || !car_license_plate || !client_id) {
            console.error('Missing required fields');
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const client = await UsersClients.findOne({ where: { user_client_id: client_id } }); 
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const car = await Cars.create({
            car_marque,
            car_modele,
            car_year,
            car_license_plate,
            fk_client_id: client.user_client_id 
        });

        res.status(201).json(car);
    } catch (error) {
        console.error('Error creating car:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update an existing car by ID.
 */
exports.updateCar = async (req, res) => {
    try {
        const { car_id } = req.params; 
        const { car_marque, car_modele, car_year, car_license_plate} = req.body; 

        const [updated] = await Cars.update(
            { car_marque, car_modele, car_year, car_license_plate },
            { where: { car_id } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Récupérer la voiture mise à jour
        const updatedCar = await Cars.findOne({ where: { car_id } });
        res.status(200).json(updatedCar);
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ error: error.message });
    }
};


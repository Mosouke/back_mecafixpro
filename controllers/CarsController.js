const { Cars, Clients } = require('../Models');

exports.getCars = async (req, res) => {
    try {
        const cars = await Cars.findAll();
        res.status(200).json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCar = async (req, res) => {
    try {
        const { car_id } = req.params;
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

exports.createCar = async (req, res) => {
    try {
        const { car_marque, car_modele, car_year } = req.body;
        const { client_id } = req.params; 
        console.log(client_id);
        if (!car_marque || !car_modele || !car_year || !client_id) {
            console.error('Missing required fields');
            return res.status(400).json({ message: 'Missing required fields' });
            
        }

        const client = await Clients.findOne({ where: { client_id } });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const car = await Cars.create({
            car_marque,
            car_modele,
            car_year,
            fk_client_id: client.client_id 
        });

        res.status(201).json(car);
    } catch (error) {
        console.error('Error creating car:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.updateCar = async (req, res) => {
    try {
        const { car_id } = req.params;
        const { car_marque, car_modele, car_year, fk_client_id } = req.body;

        const client = await Clients.findOne({ where: { client_id: fk_client_id } });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const [updated] = await Cars.update(
            { car_marque, car_modele, car_year, fk_client_id },
            { where: { car_id } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }

        const updatedCar = await Cars.findOne({ where: { car_id } });
        res.status(200).json(updatedCar);
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ error: error.message });
    }
};

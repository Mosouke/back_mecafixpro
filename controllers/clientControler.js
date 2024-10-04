const { Clients, Users } = require('../Models');

exports.getClients = async (req, res) => {
    try {
        const clients = await Clients.findAll();
        res.status(200).json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

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

exports.createClient = async (req, res) => {
    
    try {
        const userEmail = req.user.mail_user;  
        if (!userEmail) {
            console.error('User not authenticated'); 
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { client_image_name, client_name, client_last_name, client_phone_number, client_address } = req.body;

        if (!client_image_name || !client_name || !client_last_name || !client_address) {
            console.error('Missing required fields'); 
            return res.status(400).json({ message: 'Missing required fields' });
        }

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


exports.updateClient = async (req, res) => {    
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

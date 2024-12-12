// @ts-nocheck
const Appointments = require('../Models/Appointments');
const { UsersClients, Garages, Services, SpecificServices } = require('../Models');


/**
 * @module controllers/appointmentController
 */

/**
 * Get all appointments.
 * 
 * @function getAllAppointments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing all appointments or an error message
 */
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointments.findAll();
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get an appointment by its ID.
 * 
 * @function getAppointmentById
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the appointment or an error message
 */
exports.getAppointmentById = async (req, res) => {
    try {
        const { appt_id } = req.params;
        if (!appt_id) {
            return res.status(400).json({ message: 'Appointment ID is missing' });
        }
        const appointment = await Appointments.findOne({ where: { appt_id } });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create a new appointment.
 * 
 * @function createAppointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the created appointment or an error message
 */
exports.createAppointment = async (req, res) => {
    try {
        const { appt_date_time, appt_comment, fk_garage_id, fk_service_id, fk_specific_service_id } = req.body;
        const appt_status = "En attente";

        if (!appt_date_time || !fk_garage_id || !fk_service_id || !fk_specific_service_id) {
            return res.status(400).json({ message: 'Champs obligatoires manquants' });
        }

        const { user_client_id, user_client_email, user_client_name } = req.user;

        const userExists = await UsersClients.findByPk(user_client_id);
        if (!userExists) {
            return res.status(400).json({ message: 'Utilisateur non trouvé dans la base de données' });
        }

        const garage = await Garages.findByPk(fk_garage_id);
        if (!garage) {
            return res.status(400).json({ message: 'Garage introuvable' });
        }

        const service = await Services.findByPk(fk_service_id);
        const specificService = await SpecificServices.findByPk(fk_specific_service_id);

        const appointment = await Appointments.create({
            appt_date_time,
            appt_status,
            appt_comment,
            fk_garage_id,
            fk_user_client_id: user_client_id,
            fk_service_id,
            fk_specific_service_id
        });

        await sendAppointmentConfirmationEmail(
            user_client_email,
            user_client_name,
            new Date(appt_date_time).toLocaleDateString(),
            new Date(appt_date_time).toLocaleTimeString(),
            appt_status,
            garage.garage_name,  
            service?.service_name,  
            specificService?.specific_service_name  
        );

        res.status(201).json(appointment);
    } catch (error) {
        console.error('Erreur lors de la création du rendez-vous:', error);
        res.status(500).json({ error: error.message });
    }
};




/**
 * Update an existing appointment.
 * 
 * @function updateAppointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing the updated appointment or an error message
 */
exports.updateAppointment = async (req, res) => {
    try {
        const { appt_id } = req.params;
        const { appt_date_time, appt_status, appt_comment, fk_garage_id, fk_client_id, fk_service_id, fk_specific_service_id } = req.body;

        if (!appt_date_time || !appt_status || !fk_garage_id || !fk_client_id || !fk_service_id || !fk_specific_service_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [updated] = await Appointments.update(
            {
                appt_date_time,
                appt_status,
                appt_comment,
                fk_garage_id,
                fk_client_id,
                fk_service_id,
                fk_specific_service_id
            },
            { where: { appt_id } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const updatedAppointment = await Appointments.findOne({ where: { appt_id } });
        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete an appointment by its ID.
 * 
 * @function deleteAppointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object indicating the appointment was deleted or an error message
 */
exports.deleteAppointment = async (req, res) => {
    try {
        const { appt_id } = req.params;
        const appointment = await Appointments.findOne({ where: { appt_id } });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        await Appointments.destroy({ where: { appt_id } });
        res.status(204).json({ message: 'Appointment deleted' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: error.message });
    }
};

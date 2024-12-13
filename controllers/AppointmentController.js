const Appointments = require('../Models/Appointments');
const { UsersClients, Garages, Services, SpecificServices } = require('../Models');
const { sendAppointmentConfirmationEmail } = require('../utils/emailService');

/**
 * @module controllers/appointmentController
 */

/**
 * Get all appointments.
 * 
 * This function retrieves all existing appointments from the database.
 * 
 * @function getAllAppointments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} res - Response object containing all appointments or an error message
 */
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointments.findAll();
        if (appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found' });
        }
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get an appointment by its ID.
 * 
 * This function retrieves a specific appointment by its ID.
 * 
 * @function getAppointmentById
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.appt_id - Appointment ID to retrieve
 * @returns {Object} res - Response object containing the appointment or an error message
 */
exports.getAppointmentById = async (req, res) => {
    try {
        const { appt_id } = req.params;

        // Check if the ID is valid
        if (!appt_id || isNaN(appt_id)) {
            return res.status(400).json({ message: 'Invalid appointment ID' });
        }

        const appointment = await Appointments.findOne({ where: { appt_id } });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Create a new appointment.
 * 
 * This function creates a new appointment, stores it in the database, and sends a confirmation email.
 * 
 * @function createAppointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.body.appt_date_time - Appointment date and time
 * @param {string} [req.body.appt_comment] - Optional comment for the appointment
 * @param {number} req.body.fk_garage_id - ID of the garage for the appointment
 * @param {number} req.body.fk_service_id - ID of the service selected for the appointment
 * @param {number} req.body.fk_specific_service_id - ID of the specific service selected
 * @returns {Object} res - Response object containing the created appointment or an error message
 */
exports.createAppointment = async (req, res) => {
    try {
        const { appt_date_time, appt_comment, fk_garage_id, fk_service_id, fk_specific_service_id } = req.body;
        const appt_status = "En Coure de traitement";

        // Check for missing required fields
        if (!appt_date_time || !fk_garage_id || !fk_service_id || !fk_specific_service_id) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const { user_client_id, mail_user_client} = req.user;

        // Verify if the user exists
        const userExists = await UsersClients.findByPk(user_client_id);
        if (!userExists) {
            return res.status(400).json({ message: 'User not found in the database' });
        }

        // Verify related entities (garage, service, specific service)
        const garage = await Garages.findByPk(fk_garage_id);
        if (!garage) {
            return res.status(400).json({ message: 'Garage not found' });
        }

        const service = await Services.findByPk(fk_service_id);
        if (!service) {
            return res.status(400).json({ message: 'Service not found' });
        }

        const specificService = await SpecificServices.findByPk(fk_specific_service_id);
        if (!specificService) {
            return res.status(400).json({ message: 'Specific service not found' });
        }

        // Create the appointment
        const appointment = await Appointments.create({
            appt_date_time,
            appt_status,
            appt_comment,
            fk_garage_id: garage.garage_id,
            fk_user_client_id: user_client_id,
            fk_service_id: service.service_id,
            fk_specific_service_id: specificService.specific_service_id
        });

        // Send the confirmation email
        await sendAppointmentConfirmationEmail(
            mail_user_client,
            userExists.user_client_name,
            new Date(appt_date_time).toLocaleDateString(),
            new Date(appt_date_time).toLocaleTimeString(),
            appt_status,
            garage.garage_name,
            service.service_name,
            specificService.specific_service_name
        );

        res.status(201).json({ message: 'Appointment successfully created', appointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update an existing appointment.
 * 
 * This function updates an existing appointment based on its ID.
 * 
 * @function updateAppointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.appt_id - Appointment ID to update
 * @param {string} req.body.appt_date_time - Updated appointment date and time
 * @param {string} req.body.appt_status - Updated appointment status
 * @param {string} [req.body.appt_comment] - Updated appointment comment
 * @param {number} req.body.fk_garage_id - Updated garage ID
 * @param {number} req.body.fk_client_id - Updated client ID
 * @param {number} req.body.fk_service_id - Updated service ID
 * @param {number} req.body.fk_specific_service_id - Updated specific service ID
 * @returns {Object} res - Response object containing the updated appointment or an error message
 */
exports.updateAppointment = async (req, res) => {
    try {
        const { appt_id } = req.params;
        const { appt_date_time, appt_status, appt_comment, fk_garage_id, fk_client_id, fk_service_id, fk_specific_service_id } = req.body;

        // Check for missing required fields
        if (!appt_date_time || !appt_status || !fk_garage_id || !fk_client_id || !fk_service_id || !fk_specific_service_id) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        // Verify if the appointment ID is valid
        if (!appt_id || isNaN(appt_id)) {
            return res.status(400).json({ message: 'Invalid appointment ID' });
        }

        // Update the appointment
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

        // Retrieve the updated appointment
        const updatedAppointment = await Appointments.findOne({ where: { appt_id } });
        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Delete an appointment by its ID.
 * 
 * This function deletes a specific appointment based on its ID.
 * 
 * @function deleteAppointment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.appt_id - Appointment ID to delete
 * @returns {Object} res - Response indicating the appointment was deleted or an error message
 */
exports.deleteAppointment = async (req, res) => {
    try {
        const { appt_id } = req.params;

        // Check for invalid appointment ID
        if (!appt_id || isNaN(appt_id)) {
            return res.status(400).json({ message: 'Invalid appointment ID' });
        }

        // Verify if the appointment exists
        const appointment = await Appointments.findOne({ where: { appt_id } });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Delete the appointment
        await Appointments.destroy({ where: { appt_id } });
        res.status(204).json({ message: 'Appointment deleted' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

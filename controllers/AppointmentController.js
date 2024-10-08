const Appointments = require('../Models/Appointments');

exports.getAllAppointments = async (req, res) => {
    try {
        const appointment = await Appointments.findAll();
        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: error.message });
    }
};

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


exports.createAppointment = async (req, res) => {
    try {
        const { appt_date, appt_time, appt_status, appt_comment, fk_garage_id, fk_client_id, fk_service_id, fk_specific_service_id } = req.body;

        if (!appt_date || !appt_time || !appt_status || !fk_garage_id || !fk_client_id || !fk_service_id || !fk_specific_service_id) {
            console.error('Missing required fields');
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const appointment = await Appointments.create({
            appt_date,
            appt_time,
            appt_status,
            appt_comment,
            fk_garage_id,
            fk_client_id,
            fk_service_id,
            fk_specific_service_id
        });

        res.status(201).json(appointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const { appt_id } = req.params;
        const { appt_date, appt_time, appt_status, appt_comment, fk_garage_id, fk_client_id, fk_service_id, fk_specific_service_id } = req.body;

        if (!appt_date || !appt_time || !appt_status || !fk_garage_id || !fk_client_id || !fk_service_id || !fk_specific_service_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [updated] = await Appointments.update(
            {
                appt_date,
                appt_time,
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
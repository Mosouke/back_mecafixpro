// @ts-nocheck
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/AppointmentController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

/**
 * @module routes/appointments
 */

/**
 * @route GET /appointments
 * @group Appointments - Operations about appointments
 * @security JWT
 * @returns {Array.<Appointment>} 200 - An array of appointments
 * @returns {Error}  default - Unexpected error
 */
router.get('/', authMiddleware, appointmentController.getAllAppointments);

/**
 * @route GET /appointments/{appt_id}
 * @param {number} appt_id.path.required - ID du rendez-vous
 * @group Appointments - Operations about appointments
 * @security JWT
 * @returns {Appointment} 200 - Un rendez-vous
 * @returns {Error}  default - Rendez-vous non trouvé
 */
router.get('/:appt_id', authMiddleware, appointmentController.getAppointmentById);

/**
 * @route POST /appointments/add
 * @group Appointments - Operations about appointments
 * @param {Appointment.model} Appointment.body.required - Rendez-vous à créer
 * @security JWT
 * @returns {Appointment} 201 - Rendez-vous créé
 * @returns {Error}  default - Unexpected error
 */
router.post('/add', authMiddleware, appointmentController.createAppointment);

/**
 * @route PUT /appointments/update/{appt_id}
 * @param {number} appt_id.path.required - ID du rendez-vous
 * @param {Appointment.model} Appointment.body.required - Rendez-vous à mettre à jour
 * @security JWT
 * @group Appointments - Operations about appointments
 * @returns {Appointment} 200 - Rendez-vous mis à jour
 * @returns {Error}  default - Rendez-vous non trouvé ou mise à jour échouée
 */
router.put('/update/:appt_id', authMiddleware, adminMiddleware, appointmentController.updateAppointment);

/**
 * @route DELETE /appointments/delete/{appt_id}
 * @param {number} appt_id.path.required - ID du rendez-vous
 * @group Appointments - Operations about appointments
 * @security JWT
 * @returns {Success} 204 - Rendez-vous supprimé
 * @returns {Error}  default - Rendez-vous non trouvé ou suppression échouée
 */
router.delete('/delete/:appt_id', authMiddleware, adminMiddleware, appointmentController.deleteAppointment);

module.exports = router;

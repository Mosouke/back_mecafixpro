const express = require('express');
const router = express.Router();
const appointementController = require('../controllers/AppointmentController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, appointementController.getAllAppointments);

router.get('/:appt_id',authMiddleware, appointementController.getAppointmentById);

router.post('/add', authMiddleware, appointementController.createAppointment);

router.put('/update/:appt_id', authMiddleware,adminMiddleware, appointementController.updateAppointment);

router.delete('/delete/:appt_id', authMiddleware, adminMiddleware, appointementController.deleteAppointment);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getUserAppointments,
  cancelAppointment,
  bookAppointment
} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserAppointments);
router.post('/', authMiddleware, bookAppointment);
router.delete('/:id', authMiddleware, cancelAppointment);

module.exports = router;
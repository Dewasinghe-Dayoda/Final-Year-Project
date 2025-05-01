const express = require('express');
const router = express.Router();
const { 
  getClinics, 
  bookAppointment,
  getClinicDetails 
} = require('../controllers/clinicController');
const authMiddleware = require('../middleware/authMiddleware');

// Corrected route - remove the wrapper function
router.get('/', authMiddleware, getClinics);

router.get('/:id', authMiddleware, getClinicDetails);
router.post('/book', authMiddleware, bookAppointment);

module.exports = router;
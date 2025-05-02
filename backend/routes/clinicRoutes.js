const express = require('express');
const router = express.Router();
const { 
  getClinics, 
  bookAppointment,
  getClinicDetails 
} = require('../controllers/clinicController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getClinics);
router.get('/:id', getClinicDetails);

module.exports = router;
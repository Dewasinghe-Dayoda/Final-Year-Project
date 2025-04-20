const express = require('express');
const router = express.Router();
const { getClinics, bookAppointment } = require('../controllers/clinicController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getClinics);
router.post('/book', authMiddleware, bookAppointment);

module.exports = router;
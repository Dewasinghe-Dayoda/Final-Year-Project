// const express = require('express');
// const router = express.Router();
// const {
//   getUserAppointments,
//   cancelAppointment,
//   bookAppointment
// } = require('../controllers/appointmentController');
// const authMiddleware = require('../middleware/authMiddleware');

// router.get('/', authMiddleware, getUserAppointments);
// router.post('/', authMiddleware, bookAppointment);
// router.delete('/:id', authMiddleware, cancelAppointment);

// module.exports = router;
// In your backend/routes/appointmentRoutes.js:
const express = require('express');
const router = express.Router();
const {
  getUserAppointments,
  cancelAppointment
} = require('../controllers/appointmentController');
const {
  bookAppointment
} = require('../controllers/clinicController'); // Import from clinicController
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserAppointments);
router.post('/', authMiddleware, bookAppointment); // Add this route
router.delete('/:id', authMiddleware, cancelAppointment);

module.exports = router;
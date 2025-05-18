const express = require('express');
const router = express.Router();
const { 
  getClinics, 
  getClinicDetails 
} = require('../controllers/clinicController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware,getClinics);
router.get('/:id',authMiddleware,getClinicDetails);

module.exports = router;
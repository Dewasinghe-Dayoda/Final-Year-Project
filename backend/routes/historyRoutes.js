// backend/routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const { getUserHistory } = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure user is authenticated

// Fetch user history
router.get('/', authMiddleware, getUserHistory);

module.exports = router;
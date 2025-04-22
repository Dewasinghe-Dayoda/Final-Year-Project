const express = require('express');
const { 
    registerUser, 
    loginUser,
    getUserProfile 
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', authMiddleware, getUserProfile);

module.exports = router;
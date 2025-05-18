const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');

// Registration function
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create token with longer expiry for testing
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '24h' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Login function
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '24h' });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
    
    const user = await User.findOne({ email });
    //login notification
    await createNotification(
  user._id, 
  'system', 
  'Login Successful', 
  `You logged in successfully at ${new Date().toLocaleString()}`
);
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        console.log('Fetching profile for user ID:', req.user.id);
        
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile 
};
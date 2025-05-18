// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     try {
//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         req.user = { id: decoded.id };  // Ensure consistent structure
//         console.log('Authenticated user ID:', req.user.id); // Debug log
//         next();
//     } catch (err) {
//         console.error('Token verification error:', err);
//         res.status(401).json({ message: 'Token is not valid' });
//     }
// };

// module.exports = authMiddleware;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authMiddleware = async (req, res, next) => {
    // 1. Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        console.error('Authorization failed: No token provided');
        return res.status(401).json({ 
            success: false,
            message: 'Authorization denied: No token provided' 
        });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        
        // 3. Validate the user ID format
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
            console.error('Invalid user ID format in token:', decoded.id);
            return res.status(401).json({
                success: false,
                message: 'Invalid user identification'
            });
        }

        // 4. Attach user to request
        req.user = { 
            id: decoded.id,
            // Add other user fields if needed
        };
        
        console.log(`Authenticated user: ${decoded.id}`);
        next();
    } catch (err) {
        console.error('Authentication error:', {
            error: err.message,
            token: token.slice(0, 10) + '...', // Log first 10 chars of token for debugging
            time: new Date().toISOString()
        });

        // Different error messages based on error type
        const message = err.name === 'JsonWebTokenError' 
            ? 'Invalid token' 
            : err.name === 'TokenExpiredError'
                ? 'Token expired'
                : 'Authorization failed';

        res.status(401).json({ 
            success: false,
            message 
        });
    }
};

module.exports = authMiddleware;
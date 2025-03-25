const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { verifyToken };
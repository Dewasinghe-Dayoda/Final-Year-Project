const History = require('../models/History');

// Save prediction history
const saveHistory = async (userId, imagePath, prediction, confidence) => {
    const history = new History({
        userId,
        imagePath,
        prediction,
        confidence,
    });
    await history.save();
};

// Fetch user history
const getUserHistory = async (req, res) => {
    try {
        const history = await History.find({ userId: req.user.id }).sort({ date: -1 }); // Fetch history sorted by date
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

module.exports = { 
    saveHistory, 
    getUserHistory 
};
const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imagePath: { type: String, required: true },
    prediction: { type: String, required: true },
    confidence: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('History', HistorySchema);
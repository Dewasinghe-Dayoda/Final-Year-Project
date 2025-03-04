const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const predictRoutes = require('./routes/predictRoutes')
const historyRoutes = require('./routes/historyRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/predict',predictRoutes);
app.use('/api/history',historyRoutes)

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('Welcome to the Skin Disease Awareness API!');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
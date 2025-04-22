const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const predictRoutes = require('./routes/predictRoutes');
const historyRoutes = require('./routes/historyRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const clinicRoutes = require('./routes/clinicRoutes');

const app = express();

// Enhanced CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/clinics', clinicRoutes);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('Welcome to the Skin Disease Awareness API!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
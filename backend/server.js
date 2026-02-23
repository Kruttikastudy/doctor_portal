import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import visitRoutes from './routes/visitRoutes.js';
import icdRoutes from './routes/icdRoutes.js';

console.log('DEBUG: NODE_ENV =', process.env.NODE_ENV);
console.log('DEBUG: MONGO_URI is set =', !!process.env.MONGO_URI);
if (process.env.MONGO_URI) {
    console.log('DEBUG: MONGO_URI (redacted) =', process.env.MONGO_URI.substring(0, 20) + '...');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor_portal';

mongoose.connect(MONGO_URI, {
    dbName: 'emrdb'
})
    .then(() => {
        console.log('✅ MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('Please ensure your MongoDB service is running on 127.0.0.1:27017');
        // Optional: Stay alive or exit. Leaving it to exit for clarity.
        process.exit(1);
    });

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/icd', icdRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

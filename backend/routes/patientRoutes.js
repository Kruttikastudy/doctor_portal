import express from 'express';
import Patient from '../models/Patient.js';

const router = express.Router();

// Get all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new patient
router.post('/', async (req, res) => {
    const patient = new Patient(req.body);
    try {
        const newPatient = await patient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
    try {
        console.log(`GET /api/patients/${req.params.id} - Searching...`);
        console.log(`DEBUG: Model Name: ${Patient.modelName}`);
        console.log(`DEBUG: Collection Name: ${Patient.collection.name}`);
        console.log(`DEBUG: Database Name: ${Patient.db.name}`);

        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            console.warn(`GET /api/patients/${req.params.id} - NOT FOUND`);
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (err) {
        console.error(`GET /api/patients/${req.params.id} - ERROR:`, err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;

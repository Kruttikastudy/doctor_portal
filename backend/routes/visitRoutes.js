import express from 'express';
import Visit from '../models/Visit.js';

const router = express.Router();

// Get all visits for a patient, sorted by latest first
router.get('/:patientId', async (req, res) => {
    try {
        const visits = await Visit.find({ patient_id: req.params.patientId })
            .sort({ createdAt: -1 });
        res.json(visits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new visit
router.post('/', async (req, res) => {
    try {
        const visitData = {
            ...req.body,
            date: req.body.date || new Date().toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: '4-digit'
            }).replace(/\//g, '-')
        };
        const visit = new Visit(visitData);
        const newVisit = await visit.save();
        res.status(201).json(newVisit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;

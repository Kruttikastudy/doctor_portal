import mongoose from 'mongoose';
import Appointment from './models/Appointment.js';
import Patient from './models/Patient.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function debug() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const appts = await Appointment.find().lean();
        const patients = await Patient.find().lean();

        const out = {
            appointments: appts.map(a => ({ id: a._id, name: a.patient_name, pid: a.patient_id })),
            patients: patients.map(p => ({ id: p._id, name: p.name }))
        };

        fs.writeFileSync('debug_out.json', JSON.stringify(out, null, 2));
        console.log('Done');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
debug();

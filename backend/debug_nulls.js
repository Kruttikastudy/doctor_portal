import mongoose from 'mongoose';
import Appointment from './models/Appointment.js';
import dotenv from 'dotenv';

dotenv.config();

async function debug() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'emrdb' });
        const appts = await Appointment.find({
            $or: [
                { patient_id: "null" },
                { patient_id: "undefined" },
                { patient_id: "" },
                { patient_id: "N/A" }
            ]
        }).lean();

        console.log(`Found ${appts.length} appointments with string-null/empty patient_id`);
        appts.forEach(a => console.log(`ID: ${a._id}, PID Value: "${a.patient_id}"`));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
debug();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const targetId = "697cbea6b3aa281cef71d5b1";
const dbs = ['emrdb', 'doctor_portal', 'test'];

async function search() {
    for (const dbName of dbs) {
        console.log(`\nSearching in DB: ${dbName}...`);
        try {
            const conn = await mongoose.createConnection(process.env.MONGO_URI, { dbName }).asPromise();
            const Patient = conn.model('Patient', new mongoose.Schema({}, { strict: false }), 'patients');
            const appointment = conn.model('Appointment', new mongoose.Schema({}, { strict: false }), 'appointments');

            const p = await Patient.findById(targetId);
            if (p) {
                console.log(`FOUND Patient in ${dbName}:`, p);
            } else {
                console.log(`Patient NOT FOUND in ${dbName}`);
            }

            const a = await appointment.findOne({ patient_id: targetId });
            if (a) {
                console.log(`Found Appointment pointing to this ID in ${dbName}`);
            }

            await conn.close();
        } catch (err) {
            console.error(`Error in ${dbName}:`, err.message);
        }
    }
    process.exit();
}
search();


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor_portal';
const PID = '697cbea6b3aa281cef71d5b1';

async function dumpPatient() {
    try {
        console.log(`Connecting to: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI, { dbName: 'emrdb' });
        console.log('Connected to emrdb');

        const db = mongoose.connection.db;
        const patient = await db.collection('patients').findOne({ _id: new mongoose.Types.ObjectId(PID) });

        console.log(`\nPatient Data for ${PID}:`);
        console.log(JSON.stringify(patient, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

dumpPatient();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const targetId = "697cbea6b3aa281cef71d5b1";

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'emrdb' });
        const Patient = mongoose.model('Patient', new mongoose.Schema({}), 'patients');
        const Appointment = mongoose.model('Appointment', new mongoose.Schema({}), 'appointments');

        const p = await Patient.findById(targetId);
        const a = await Appointment.findById(targetId);

        console.log(`CHECK_RESULT: PatientFound=${!!p}, AppointmentFound=${!!a}`);

        if (a) {
            console.log("WAIT! The ID is actually an APPOINTMENT ID.");
            console.log("Appointment detail:", JSON.stringify(a, null, 2));
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function dump() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'emrdb' });
        const Patient = mongoose.model('Patient', new mongoose.Schema({}), 'patients');
        const patients = await Patient.find({}, { _id: 1, name: 1 }).lean();

        console.log(`Found ${patients.length} patients in emrdb:`);
        patients.forEach(p => {
            console.log(`ID: ${p._id}, Name: ${JSON.stringify(p.name)}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
dump();

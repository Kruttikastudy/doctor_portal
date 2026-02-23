import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const targetId = "697cbea6b3aa281cef71d5b1";

async function run() {
    const conn = await mongoose.createConnection(process.env.MONGO_URI, { dbName: 'emrdb' }).asPromise();
    console.log("Connected to:", conn.name);

    const collections = await conn.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    const Patient = conn.model('Patient', new mongoose.Schema({}, { strict: false }), 'patients');
    const p = await Patient.findById(targetId);
    console.log("Patient by ID:", p ? "FOUND" : "NOT FOUND");

    const p2 = await Patient.findOne({ _id: new mongoose.Types.ObjectId(targetId) });
    console.log("Patient by explicit ObjectId:", p2 ? "FOUND" : "NOT FOUND");

    const PatientSingular = conn.model('PatientSingular', new mongoose.Schema({}, { strict: false }), 'patient');
    const ps = await PatientSingular.findById(targetId);
    console.log("Patient in 'patient' collection:", ps ? "FOUND" : "NOT FOUND");

    await conn.close();
    process.exit();
}
run();

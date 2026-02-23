import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const targetId = "697cbea6b3aa281cef71d5b1";

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'emrdb' });
        const Patient = mongoose.model('Patient', new mongoose.Schema({}), 'patients');
        const p = await Patient.findById(targetId);

        if (p) {
            console.log("EXACT_CHECK_RESULT: FOUND");
        } else {
            console.log("EXACT_CHECK_RESULT: NOT_FOUND");
            // List first 5 just to be sure we are in the right place
            const first5 = await Patient.find({}).limit(5).lean();
            console.log("First 5 IDs in this DB:");
            first5.forEach(x => console.log(x._id));
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function test() {
    try {
        await mongoose.connect(MONGO_URI, { dbName: 'emrdb' });

        const patient = await mongoose.connection.db.collection('patients').findOne();
        const appointment = await mongoose.connection.db.collection('appointments').findOne();

        const output = {
            patient,
            appointment
        };

        fs.writeFileSync('schema_debug.json', JSON.stringify(output, null, 2));
        console.log('✅ schema_debug.json created');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();

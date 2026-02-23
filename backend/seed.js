import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './models/Patient.js';
import Appointment from './models/Appointment.js';
import { patients as mockPatients, appointments as mockAppointments } from '../src/data/mockData.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor_portal';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Patient.deleteMany({});
        await Appointment.deleteMany({});
        console.log('Cleared existing data.');

        // Seed Patients
        const patientMap = {}; // Map mock ID to Mongo ID for appointments

        for (const p of mockPatients) {
            const nameParts = p.name.split(' ');
            const newPatient = new Patient({
                name: {
                    first: nameParts[0],
                    last: nameParts[nameParts.length - 1]
                },
                date_of_birth: p.dob || '01-01-1990',
                gender: p.gender || 'Other',
                blood_group: 'None',
                address: {
                    city: 'Unknown',
                    postal_code: '000000',
                    district: 'Unknown',
                    state: 'Unknown',
                    country: 'India'
                },
                aadhaar: '000000000000', // Placeholder
                contact_info: {
                    mobile: {
                        code: '+91',
                        number: p.contact.replace('+91 ', '').replace(/\s/g, '')
                    },
                    email: p.email
                },
                status: p.status || 'Active'
            });
            const savedPatient = await newPatient.save();
            patientMap[p.id] = savedPatient._id;
        }
        console.log(`Seeded ${mockPatients.length} patients.`);

        // Seed Appointments
        for (const a of mockAppointments) {
            const nameParts = a.patientName.split(' ');
            const newAppointment = new Appointment({
                patient_name: {
                    first: nameParts[0],
                    last: nameParts[nameParts.length - 1]
                },
                patient_id: patientMap[a.patientId] || null,
                age: 30, // Default
                contact_information: '0000000000',
                appointment_date: a.date,
                appointment_time: a.time,
                appointment_type: 'Routine Check-up',
                reason_for_appointment: a.reason,
                status: a.status || 'Pending'
            });
            await newAppointment.save();
        }
        console.log(`Seeded ${mockAppointments.length} appointments.`);

        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDatabase();

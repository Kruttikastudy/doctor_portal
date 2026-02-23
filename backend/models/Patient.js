import mongoose from "mongoose";
const { Schema } = mongoose;

const patientSchema = new Schema({
    patient_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: {
            first: { type: String, required: true },
            middle: { type: String },
            last: { type: String, required: true }
        },
        required: true
    },
    age: {
        type: Number
    },
    date_of_birth: {
        type: String
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    marital_status: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed']
    },
    blood_group: {
        type: String,
        required: true
    },
    address: {
        type: {
            street: { type: String },
            city: { type: String, required: true },
            postal_code: { type: String, required: true },
            district: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true }
        },
        required: true
    },
    contact_info: {
        type: {
            mobile: {
                type: {
                    code: { type: String, required: true },
                    number: { type: String, required: true }
                },
                required: true
            },
            email: {
                type: String,
                required: true
            }
        },
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    social_history: {
        alcohol_use: {
            current_status: String,
            frequency: String,
            amount: String
        },
        tobacco_smoking: {
            current_status: String,
            frequency: String,
            amount: String
        },
        tobacco_consumption: {
            current_status: String,
            frequency: String,
            amount: String
        },
        physical_activity: {
            frequency: String,
            intensity: String
        },
        stress: {
            perceived_stress_level: String,
            stressors: [String]
        },
        domestic_violence_exposure: {
            exposure: String,
            notes: String
        }
    }
}, { timestamps: true });

export default mongoose.models.Patient || mongoose.model('Patient', patientSchema);

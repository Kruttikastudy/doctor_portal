import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient_name: {
        type: {
            first: { type: String, required: true },
            middle: { type: String, default: null },
            last: { type: String, required: true }
        },
        required: true
    },
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null
    },
    age: {
        type: Number,
        required: true
    },
    contact_information: {
        type: String,
        required: true
    },
    appointment_date: {
        type: String,
        required: true
    },
    appointment_time: {
        type: String,
        required: true
    },
    appointment_type: {
        type: String
    },
    urgency: {
        type: String,
        enum: ['No', 'Yes']
    },
    doctor: {
        type: String
    },
    comments: {
        type: String,
        default: null
    }
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

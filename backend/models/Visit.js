import mongoose from "mongoose";
const { Schema } = mongoose;

const visitSchema = new Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    visit_type: { type: String, required: true },
    chief_complaints: { type: String },
    vitals: {
        height: String,
        weight: String,
        bp: String,
        rr: String,
        oxygen: String,
        temp: String,
        pulse: String
    },
    diagnosis: {
        condition: String,
        icdCode: String,
        treatment: String
    },
    medications: [{
        medicine: String,
        dosage: String,
        doseTime: String,
        frequency: String,
        duration: String,
        status: { type: String, enum: ['Active', 'Discontinued'], default: 'Active' },
        problem: String
    }],
    seen_by: { type: String },
    follow_up: { type: String },
    costs: {
        total: Number,
        paid: Number,
        balance: Number
    },
    date: { type: String } // Storing searchable date string like appointments
}, { timestamps: true });

export default mongoose.models.Visit || mongoose.model('Visit', visitSchema);

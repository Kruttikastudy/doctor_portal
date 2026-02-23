import mongoose from "mongoose";
const { Schema } = mongoose;

const patientSchema = new Schema({
  name: {
    type: {
      first: { type: String, required: true },
      middle: { type: String },
      last: { type: String, required: true }
    },
    required: true
  },

  date_of_birth: {
    type: String,
    required: true,
    match: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/
  },

  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },

  blood_group: {
    type: String,
    required: true,
    enum: [
      'A Positive (A⁺)', 'A Negative (A⁻)',
      'B Positive (B⁺)', 'B Negative (B⁻)',
      'AB Positive (AB⁺)', 'AB Negative (AB⁻)',
      'O Positive (O⁺)', 'O Negative (O⁻)',
      'None'
    ]
  },

  address: {
    type: {
      street: { type: String },
      street2: { type: String },
      city: { type: String, required: true },
      postal_code: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true }
    },
    required: true
  },

  occupation: {
    type: String,
    enum: [
      'Unemployed', 'Employed', 'Student', 'Business',
      'Services', 'Retired', 'Government /civil service', 'Other'
    ]
  },

  aadhaar: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    match: [/^[0-9]{12}$/, 'Aadhaar number must be exactly 12 digits']
  },

  pan: {
    type: String,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN card format'],
    index: {
      unique: true,
      partialFilterExpression: { pan: { $type: "string" } }
    }
  },

  contact_info: {
    type: {
      mobile: {
        type: {
          code: { type: String, required: true, match: /^\+\d{1,3}$/ },
          number: { type: String, required: true, match: /^\d{7,10}$/ }
        },
        required: true
      },
      email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      }
    },
    required: true
  },

  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

export default mongoose.models.Patient || mongoose.model('Patient', patientSchema);

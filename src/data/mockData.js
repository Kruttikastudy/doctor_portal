export const patients = [
  {
    id: 'P001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@email.com',
    contact: '+91 98765 43210',
    gender: 'Male',
    dob: '1990-05-14',
    status: 'Active',
    isActive: true,
    allergies: 'Penicillin',
    socialHistory: 'Non-smoker',
  },
  {
    id: 'P002',
    name: 'Priya Mehta',
    email: 'priya.mehta@email.com',
    contact: '+91 87654 32109',
    gender: 'Female',
    dob: '1985-11-22',
    status: 'Active',
    isActive: true,
    allergies: 'None',
    socialHistory: 'Occasional drinker',
  },
  {
    id: 'P003',
    name: 'Rohit Patel',
    email: 'rohit.patel@email.com',
    contact: '+91 76543 21098',
    gender: 'Male',
    dob: '1978-03-07',
    status: 'Inactive',
    isActive: false,
    allergies: 'Sulfa drugs',
    socialHistory: 'Smoker',
  },
  {
    id: 'P004',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@email.com',
    contact: '+91 65432 10987',
    gender: 'Female',
    dob: '1995-08-30',
    status: 'Active',
    isActive: true,
    allergies: 'Aspirin',
    socialHistory: 'Non-smoker',
  },
  {
    id: 'P005',
    name: 'Karan Gupta',
    email: 'karan.gupta@email.com',
    contact: '+91 54321 09876',
    gender: 'Male',
    dob: '2000-01-15',
    status: 'Active',
    isActive: true,
    allergies: 'None',
    socialHistory: 'Student, non-smoker',
  },
];

export const appointments = [
  {
    id: 'APT001',
    patientId: 'P001',
    patientName: 'Aarav Sharma',
    date: '2026-02-20',
    time: '09:30 AM',
    reason: 'Chest pain & shortness of breath',
    status: 'Pending',
    specialty: 'Cardiology',
  },
  {
    id: 'APT002',
    patientId: 'P002',
    patientName: 'Priya Mehta',
    date: '2026-02-20',
    time: '10:15 AM',
    reason: 'Annual health checkup',
    status: 'Completed',
    specialty: 'General',
  },
  {
    id: 'APT003',
    patientId: 'P003',
    patientName: 'Rohit Patel',
    date: '2026-02-20',
    time: '11:00 AM',
    reason: 'Back pain follow-up',
    status: 'Pending',
    specialty: 'Orthopedics',
  },
  {
    id: 'APT004',
    patientId: 'P004',
    patientName: 'Sneha Iyer',
    date: '2026-02-20',
    time: '12:00 PM',
    reason: 'Allergy consultation',
    status: 'Cancelled',
    specialty: 'Allergy',
  },
  {
    id: 'APT005',
    patientId: 'P005',
    patientName: 'Karan Gupta',
    date: '2026-02-20',
    time: '02:30 PM',
    reason: 'Skin rash evaluation',
    status: 'Pending',
    specialty: 'Dermatology',
  },
  {
    id: 'APT006',
    patientId: 'P001',
    patientName: 'Aarav Sharma',
    date: '2026-02-21',
    time: '09:00 AM',
    reason: 'ECG follow-up',
    status: 'Pending',
    specialty: 'Cardiology',
  },
  {
    id: 'APT007',
    patientId: 'P002',
    patientName: 'Priya Mehta',
    date: '2026-02-21',
    time: '03:00 PM',
    reason: 'Blood pressure review',
    status: 'Cancelled',
    specialty: 'General',
  },
  {
    id: 'APT008',
    patientId: 'P004',
    patientName: 'Sneha Iyer',
    date: '2026-02-22',
    time: '10:00 AM',
    reason: 'Asthma management',
    status: 'Pending',
    specialty: 'Pulmonology',
  },
];

export const visitHistory = {
  P001: [
    {
      id: 'V001',
      doctorName: 'Dr. Rajesh Kumar',
      doctorId: 'D001',
      type: 'Cardiology',
      clinicalNotes: 'Patient experiencing chest pain. ECG ordered. Started on beta-blockers.',
      date: '2026-01-15',
    },
    {
      id: 'V002',
      doctorName: 'Dr. Anita Singh',
      doctorId: 'D002',
      type: 'General',
      clinicalNotes: 'Routine checkup. Blood pressure elevated at 145/90. Diet modifications recommended.',
      date: '2025-12-10',
    },
    {
      id: 'V003',
      doctorName: 'Dr. Rajesh Kumar',
      doctorId: 'D001',
      type: 'Cardiology',
      clinicalNotes: 'Follow-up for chest pain. Symptoms improved. Continue current medication.',
      date: '2025-11-22',
    },
    {
      id: 'V004',
      doctorName: 'Dr. Preethi Nair',
      doctorId: 'D003',
      type: 'General',
      clinicalNotes: 'Annual wellness visit. Lab tests ordered. BMI 27.2.',
      date: '2025-10-05',
    },
  ],
  P002: [
    {
      id: 'V005',
      doctorName: 'Dr. Anita Singh',
      doctorId: 'D002',
      type: 'General',
      clinicalNotes: 'Headache and fatigue complaints. Prescribed rest and hydration.',
      date: '2026-01-25',
    },
    {
      id: 'V006',
      doctorName: 'Dr. Preethi Nair',
      doctorId: 'D003',
      type: 'Internal Medicine',
      clinicalNotes: 'Vitamin D deficiency detected. Supplements prescribed.',
      date: '2025-12-05',
    },
    {
      id: 'V007',
      doctorName: 'Dr. Anita Singh',
      doctorId: 'D002',
      type: 'General',
      clinicalNotes: 'Mild flu. Rest and antivirals prescribed.',
      date: '2025-11-12',
    },
  ],
  P003: [
    {
      id: 'V008',
      doctorName: 'Dr. Suresh Mehta',
      doctorId: 'D004',
      type: 'Orthopedics',
      clinicalNotes: 'Lumbar back pain. Physiotherapy recommended. NSAIDs prescribed.',
      date: '2026-01-30',
    },
    {
      id: 'V009',
      doctorName: 'Dr. Suresh Mehta',
      doctorId: 'D004',
      type: 'Orthopedics',
      clinicalNotes: 'Surgery site healing well. Continue PT for 4 more weeks.',
      date: '2025-12-15',
    },
    {
      id: 'V010',
      doctorName: 'Dr. Preethi Nair',
      doctorId: 'D003',
      type: 'General',
      clinicalNotes: 'Pre-op assessment for lumbar surgery. All vitals normal.',
      date: '2025-11-01',
    },
  ],
  P004: [
    {
      id: 'V011',
      doctorName: 'Dr. Leena Kapoor',
      doctorId: 'D005',
      type: 'Allergy',
      clinicalNotes: 'Seasonal allergic rhinitis. Antihistamines prescribed.',
      date: '2026-02-01',
    },
    {
      id: 'V012',
      doctorName: 'Dr. Leena Kapoor',
      doctorId: 'D005',
      type: 'Allergy',
      clinicalNotes: 'Aspirin allergy confirmed. NSAID alternatives prescribed.',
      date: '2025-12-20',
    },
    {
      id: 'V013',
      doctorName: 'Dr. Anita Singh',
      doctorId: 'D002',
      type: 'General',
      clinicalNotes: 'Routine checkup. All vitals normal. Vaccines up to date.',
      date: '2025-11-18',
    },
  ],
  P005: [
    {
      id: 'V014',
      doctorName: 'Dr. Ravi Shankar',
      doctorId: 'D006',
      type: 'Dermatology',
      clinicalNotes: 'Contact dermatitis. Topical corticosteroids prescribed.',
      date: '2026-02-05',
    },
    {
      id: 'V015',
      doctorName: 'Dr. Ravi Shankar',
      doctorId: 'D006',
      type: 'Dermatology',
      clinicalNotes: 'Eczema flare. Moisturizer and mild steroid cream prescribed.',
      date: '2025-12-28',
    },
    {
      id: 'V016',
      doctorName: 'Dr. Anita Singh',
      doctorId: 'D002',
      type: 'General',
      clinicalNotes: 'Seasonal allergies. Cetirizine prescribed.',
      date: '2025-11-10',
    },
  ],
};

export const medicalHistory = {
  P001: {
    medical: [
      { condition: 'Hypertension', diagnosisDate: '2020-03-10', treatingPhysician: 'Dr. Rajesh Kumar', currentStatus: 'Ongoing' },
      { condition: 'Type 2 Diabetes', diagnosisDate: '2021-07-22', treatingPhysician: 'Dr. Anita Singh', currentStatus: 'Managed' },
    ],
    surgical: [
      { surgeryType: 'Appendectomy', surgeryDate: '2015-06-15', surgeonName: 'Dr. Suresh Mehta', currentStatus: 'Recovered' },
    ],
    immunization: [
      { vaccineName: 'COVID-19 (Covaxin)', vaccineDate: '2021-04-10', physicianName: 'Dr. Anita Singh', currentStatus: 'Complete' },
      { vaccineName: 'Influenza', vaccineDate: '2025-09-01', physicianName: 'Dr. Preethi Nair', currentStatus: 'Complete' },
    ],
    family: [
      { name: 'Ramesh Sharma', gender: 'Male', relationship: 'Father', medicalCondition: 'Hypertension, Diabetes' },
      { name: 'Sunita Sharma', gender: 'Female', relationship: 'Mother', medicalCondition: 'Hypothyroidism' },
    ],
  },
  P002: {
    medical: [
      { condition: 'Migraine', diagnosisDate: '2018-11-05', treatingPhysician: 'Dr. Anita Singh', currentStatus: 'Ongoing' },
    ],
    surgical: [],
    immunization: [
      { vaccineName: 'Hepatitis B', vaccineDate: '2019-03-15', physicianName: 'Dr. Preethi Nair', currentStatus: 'Complete' },
    ],
    family: [
      { name: 'Suresh Mehta', gender: 'Male', relationship: 'Father', medicalCondition: 'Cardiac disease' },
    ],
  },
  P003: {
    medical: [
      { condition: 'Chronic Back Pain', diagnosisDate: '2019-08-20', treatingPhysician: 'Dr. Suresh Mehta', currentStatus: 'Ongoing' },
    ],
    surgical: [
      { surgeryType: 'Lumbar Disc Surgery', surgeryDate: '2025-11-15', surgeonName: 'Dr. Suresh Mehta', currentStatus: 'Recovery' },
    ],
    immunization: [
      { vaccineName: 'Tetanus', vaccineDate: '2022-07-04', physicianName: 'Dr. Anita Singh', currentStatus: 'Complete' },
    ],
    family: [
      { name: 'Girish Patel', gender: 'Male', relationship: 'Father', medicalCondition: 'Arthritis' },
    ],
  },
  P004: {
    medical: [
      { condition: 'Allergic Rhinitis', diagnosisDate: '2017-04-12', treatingPhysician: 'Dr. Leena Kapoor', currentStatus: 'Ongoing' },
      { condition: 'Asthma (Mild)', diagnosisDate: '2020-09-30', treatingPhysician: 'Dr. Leena Kapoor', currentStatus: 'Managed' },
    ],
    surgical: [],
    immunization: [
      { vaccineName: 'COVID-19 (Covishield)', vaccineDate: '2021-05-20', physicianName: 'Dr. Anita Singh', currentStatus: 'Complete' },
      { vaccineName: 'MMR', vaccineDate: '2023-06-15', physicianName: 'Dr. Preethi Nair', currentStatus: 'Complete' },
    ],
    family: [
      { name: 'Radha Iyer', gender: 'Female', relationship: 'Mother', medicalCondition: 'Asthma' },
      { name: 'Venkat Iyer', gender: 'Male', relationship: 'Father', medicalCondition: 'None' },
    ],
  },
  P005: {
    medical: [
      { condition: 'Eczema', diagnosisDate: '2022-02-14', treatingPhysician: 'Dr. Ravi Shankar', currentStatus: 'Ongoing' },
    ],
    surgical: [],
    immunization: [
      { vaccineName: 'COVID-19 (Covaxin)', vaccineDate: '2021-06-05', physicianName: 'Dr. Anita Singh', currentStatus: 'Complete' },
    ],
    family: [
      { name: 'Anil Gupta', gender: 'Male', relationship: 'Father', medicalCondition: 'None' },
      { name: 'Kavita Gupta', gender: 'Female', relationship: 'Mother', medicalCondition: 'Eczema' },
    ],
  },
};

export const medications = {
  P001: {
    active: [
      { problem: 'Hypertension', medicine: 'Amlodipine', mg: '5mg', doseTime: 'Once daily', timePeriod: 'Ongoing' },
      { problem: 'Diabetes', medicine: 'Metformin', mg: '500mg', doseTime: 'Twice daily', timePeriod: 'Ongoing' },
    ],
    discontinued: [
      { problem: 'Chest pain', medicine: 'Atenolol', mg: '25mg', doseTime: 'Once daily', timePeriod: '6 months' },
    ],
  },
  P002: {
    active: [
      { problem: 'Migraine', medicine: 'Sumatriptan', mg: '50mg', doseTime: 'As needed', timePeriod: 'Ongoing' },
    ],
    discontinued: [
      { problem: 'Vitamin D deficiency', medicine: 'Cholecalciferol', mg: '60000 IU', doseTime: 'Weekly', timePeriod: '3 months' },
    ],
  },
  P003: {
    active: [
      { problem: 'Back pain', medicine: 'Diclofenac', mg: '75mg', doseTime: 'Twice daily', timePeriod: '4 weeks' },
      { problem: 'Post-surgery', medicine: 'Pregabalin', mg: '75mg', doseTime: 'Every 12 hours', timePeriod: '8 weeks' },
    ],
    discontinued: [
      { problem: 'Back pain', medicine: 'Ibuprofen', mg: '400mg', doseTime: 'Every 8 hours', timePeriod: '30 days' },
    ],
  },
  P004: {
    active: [
      { problem: 'Allergic rhinitis', medicine: 'Cetirizine', mg: '10mg', doseTime: 'Once daily', timePeriod: 'Seasonal' },
      { problem: 'Asthma', medicine: 'Salbutamol inhaler', mg: '100mcg', doseTime: 'As needed', timePeriod: 'Ongoing' },
    ],
    discontinued: [
      { problem: 'Chest infections', medicine: 'Amoxicillin', mg: '500mg', doseTime: 'Every 8 hours', timePeriod: '10 days' },
    ],
  },
  P005: {
    active: [
      { problem: 'Eczema', medicine: 'Hydrocortisone cream', mg: '1%', doseTime: 'Twice daily', timePeriod: '2 weeks' },
    ],
    discontinued: [
      { problem: 'Seasonal allergy', medicine: 'Loratadine', mg: '10mg', doseTime: 'Once daily', timePeriod: '4 weeks' },
    ],
  },
};

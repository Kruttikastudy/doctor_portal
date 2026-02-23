import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddPatient.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AddPatient() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patient_id: '',
        name: { first: '', middle: '', last: '' },
        age: '',
        contact_information: '',
        appointment: {
            date: '',
            time: '',
            type: 'Follow-up',
            reason: 'Regular',
            urgency: 'No',
            doctor: 'Dr. Ram Shah',
            notes: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('appointment.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                appointment: { ...prev.appointment, [field]: value }
            }));
        } else if (name.startsWith('name.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                name: { ...prev.name, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Create Patient
            const patientData = {
                patient_id: formData.patient_id,
                name: formData.name,
                age: formData.age,
                contact_info: {
                    mobile: { code: '+91', number: formData.contact_information },
                    email: 'managed@emr.com' // placeholder since it's not in screenshot
                },
                address: {
                    city: 'Not Provided',
                    postal_code: '000000',
                    district: 'Not Provided',
                    state: 'Not Provided',
                    country: 'India'
                }
            };

            const pRes = await fetch(`${API_URL}/patients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientData)
            });

            const newPatient = await pRes.json();
            if (!pRes.ok) throw new Error(newPatient.message || 'Failed to create patient');

            // 2. Create Appointment
            const appointmentData = {
                patient_id: newPatient._id,
                patient_name: formData.name,
                age: Number(formData.age),
                contact_information: formData.contact_information,
                appointment_date: formData.appointment.date,
                appointment_time: formData.appointment.time,
                appointment_type: formData.appointment.type,
                urgency: formData.appointment.urgency,
                doctor: formData.appointment.doctor,
                comments: formData.appointment.notes
            };

            const aRes = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData)
            });

            if (aRes.ok) {
                alert('Patient and Appointment registered successfully!');
                navigate('/patients');
            } else {
                const aData = await aRes.json();
                throw new Error(aData.message || 'Failed to create appointment');
            }
        } catch (err) {
            console.error('Error during registration:', err);
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="add-patient-page fade-in">
            <div className="add-patient-header">
                <h2>Add New Patient</h2>
                <p>Register a new patient in the EMR system</p>
            </div>

            <form onSubmit={handleSubmit} className="add-patient-form shadow-premium">
                <div className="ap-section">
                    <div className="ap-section-header">Patient Information</div>
                    <div className="ap-grid-4">
                        <div className="ap-group">
                            <label>Patient ID <span>*</span></label>
                            <input type="text" name="patient_id" value={formData.patient_id} onChange={handleChange} required />
                        </div>
                        <div className="ap-group">
                            <label>First Name <span>*</span></label>
                            <input type="text" name="name.first" value={formData.name.first} onChange={handleChange} required />
                        </div>
                        <div className="ap-group">
                            <label>Middle Name</label>
                            <input type="text" name="name.middle" value={formData.name.middle} onChange={handleChange} />
                        </div>
                        <div className="ap-group">
                            <label>Last Name <span>*</span></label>
                            <input type="text" name="name.last" value={formData.name.last} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="ap-grid-2">
                        <div className="ap-group">
                            <label>Age <span>*</span></label>
                            <input type="text" name="age" value={formData.age} onChange={handleChange} required />
                        </div>
                        <div className="ap-group">
                            <label>Contact Information <span>*</span></label>
                            <input type="text" name="contact_information" placeholder="7-10 digits" value={formData.contact_information} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                <div className="ap-section">
                    <div className="ap-section-header">Appointment Details</div>
                    <div className="ap-grid-2">
                        <div className="ap-group">
                            <label>Date <span>*</span></label>
                            <input type="date" name="appointment.date" value={formData.appointment.date} onChange={handleChange} required />
                        </div>
                        <div className="ap-group">
                            <label>Time <span>*</span></label>
                            <input type="time" name="appointment.time" value={formData.appointment.time} onChange={handleChange} required />
                        </div>
                        <div className="ap-group">
                            <label>Appointment Type</label>
                            <select name="appointment.type" value={formData.appointment.type} onChange={handleChange}>
                                <option>Follow-up</option>
                                <option>Regular</option>
                                <option>Emergency</option>
                            </select>
                        </div>
                        <div className="ap-group">
                            <label>Reason for Appointment</label>
                            <select name="appointment.reason" value={formData.appointment.reason} onChange={handleChange}>
                                <option>Regular</option>
                                <option>General Checkup</option>
                                <option>Pain</option>
                            </select>
                        </div>
                        <div className="ap-group">
                            <label>Urgency</label>
                            <select name="appointment.urgency" value={formData.appointment.urgency} onChange={handleChange}>
                                <option>No</option>
                                <option>Yes</option>
                            </select>
                        </div>
                        <div className="ap-group">
                            <label>Doctor</label>
                            <select name="appointment.doctor" value={formData.appointment.doctor} onChange={handleChange}>
                                <option>Dr. Ram Shah</option>
                                <option>Dr. Smith</option>
                                <option>Dr. Johnson</option>
                            </select>
                        </div>
                        <div className="ap-group ap-full">
                            <label>Notes</label>
                            <textarea name="appointment.notes" value={formData.appointment.notes} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => navigate('/patients')}>Cancel</button>
                    <button type="submit" className="save-btn">Save Patient & Appointment</button>
                </div>
            </form>
        </div>
    );
}

export default AddPatient;

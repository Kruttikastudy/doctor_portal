import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddAppointment.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function AddAppointment() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        age: '',
        contactInfo: '',
        date: '',
        time: '',
        appointmentType: '',
        reason: '',
        urgencyDropdown: 'No',
        doctor: '',
        comments: '',
        patient_id: ''
    });

    useEffect(() => {
        fetch(`${API_URL}/patients`)
            .then(res => res.json())
            .then(data => setPatients(Array.isArray(data) ? data : []))
            .catch(err => console.error('Error fetching patients:', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'patient_id' && value !== '') {
            const patient = patients.find(p => p._id === value);
            if (patient) {
                setFormData(prev => ({
                    ...prev,
                    patient_id: value,
                    firstName: patient.name?.first || '',
                    lastName: patient.name?.last || '',
                    contactInfo: patient.contact_info?.mobile?.number || ''
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Map local state to the schema structure expected by the backend
        const payload = {
            patient_name: {
                first: formData.firstName,
                middle: formData.middleName || null,
                last: formData.lastName
            },
            patient_id: formData.patient_id || null,
            age: Number(formData.age),
            contact_information: formData.contactInfo,
            appointment_date: formData.date,
            appointment_time: formData.time,
            appointment_type: formData.appointmentType,
            reason_for_appointment: formData.reason,
            urgency: formData.urgencyDropdown,
            doctor: formData.doctor,
            comments: formData.comments || null
        };

        fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data._id || data.success) {
                    alert('Appointment added successfully!');
                    navigate('/appointments');
                } else {
                    alert('Error: ' + (data.message || 'Failed to add appointment'));
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Error adding appointment');
            });
    };

    return (
        <div className="image-newvisit-page fade-in">
            <div className="newvisit-header-row">
                <h2>Add New Appointment</h2>
            </div>

            <form onSubmit={handleSubmit} className="newvisit-form-container">
                <div className="newvisit-section">
                    <h3>Patient Information</h3>
                    <div className="newvisit-grid">
                        <div className="newvisit-field">
                            <label>Select Existing Patient</label>
                            <select name="patient_id" value={formData.patient_id} onChange={handleChange}>
                                <option value="">-- New Patient --</option>
                                {patients.map(p => (
                                    <option key={p._id} value={p._id}>
                                        {p.name.first} {p.name.last} ({p._id})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="newvisit-grid">
                        <div className="newvisit-field">
                            <label>First Name*</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="newvisit-field">
                            <label>Middle Name</label>
                            <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
                        </div>
                        <div className="newvisit-field">
                            <label>Last Name*</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                <div className="newvisit-section">
                    <h3>Appointment Details</h3>
                    <div className="newvisit-grid">
                        <div className="newvisit-field">
                            <label>Age*</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                        </div>
                        <div className="newvisit-field">
                            <label>Contact Info*</label>
                            <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
                        </div>
                        <div className="newvisit-field">
                            <label>Date*</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div className="newvisit-field">
                            <label>Time*</label>
                            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="newvisit-grid">
                        <div className="newvisit-field">
                            <label>Type</label>
                            <select name="appointmentType" value={formData.appointmentType} onChange={handleChange}>
                                <option value="">Select Type</option>
                                <option>Routine Check-up</option>
                                <option>Follow-up</option>
                                <option>Consultation</option>
                                <option>Emergency</option>
                            </select>
                        </div>
                        <div className="newvisit-field">
                            <label>Urgency</label>
                            <select name="urgencyDropdown" value={formData.urgencyDropdown} onChange={handleChange}>
                                <option>No</option>
                                <option>Yes</option>
                            </select>
                        </div>
                        <div className="newvisit-field">
                            <label>Doctor</label>
                            <input type="text" name="doctor" value={formData.doctor} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="newvisit-field full-width">
                        <label>Reason</label>
                        <textarea name="reason" value={formData.reason} onChange={handleChange}></textarea>
                    </div>
                    <div className="newvisit-field full-width">
                        <label>Comments</label>
                        <textarea name="comments" value={formData.comments} onChange={handleChange}></textarea>
                    </div>
                </div>

                <div className="newvisit-footer-actions">
                    <button type="button" className="newvisit-cancel-btn" onClick={() => navigate('/appointments')}>Cancel</button>
                    <button type="submit" className="newvisit-save-btn">Save Appointment</button>
                </div>
            </form>
        </div>
    );
}

export default AddAppointment;

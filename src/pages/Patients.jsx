import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { patients as mockPatients } from '../data/mockData';
import './Patients.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Patients() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [selected, setSelected] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/patients`)
            .then(res => res.json())
            .then(data => {
                const results = Array.isArray(data) ? data : [];
                const formatted = results.map(p => ({
                    ...p, // Keep all data
                    id: p._id,
                    name: `${p.name?.first || ''} ${p.name?.last || ''}`.trim() || 'No Name',
                    email: p.contact_info?.email || 'N/A',
                    contact: p.contact_info?.mobile ? `${p.contact_info.mobile.code || ''} ${p.contact_info.mobile.number || ''}`.trim() : 'N/A',
                    status: p.status || 'Active'
                }));
                setPatients(formatted);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching patients:', err);
                setLoading(false);
            });
    }, []);

    const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.contact.includes(search) ||
        p.id.toLowerCase().includes(search.toLowerCase())
    ).filter(p => filterStatus === 'All' || p.status === filterStatus);

    const toggleSelectAll = () => {
        if (selectAll) { setSelected([]); } else { setSelected(filtered.map(p => p.id)); }
        setSelectAll(!selectAll);
    };

    const toggleSelect = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="image-doctors-page fade-in">
            {/* Controls row */}
            <div className="image-doctors-controls-row">
                <div className="image-search-container">
                    <div className="specialization-select-box">
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="All">All Fields</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        className="image-search-input"
                        placeholder="Search all fields..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button className="image-search-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* List section */}
            <div className="image-doctors-list-section">
                <div className="image-list-title-header">
                    <h2>Patient List</h2>
                    <span className="image-total-count-pill">Total Patients : {filtered.length}</span>
                </div>

                <div className="image-doctors-table-container">
                    <table className="image-doctors-list-table">
                        <thead>
                            <tr>
                                <th style={{ width: '44px' }}>
                                    <div className="white-circle-checkbox">
                                        <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                                    </div>
                                </th>
                                <th>Patient ID</th>
                                <th>Patient Name</th>
                                <th>Role</th>
                                <th>Contact no.</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', color: '#999', padding: '30px' }}>
                                        Loading patients...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', color: '#999', padding: '30px' }}>
                                        No patients found
                                    </td>
                                </tr>
                            ) : filtered.map(patient => (
                                <tr key={patient.id}>
                                    <td>
                                        <div className="white-circle-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(patient.id)}
                                                onChange={() => toggleSelect(patient.id)}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '12px' }}>{patient.id}</td>
                                    <td>
                                        <div className="name-avatar-cell">
                                            <div className="image-table-avatar">
                                                <div className="image-table-avatar-placeholder">
                                                    {getInitials(patient.name)}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 500 }}>{patient.name}</div>
                                        </div>
                                    </td>
                                    <td>Patient</td>
                                    <td>{patient.contact}</td>
                                    <td>{patient.email}</td>
                                    <td>
                                        <span className={`status-badge ${patient.status === 'Active' ? 'confirmed' : 'cancelled'}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="image-row-actions">
                                            <button className="appt-action-btn appt-start-btn" onClick={() => { setSelectedPatient(patient); setShowModal(true); }}>View</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Patient Detail Modal */}
            {showModal && selectedPatient && (
                <div className="patient-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="patient-detail-box fade-in" onClick={e => e.stopPropagation()}>
                        <div className="patient-modal-header">
                            <h2>Patient Detail Profile</h2>
                            <button className="patient-modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <div className="patient-modal-body">
                            {/* 1. Header & ID Section */}
                            <div className="patient-detail-section primary-bg">
                                <h3 className="section-title white">Overview & ID</h3>
                                <div className="patient-detail-grid">
                                    <div className="detail-item"><label>MongoDB ID</label> <span>{selectedPatient._id}</span></div>
                                    <div className="detail-item"><label>Patient Custom ID</label> <span>{selectedPatient.patient_id || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Full Name</label> <span>{selectedPatient.name}</span></div>
                                    <div className="detail-item"><label>Status</label> <span className={`status-badge ${selectedPatient.status === 'Active' ? 'confirmed' : 'cancelled'}`}>{selectedPatient.status}</span></div>
                                    <div className="detail-item"><label>Created At</label> <span>{selectedPatient.createdAt ? new Date(selectedPatient.createdAt).toLocaleString() : 'N/A'}</span></div>
                                    <div className="detail-item"><label>Last Updated</label> <span>{selectedPatient.updatedAt ? new Date(selectedPatient.updatedAt).toLocaleString() : 'N/A'}</span></div>
                                </div>
                            </div>

                            {/* 2. Personal Demographics */}
                            <div className="patient-detail-section">
                                <h3 className="section-title">Personal Demographics</h3>
                                <div className="patient-detail-grid">
                                    <div className="detail-item"><label>Age</label> <span>{selectedPatient.age || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Gender</label> <span>{selectedPatient.gender || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Date of Birth</label> <span>{selectedPatient.date_of_birth || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Blood Group</label> <span>{selectedPatient.blood_group || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Marital Status</label> <span>{selectedPatient.marital_status || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Occupation</label> <span>{selectedPatient.occupation || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Aadhaar Number</label> <span>{selectedPatient.aadhaar || 'N/A'}</span></div>
                                    <div className="detail-item"><label>PAN Number</label> <span>{selectedPatient.pan || 'N/A'}</span></div>
                                </div>
                            </div>

                            {/* 3. Contact Information */}
                            <div className="patient-detail-section">
                                <h3 className="section-title">Contact Information</h3>
                                <div className="patient-detail-grid">
                                    <div className="detail-item"><label>Email Address</label> <span>{selectedPatient.contact_info?.email || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Mobile Phone</label> <span>{selectedPatient.contact_info?.mobile ? `${selectedPatient.contact_info.mobile.code} ${selectedPatient.contact_info.mobile.number}` : 'N/A'}</span></div>
                                    <div className="detail-item"><label>Home Phone</label> <span>{selectedPatient.contact_info?.home_phone ? `${selectedPatient.contact_info.home_phone.code} ${selectedPatient.contact_info.home_phone.number}` : 'N/A'}</span></div>
                                    <div className="detail-item"><label>Work Phone</label> <span>{selectedPatient.contact_info?.work_phone ? `${selectedPatient.contact_info.work_phone.code} ${selectedPatient.contact_info.work_phone.number}` : 'N/A'}</span></div>
                                    <div className="detail-item"><label>Preferred Methods</label> <span>{selectedPatient.contact_info?.preferred_contact_methods?.join(', ') || 'N/A'}</span></div>
                                </div>
                            </div>

                            {/* 4. Address Details */}
                            <div className="patient-detail-section">
                                <h3 className="section-title">Address & Location</h3>
                                <div className="patient-detail-grid">
                                    <div className="detail-item"><label>Street Line 1</label> <span>{selectedPatient.address?.street || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Street Line 2</label> <span>{selectedPatient.address?.street2 || 'N/A'}</span></div>
                                    <div className="detail-item"><label>City</label> <span>{selectedPatient.address?.city || 'N/A'}</span></div>
                                    <div className="detail-item"><label>District</label> <span>{selectedPatient.address?.district || 'N/A'}</span></div>
                                    <div className="detail-item"><label>State</label> <span>{selectedPatient.address?.state || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Postal Code</label> <span>{selectedPatient.address?.postal_code || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Country</label> <span>{selectedPatient.address?.country || 'N/A'}</span></div>
                                </div>
                            </div>

                            {/* 5. Emergency Contacts */}
                            {selectedPatient.contact_info?.emergency_contact?.length > 0 && (
                                <div className="patient-detail-section">
                                    <h3 className="section-title">Emergency Contacts</h3>
                                    {selectedPatient.contact_info.emergency_contact.map((ec, idx) => (
                                        <div key={idx} className="emergency-contact-card">
                                            <div className="patient-detail-grid">
                                                <div className="detail-item"><label>Name</label> <span>{ec.name?.first} {ec.name?.last}</span></div>
                                                <div className="detail-item"><label>Relationship</label> <span>{ec.relationship}</span></div>
                                                <div className="detail-item"><label>Phone</label> <span>{ec.phone ? `${ec.phone.code} ${ec.phone.number}` : 'N/A'}</span></div>
                                                <div className="detail-item"><label>Email</label> <span>{ec.email || 'N/A'}</span></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 6. Insurance Information */}
                            <div className="patient-detail-section">
                                <h3 className="section-title">Insurance Details</h3>
                                <h4 className="sub-section-title">Primary Insurance</h4>
                                <div className="patient-detail-grid">
                                    <div className="detail-item"><label>Company</label> <span>{selectedPatient.insurance?.primary?.company_name || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Policy #</label> <span>{selectedPatient.insurance?.primary?.policy_number || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Group #</label> <span>{selectedPatient.insurance?.primary?.group_number || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Plan Type</label> <span>{selectedPatient.insurance?.primary?.plan_type || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Effective Start</label> <span>{selectedPatient.insurance?.primary?.effective_start || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Effective End</label> <span>{selectedPatient.insurance?.primary?.effective_end || 'N/A'}</span></div>
                                </div>
                                <div style={{ marginTop: '15px' }}></div>
                                <h4 className="sub-section-title">Secondary Insurance</h4>
                                <div className="patient-detail-grid">
                                    <div className="detail-item"><label>Company</label> <span>{selectedPatient.insurance?.secondary?.company_name || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Policy #</label> <span>{selectedPatient.insurance?.secondary?.policy_number || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Group #</label> <span>{selectedPatient.insurance?.secondary?.group_number || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Plan Type</label> <span>{selectedPatient.insurance?.secondary?.plan_type || 'N/A'}</span></div>
                                </div>
                                <div className="detail-item" style={{ marginTop: '15px' }}>
                                    <label>Insurance Contact Number</label> <span>{selectedPatient.insurance?.insurance_contact_number || 'N/A'}</span>
                                </div>
                            </div>

                            {/* 7. Social History */}
                            <div className="patient-detail-section">
                                <h3 className="section-title">Social History</h3>
                                <div className="patient-detail-grid">
                                    <div className="detail-item">
                                        <label>Alcohol Use</label>
                                        <span>{selectedPatient.social_history?.alcohol_use?.current_status || 'N/A'} {selectedPatient.social_history?.alcohol_use?.frequency ? `(${selectedPatient.social_history.alcohol_use.frequency})` : ''}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Smoking Status</label>
                                        <span>{selectedPatient.social_history?.tobacco_smoking?.current_status || 'N/A'} {selectedPatient.social_history?.tobacco_smoking?.frequency ? `(${selectedPatient.social_history.tobacco_smoking.frequency})` : ''}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Tobacco Consumption</label>
                                        <span>{selectedPatient.social_history?.tobacco_consumption?.current_status || 'N/A'} {selectedPatient.social_history?.tobacco_consumption?.frequency ? `(${selectedPatient.social_history.tobacco_consumption.frequency})` : ''}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Perceived Stress</label>
                                        <span>{selectedPatient.social_history?.stress?.perceived_stress_level || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Physical Activity</label>
                                        <span>{selectedPatient.social_history?.physical_activity?.frequency || 'N/A'} {selectedPatient.social_history?.physical_activity?.intensity ? `(${selectedPatient.social_history.physical_activity.intensity})` : ''}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Domestic Violence Exposure</label>
                                        <span>{selectedPatient.social_history?.domestic_violence_exposure?.exposure || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="detail-item" style={{ marginTop: '15px' }}>
                                    <label>Social History Notes</label> <span>{selectedPatient.social_history?.social_history_free_text?.notes || 'None'}</span>
                                </div>
                            </div>

                            {/* 8. Clinical History */}
                            <div className="patient-detail-section">
                                <h3 className="section-title">Clinical & Surgical History</h3>
                                <div className="patient-detail-grid">
                                    <div className="detail-item">
                                        <label>Medical History</label>
                                        <span>{selectedPatient.medical_history?.join(', ') || selectedPatient.medicalHistory?.join(', ') || 'No medical history recorded'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Surgical History</label>
                                        <span>{selectedPatient.surgical_history?.join(', ') || selectedPatient.surgicalHistory?.join(', ') || 'No surgical history recorded'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Immunization History</label>
                                        <span>{selectedPatient.immunization_history?.join(', ') || selectedPatient.immunizationHistory?.join(', ') || 'No immunization history recorded'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 9. Family History */}
                            <div className="patient-detail-section">
                                <h3 className="section-title">Family History</h3>
                                {selectedPatient.family_history?.family_members?.length > 0 ? (
                                    <div className="family-history-list">
                                        {selectedPatient.family_history.family_members.map((fm, i) => (
                                            <div key={i} className="family-member-card">
                                                <div className="patient-detail-grid">
                                                    <div className="detail-item"><label>Member</label> <span>{fm.name?.first} {fm.name?.last}</span></div>
                                                    <div className="detail-item"><label>Relationship</label> <span>{fm.relationship}</span></div>
                                                    <div className="detail-item"><label>Condition</label> <span>{fm.medical_conditions?.join(', ') || 'None'}</span></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="sv-empty">No family history recorded</span>
                                )}
                            </div>

                            {/* 10. Allergies */}
                            <div className="patient-detail-section">
                                <h3 className="section-title">Allergies</h3>
                                {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                                    <div className="allergy-tags-container">
                                        {selectedPatient.allergies.map((a, idx) => (
                                            <div key={idx} className="allergy-detail-tag">
                                                <span className="allergy-name">{a.allergen || a.name || 'Unknown'}</span>
                                                <div className="allergy-meta">
                                                    <span>Sev: {a.severity || 'N/A'}</span>
                                                    <span>Code: {a.code || 'N/A'}</span>
                                                    <span>Stat: {a.status || 'Active'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="sv-empty">No allergies recorded</span>
                                )}
                            </div>
                        </div>
                        <div className="patient-modal-footer">
                            <button className="btn-modal-back" onClick={() => setShowModal(false)}>Back to List</button>
                            <button className="btn-modal-start" onClick={() => navigate(`/start-visit/${selectedPatient.id}/0`)}>Start Medical Visit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Patients;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patients, visitHistory, medicalHistory, medications } from '../data/mockData';
import './StartVisit.css';

const TABS = ['Overview', 'History', 'Medication', 'Visit History'];

function StartVisit() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');

    const patient = patients.find(p => p.id === patientId) || patients[0];
    const visits = visitHistory[patient.id] || [];
    const history = medicalHistory[patient.id] || { medical: [], surgical: [], immunization: [], family: [] };
    const meds = medications[patient.id] || { active: [], discontinued: [] };

    // Overview: last 3 visits
    const recentVisits = visits.slice(0, 3);

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="sv-page fade-in">
            {/* Patient header - Minimalist style from screenshot */}
            <div className="sv-header-new-layout">
                <div className="sv-p-avatar-large">
                    <div className="sv-p-circle"></div>
                </div>
                <div className="sv-p-details-new">
                    <div className="sv-p-name-row">
                        <span className="sv-p-label">{patient.name}</span>
                    </div>
                    <div className="sv-p-id-row">
                        <span className="sv-p-label">{patient.id}</span>
                    </div>
                    <div className="sv-p-gender-age">
                        <span className="sv-p-label">{patient.gender}</span>
                        <span className="sv-p-label sv-p-age">Age: {patient.age || 'N/A'}</span>
                    </div>
                    <div className="sv-p-phone">
                        <span className="sv-p-label">{patient.contact}</span>
                    </div>
                </div>
                <div className="sv-header-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/appointments')}>← Back</button>
                    <button className="btn btn-success" onClick={() => navigate(`/new-visit/${patient.id}`)}>New Visit</button>
                </div>
            </div>

            {/* Info bar (minimalist) */}
            <div className="sv-info-bar-minimal">
                <div className="sv-info-col">
                    <div className="sv-info-label-sm">Past Visit Total: <strong>{visits.length}</strong></div>
                </div>
                <div className="sv-info-col">
                    <div className="sv-info-label-sm">Allergies: <strong>{patient.allergies}</strong></div>
                </div>
                <div className="sv-info-col">
                    <div className="sv-info-label-sm">Social History: <strong>{patient.socialHistory}</strong></div>
                </div>
            </div>

            {/* Tab bar (grey text, blue underline for active) */}
            <div className="sv-tabs-container-minimal">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        className={`sv-tab-minimal ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="sv-tab-content">
                {/* OVERVIEW - Card based layout */}
                {activeTab === 'Overview' && (
                    <div className="sv-visits-list fade-in">
                        {recentVisits.length === 0 ? (
                            <div className="sv-empty">No visits recorded</div>
                        ) : recentVisits.map(visit => (
                            <div key={visit.id} className="sv-visit-card">
                                <div className="sv-visit-avatar">
                                    {getInitials(visit.doctorName.replace('Dr. ', ''))}
                                </div>
                                <div className="sv-visit-details">
                                    <div className="sv-visit-row1">
                                        <span className="sv-doctor-name">{visit.doctorName}</span>
                                        <span className="sv-type-label">Type: <strong>{visit.type}</strong></span>
                                    </div>
                                    <div className="sv-visit-row2">
                                        <span className="sv-doctor-id">{visit.doctorId}</span>
                                        <span className="sv-clinical">Clinical notes</span>
                                    </div>
                                    <p className="sv-notes">{visit.clinicalNotes}</p>
                                </div>
                                <div className="sv-visit-right">
                                    <span className="sv-visit-date">Date: {visit.date}</span>
                                    <button className="btn btn-primary btn-sm">View</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* HISTORY - Minimalist style from screenshot */}
                {activeTab === 'History' && (
                    <div className="sv-history-minimal fade-in">
                        <div className="sv-h-section">
                            <h3 className="sv-h-title">Medical History</h3>
                            <div className="sv-h-table-header">
                                <span>Condition</span>
                                <span>Diagnosis Date</span>
                                <span>Treating Physician</span>
                                <span>Current Status</span>
                            </div>
                            <div className="sv-history-rows">
                                {history.medical.map((item, i) => (
                                    <div key={i} className="sv-history-row-item">
                                        <span data-label="Condition">{item.condition}</span>
                                        <span data-label="Diagnosis Date">{item.diagnosisDate}</span>
                                        <span data-label="Treating Physician">{item.treatingPhysician}</span>
                                        <span data-label="Current Status">{item.currentStatus}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="sv-h-row-line"></div>
                        </div>

                        <div className="sv-h-section">
                            <h3 className="sv-h-title">Surgical History</h3>
                            <div className="sv-h-table-header">
                                <span>Surgery Type</span>
                                <span>Surgery Date</span>
                                <span>Surgeon Name</span>
                                <span>Current Status</span>
                            </div>
                            <div className="sv-history-rows">
                                {history.surgical.map((item, i) => (
                                    <div key={i} className="sv-history-row-item">
                                        <span data-label="Surgery Type">{item.surgeryType}</span>
                                        <span data-label="Surgery Date">{item.surgeryDate}</span>
                                        <span data-label="Surgeon Name">{item.surgeonName}</span>
                                        <span data-label="Current Status">{item.currentStatus}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="sv-h-row-line"></div>
                        </div>

                        <div className="sv-h-section">
                            <h3 className="sv-h-title">Immunization History</h3>
                            <div className="sv-h-table-header">
                                <span>Vaccine Name</span>
                                <span>Vaccine Date</span>
                                <span>Physician Name</span>
                                <span>Current Status</span>
                            </div>
                            <div className="sv-history-rows">
                                {history.immunization.map((item, i) => (
                                    <div key={i} className="sv-history-row-item">
                                        <span data-label="Vaccine Name">{item.vaccineName}</span>
                                        <span data-label="Vaccine Date">{item.vaccineDate}</span>
                                        <span data-label="Physician Name">{item.physicianName}</span>
                                        <span data-label="Current Status">{item.currentStatus}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="sv-h-row-line"></div>
                        </div>

                        <div className="sv-h-section">
                            <h3 className="sv-h-title">Family History</h3>
                            <div className="sv-h-table-header">
                                <span>Name</span>
                                <span>Gender</span>
                                <span>Relationship</span>
                                <span>Medical Condition</span>
                            </div>
                            <div className="sv-history-rows">
                                {history.family.map((item, i) => (
                                    <div key={i} className="sv-history-row-item">
                                        <span data-label="Name">{item.name}</span>
                                        <span data-label="Gender">{item.gender}</span>
                                        <span data-label="Relationship">{item.relationship}</span>
                                        <span data-label="Medical Condition">{item.medicalCondition}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="sv-h-row-line"></div>
                        </div>
                    </div>
                )}

                {/* MEDICATION */}
                {activeTab === 'Medication' && (
                    <div className="sv-medication fade-in">
                        {/* Active Medication */}
                        <div className="sv-med-section">
                            <h3>Active Medication</h3>
                            <div className="sv-med-header-row">
                                <span>Problem</span>
                                <span>Medicines</span>
                                <span>Mg</span>
                                <span>Dose Time</span>
                                <span>Time Period</span>
                            </div>
                            {meds.active.length === 0 ? (
                                <div className="sv-empty">No active medications</div>
                            ) : meds.active.map((med, i) => (
                                <div key={i} className="sv-med-row">
                                    <div className="sv-med-box">{med.problem}</div>
                                    <div className="sv-med-box">{med.medicine}</div>
                                    <div className="sv-med-tag">{med.mg}</div>
                                    <div className="sv-med-box">{med.doseTime}</div>
                                    <div className="sv-med-box">{med.timePeriod}</div>
                                </div>
                            ))}
                        </div>

                        {/* Discontinued Medication */}
                        <div className="sv-med-section">
                            <h3>Discontinued Medication</h3>
                            <div className="sv-med-header-row">
                                <span>Problem</span>
                                <span>Medicines</span>
                                <span>Mg</span>
                                <span>Dose Time</span>
                                <span>Time Period</span>
                            </div>
                            {meds.discontinued.length === 0 ? (
                                <div className="sv-empty">No discontinued medications</div>
                            ) : meds.discontinued.map((med, i) => (
                                <div key={i} className="sv-med-row sv-med-row-disc">
                                    <div className="sv-med-box">{med.problem}</div>
                                    <div className="sv-med-box">{med.medicine}</div>
                                    <div className="sv-med-tag">{med.mg}</div>
                                    <div className="sv-med-box">{med.doseTime}</div>
                                    <div className="sv-med-box">{med.timePeriod}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* VISIT HISTORY - Card based layout */}
                {activeTab === 'Visit History' && (
                    <div className="sv-visits-list fade-in">
                        {visits.length === 0 ? (
                            <div className="sv-empty">No visit history</div>
                        ) : visits.map(visit => (
                            <div key={visit.id} className="sv-visit-card">
                                <div className="sv-visit-avatar">
                                    {getInitials(visit.doctorName.replace('Dr. ', ''))}
                                </div>
                                <div className="sv-visit-details">
                                    <div className="sv-visit-row1">
                                        <span className="sv-doctor-name">{visit.doctorName}</span>
                                        <span className="sv-type-label">Type: <strong>{visit.type}</strong></span>
                                    </div>
                                    <div className="sv-visit-row2">
                                        <span className="sv-doctor-id">{visit.doctorId}</span>
                                        <span className="sv-clinical">Clinical notes</span>
                                    </div>
                                    <p className="sv-notes">{visit.clinicalNotes}</p>
                                </div>
                                <div className="sv-visit-right">
                                    <span className="sv-visit-date">Date: {visit.date}</span>
                                    <button className="btn btn-primary btn-sm">View</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StartVisit;

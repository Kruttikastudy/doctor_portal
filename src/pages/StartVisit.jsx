import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StartVisit.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TABS = ['Overview', 'History', 'Medication', 'Visit History'];

function StartVisit() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [patient, setPatient] = useState(null);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVisit, setSelectedVisit] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pUrl = `${API_URL}/patients/${patientId}`;
                const vUrl = `${API_URL}/visits/${patientId}`;
                console.log(`DEBUG: Fetching patient from ${pUrl}`);
                console.log(`DEBUG: Fetching visits from ${vUrl}`);

                const [pRes, vRes] = await Promise.all([
                    fetch(pUrl),
                    fetch(vUrl)
                ]);

                // Handle Patient Response
                const pContentType = pRes.headers.get("content-type");
                let pData;
                if (pContentType && pContentType.includes("application/json")) {
                    pData = await pRes.json();
                } else {
                    const pText = await pRes.text();
                    console.error("Non-JSON Patient Response:", pText.substring(0, 500));
                    alert(`Error: Received HTML instead of JSON for Patient.\nStatus: ${pRes.status}\nURL: ${pUrl}\n\nCheck if your backend is running.`);
                    return;
                }

                // Handle Visits Response
                const vContentType = vRes.headers.get("content-type");
                let vData;
                if (vContentType && vContentType.includes("application/json")) {
                    vData = await vRes.json();
                } else {
                    console.warn(`Non-JSON Visits Response from ${vUrl}`);
                    vData = [];
                }

                if (pRes.ok) {
                    setPatient(pData);
                } else {
                    console.error(`Patient Fetch Failed: ${pRes.status}`, pData);
                    alert(`Fetch Failed: ${pRes.status}\nURL: ${pUrl}\nError: ${pData?.message || 'Check Console'}`);
                }
                if (vRes.ok) setVisits(Array.isArray(vData) ? vData : []);
            } catch (err) {
                console.error('Error fetching data:', err);
                alert(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [patientId]);

    if (loading) return <div className="sv-loading">Loading patient records...</div>;
    if (!patient) return <div className="sv-error">Patient not found (ID: {patientId})</div>;

    // Cumulative Medication Logic: 
    // 1. Start from EARLIEST visit to LATEST.
    // 2. Add all 'Active' meds to a map (keyed by name).
    // 3. If a med is updated in a newer visit, move the old one to history/discontinued.
    // 4. If a med is marked 'Discontinued', move to history.

    const medMap = new Map(); // name -> latest active med object
    const historyMeds = [];   // all superseded or discontinued meds

    // Sort visits by date earliest first for the reducer
    const sortedVisits = [...visits].sort((a, b) => new Date(a.appointment_date || a.createdAt) - new Date(b.appointment_date || b.createdAt));

    sortedVisits.forEach(v => {
        const meds = v.medication_history || v.medications || [];
        const vDate = v.appointment_date || v.date || new Date(v.createdAt).toLocaleDateString();

        meds.forEach(m => {
            const medKey = m.medicine?.toLowerCase().trim();
            if (!medKey) return;

            if (m.status === 'Discontinued') {
                // If it was in our active map, move it to history
                if (medMap.has(medKey)) {
                    historyMeds.push({ ...medMap.get(medKey), visitDate: vDate, discontinuedReason: 'Marked Discontinued' });
                    medMap.delete(medKey);
                }
                historyMeds.push({ ...m, visitDate: vDate });
            } else {
                // If we already have an active one with this name, move the old one to history (superseded)
                if (medMap.has(medKey)) {
                    const oldMed = medMap.get(medKey);
                    // Only supersede if something actually changed (optional check, but user wants updated one to be active)
                    historyMeds.push({ ...oldMed, visitDate: vDate, discontinuedReason: 'Superseded by update' });
                }
                medMap.set(medKey, { ...m, visitDate: vDate });
            }
        });
    });

    const activeMeds = Array.from(medMap.values());
    const discontinuedMeds = historyMeds;

    // Overview: last 3 visits
    const recentVisits = visits.slice(0, 3);

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    // Defensive history object - using correct field names from DB
    const history = {
        medical: patient.medical_history || patient.medicalHistory || [],
        surgical: patient.surgical_history || patient.surgicalHistory || [],
        immunization: patient.immunization_history || patient.immunizationHistory || [],
        family: patient.family_history?.family_members || patient.familyHistory || []
    };

    const renderAllergies = (allergies) => {
        if (!allergies) return 'None';
        if (typeof allergies === 'string') return allergies;
        if (Array.isArray(allergies)) {
            return allergies.map(a => typeof a === 'object' ? (a.allergen || a.name || 'Unknown') : a).join(', ');
        }
        return 'N/A';
    };

    return (
        <div className="sv-page fade-in">
            {/* Patient header - Minimalist style from screenshot */}
            <div className="sv-header-new-layout">
                <div className="sv-p-avatar-large">
                    <div className="sv-p-circle"></div>
                </div>
                <div className="sv-p-details-new">
                    <div className="sv-p-name-row">
                        <span className="sv-p-name">{patient.name?.first} {patient.name?.last}</span>
                        <span className="sv-p-id">ID: {patient._id}</span>
                    </div>
                    <div className="sv-p-info-row">
                        <span className="sv-p-label">{patient.gender}</span>
                        <span className="sv-p-label sv-p-age">DOB: {patient.date_of_birth}</span>
                        <span className="sv-p-label">{patient.contact_info?.mobile?.number}</span>
                    </div>

                </div>
                <div className="sv-header-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/appointments')}>← Back</button>
                    <button className="btn btn-success" onClick={() => navigate(`/new-visit/${patient._id}`)}>New Visit</button>
                </div>
            </div>

            {/* Info bar (minimalist) */}
            <div className="sv-info-bar-minimal">
                <div className="sv-info-col">
                    <div className="sv-info-label-sm">Past Visit Total: <strong>{visits.length}</strong></div>
                </div>
                <div className="sv-info-col">
                    <div className="sv-info-label-sm">Allergies: <strong>{renderAllergies(patient.allergies)}</strong></div>
                </div>
                <div className="sv-info-col sv-social-info-col">
                    <div className="sv-info-label-sm">Social History:</div>
                    <div className="sv-social-compact-items">
                        <span className={`sv-sh-tag ${patient.social_history?.alcohol_use?.current_status?.toLowerCase().includes('non') ? 'safe' : 'warning'}`}>
                            Alc: {patient.social_history?.alcohol_use?.current_status || 'N/A'}
                        </span>
                        <span className={`sv-sh-tag ${patient.social_history?.tobacco_smoking?.current_status?.toLowerCase().includes('never') ? 'safe' : 'warning'}`}>
                            Smk: {patient.social_history?.tobacco_smoking?.current_status || 'N/A'}
                        </span>
                        <span className={`sv-sh-tag ${patient.social_history?.tobacco_consumption?.current_status?.toLowerCase().includes('never') ? 'safe' : 'warning'}`}>
                            Tob: {patient.social_history?.tobacco_consumption?.current_status || 'N/A'}
                        </span>
                        <span className={`sv-sh-tag ${patient.social_history?.stress?.perceived_stress_level === 'Low' ? 'safe' : 'warning'}`}>
                            Str: {patient.social_history?.stress?.perceived_stress_level || 'N/A'}
                        </span>
                        <span className="sv-sh-tag info">
                            Act: {patient.social_history?.physical_activity?.frequency || 'N/A'}
                        </span>
                    </div>
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
                            <div key={visit._id} className="sv-visit-card">
                                <div className="sv-visit-avatar">
                                    {getInitials(visit.seen_by?.replace('Dr. ', '') || 'U', '')}
                                </div>
                                <div className="sv-visit-details">
                                    <div className="sv-visit-row1">
                                        <span className="sv-doctor-name">{visit.seen_by}</span>
                                        <span className="sv-type-label">Type: <strong>{visit.visit_type}</strong></span>
                                    </div>
                                    <div className="sv-visit-row2">
                                        <p className="sv-clinical">
                                            <span className="sv-clinical-label">Clinical:</span> {visit.diagnosis?.full_icd10_list || visit.diagnosis?.condition || 'N/A'}
                                        </p>
                                        <p className="sv-notes">
                                            <span className="sv-notes-label">Treatment:</span> {visit.treatment || visit.diagnosis?.treatment || 'N/A'}
                                        </p>
                                    </div>
                                    <p className="sv-notes">{visit.chief_complaints || 'No complaints recorded'}</p>
                                </div>
                                <div className="sv-visit-right">
                                    <span className="sv-visit-date">Date: {visit.appointment_date || visit.date}</span>
                                    <button className="btn btn-primary btn-sm" onClick={() => setSelectedVisit(visit)}>View</button>
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
                            <div className="sv-h-table-header" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 2fr' }}>
                                <span>Name</span>
                                <span>Gender</span>
                                <span>Relationship</span>
                                <span>Medical Condition</span>
                            </div>
                            <div className="sv-history-rows" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 2fr' }}>
                                {history.family.length === 0 ? <div className="sv-empty">No family history recorded</div> :
                                    history.family.map((item, i) => (
                                        <div key={i} className="sv-history-row-item" style={{ display: 'contents' }}>
                                            <span data-label="Name">{item.name?.first} {item.name?.last}</span>
                                            <span data-label="Gender">{item.gender}</span>
                                            <span data-label="Relationship">{item.relationship}</span>
                                            <span data-label="Medical Condition">{item.medical_conditions?.join(', ') || 'None'}</span>
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
                                <span>Time Period</span>
                            </div>
                            {activeMeds.length === 0 ? (
                                <div className="sv-empty">No active medications</div>
                            ) : activeMeds.map((med, i) => (
                                <div key={i} className="sv-med-row">
                                    <div className="sv-med-box">{med.problem || 'N/A'}</div>
                                    <div className="sv-med-box">{med.medicine}</div>
                                    <div className="sv-med-tag">{med.dosage}mg</div>
                                    <div className="sv-med-box">{med.duration}</div>
                                </div>
                            ))}
                        </div>

                        {/* Discontinued Medication */}
                        <div className="sv-med-section">
                            <h3>Discontinued Medication</h3>
                            <div className="sv-med-header-row disc">
                                <span>Problem</span>
                                <span>Medicines</span>
                                <span>Mg</span>
                                <span>Time Period</span>
                                <span>Visit Date</span>
                            </div>
                            {discontinuedMeds.length === 0 ? (
                                <div className="sv-empty">No discontinued medications</div>
                            ) : discontinuedMeds.map((med, i) => (
                                <div key={i} className="sv-med-row sv-med-row-disc disc">
                                    <div className="sv-med-box">{med.problem || 'N/A'}</div>
                                    <div className="sv-med-box">{med.medicine}</div>
                                    <div className="sv-med-tag">{med.dosage}mg</div>
                                    <div className="sv-med-box">{med.duration}</div>
                                    <div className="sv-med-box">{med.visitDate || 'N/A'}</div>
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
                            <div key={visit._id} className="sv-visit-card">
                                <div className="sv-visit-avatar">
                                    {getInitials(visit.seen_by?.replace('Dr. ', '') || 'U', '')}
                                </div>
                                <div className="sv-visit-details">
                                    <div className="sv-visit-row1">
                                        <span className="sv-doctor-name">{visit.seen_by}</span>
                                        <span className="sv-type-label">Type: <strong>{visit.visit_type}</strong></span>
                                    </div>
                                    <div className="sv-visit-row2">
                                        <p className="sv-clinical">
                                            <span className="sv-clinical-label">Clinical:</span> {visit.diagnosis?.full_icd10_list || visit.diagnosis?.condition || 'N/A'}
                                        </p>
                                        <p className="sv-notes">
                                            <span className="sv-notes-label">Treatment:</span> {visit.treatment || visit.diagnosis?.treatment || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="sv-visit-right">
                                        <span className="sv-visit-date">Date: {visit.appointment_date || visit.date}</span>
                                        <button className="btn btn-primary btn-sm" onClick={() => setSelectedVisit(visit)}>View</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Visit Detail Modal */}
            {selectedVisit && (
                <div className="sv-modal-overlay" onClick={() => setSelectedVisit(null)}>
                    <div className="sv-modal-container" onClick={e => e.stopPropagation()}>
                        <div className="sv-modal-header">
                            <h2>Visit Details - {selectedVisit.appointment_date || selectedVisit.date}</h2>
                            <button className="sv-modal-close" onClick={() => setSelectedVisit(null)}>&times;</button>
                        </div>
                        <div className="sv-modal-body">
                            <div className="sv-detail-grid">
                                <div className="sv-detail-item">
                                    <span className="sv-detail-label">Patient Name</span>
                                    <span className="sv-detail-value">{selectedVisit.patient_name || 'N/A'}</span>
                                </div>
                                <div className="sv-detail-item">
                                    <span className="sv-detail-label">Visit Type</span>
                                    <span className="sv-detail-value">{selectedVisit.visit_type}</span>
                                </div>
                                <div className="sv-detail-item">
                                    <span className="sv-detail-label">Seen By</span>
                                    <span className="sv-detail-value">{selectedVisit.seen_by}</span>
                                </div>
                                <div className="sv-detail-item">
                                    <span className="sv-detail-label">Report ID</span>
                                    <span className="sv-detail-value">{selectedVisit._id}</span>
                                </div>
                            </div>

                            <div className="sv-detail-section">
                                <h3 className="sv-section-title">Vitals</h3>
                                <div className="sv-vitals-grid">
                                    <div className="sv-vital-box">
                                        <div className="sv-vital-label">Height</div>
                                        <div className="sv-vital-val">{selectedVisit.vitals?.height || '--'} cm</div>
                                    </div>
                                    <div className="sv-vital-box">
                                        <div className="sv-vital-label">Weight</div>
                                        <div className="sv-vital-val">{selectedVisit.vitals?.weight || '--'} kg</div>
                                    </div>
                                    <div className="sv-vital-box">
                                        <div className="sv-vital-label">B.P.</div>
                                        <div className="sv-vital-val">{selectedVisit.vitals?.blood_pressure || selectedVisit.vitals?.bp || '--'}</div>
                                    </div>
                                    <div className="sv-vital-box">
                                        <div className="sv-vital-label">Pulse</div>
                                        <div className="sv-vital-val">{selectedVisit.vitals?.pulse || '--'} bpm</div>
                                    </div>
                                    <div className="sv-vital-box">
                                        <div className="sv-vital-label">Temp</div>
                                        <div className="sv-vital-val">{selectedVisit.vitals?.temperature || selectedVisit.vitals?.temp || '--'} °F</div>
                                    </div>
                                    <div className="sv-vital-box">
                                        <div className="sv-vital-label">RR</div>
                                        <div className="sv-vital-val">{selectedVisit.vitals?.respiratory_rate || selectedVisit.vitals?.rr || '--'} bpm</div>
                                    </div>
                                    <div className="sv-vital-box">
                                        <div className="sv-vital-label">Oxygen</div>
                                        <div className="sv-vital-val">{selectedVisit.vitals?.oxygen_saturation || selectedVisit.vitals?.oxygen || '--'} %</div>
                                    </div>
                                </div>
                            </div>

                            <div className="sv-detail-section">
                                <h3 className="sv-section-title">Clinical Information</h3>
                                <div className="sv-detail-item" style={{ marginBottom: '15px' }}>
                                    <span className="sv-detail-label">Chief Complaints</span>
                                    <span className="sv-detail-value">{selectedVisit.chief_complaints || 'None'}</span>
                                </div>
                                <div className="sv-detail-grid">
                                    <div className="sv-detail-item">
                                        <span className="sv-detail-label">Diagnosis</span>
                                        <span className="sv-detail-value">{selectedVisit.diagnosis?.full_icd10_list || selectedVisit.diagnosis?.condition || 'N/A'}</span>
                                    </div>
                                    <div className="sv-detail-item">
                                        <span className="sv-detail-label">ICD-10 Code</span>
                                        <span className="sv-detail-value">{selectedVisit.diagnosis?.icd10_quickest || selectedVisit.diagnosis?.icdCode || 'N/A'}</span>
                                    </div>
                                    <div className="sv-detail-item">
                                        <span className="sv-detail-label">Treatment</span>
                                        <span className="sv-detail-value">{selectedVisit.treatment || selectedVisit.diagnosis?.treatment || 'N/A'}</span>
                                    </div>
                                    <div className="sv-detail-item">
                                        <span className="sv-detail-label">Notes</span>
                                        <span className="sv-detail-value">{selectedVisit.notes || 'No extra notes'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="sv-detail-section">
                                <h3 className="sv-section-title">Investigations</h3>
                                <div className="sv-detail-grid">
                                    <div className="sv-detail-item">
                                        <span className="sv-detail-label">Investigation Request</span>
                                        <span className="sv-detail-value">{selectedVisit.investigation_request || selectedVisit.investigationRequest || 'None'}</span>
                                    </div>
                                    <div className="sv-detail-item">
                                        <span className="sv-detail-label">Investigation Result</span>
                                        <span className="sv-detail-value">{selectedVisit.investigation_result || selectedVisit.investigationResult || 'None'}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedVisit.medication_history?.length > 0 && (
                                <div className="sv-detail-section">
                                    <h3 className="sv-section-title">Medications Prescribed</h3>
                                    <table className="sv-modal-med-table">
                                        <thead>
                                            <tr>
                                                <th>Medicine</th>
                                                <th>Dosage</th>
                                                <th>Frequency</th>
                                                <th>Duration</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedVisit.medication_history.map((med, i) => (
                                                <tr key={i}>
                                                    <td>{med.medicine}</td>
                                                    <td>{med.dosage}mg</td>
                                                    <td>{med.frequency}</td>
                                                    <td>{med.duration}</td>
                                                    <td>
                                                        <span className={`sv-badge ${med.status === 'Active' ? 'sv-badge-active' : 'sv-badge-disc'}`}>
                                                            {med.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="sv-detail-section">
                                <h3 className="sv-section-title">Financial Summary</h3>
                                <div className="sv-vitals-grid">
                                    <div className="sv-vital-box">
                                        <div className="sv-vital-label">Total Cost</div>
                                        <div className="sv-vital-val">₹{selectedVisit.billing?.total_cost || selectedVisit.costs?.total || '0'}</div>
                                    </div>
                                    <div className="sv-vital-box">
                                        <div className="sv-vital-label">Paid</div>
                                        <div className="sv-vital-val">₹{selectedVisit.billing?.amount_paid || selectedVisit.costs?.paid || '0'}</div>
                                    </div>
                                    <div className="sv-vital-box" style={{ background: '#fff5f5' }}>
                                        <div className="sv-vital-label">Balance</div>
                                        <div className="sv-vital-val" style={{ color: '#c53030' }}>₹{selectedVisit.billing?.balance_amount || selectedVisit.costs?.balance || '0'}</div>
                                    </div>
                                </div>
                            </div>

                            {selectedVisit.follow_up && (
                                <div className="sv-detail-item">
                                    <span className="sv-detail-label">Follow-up Recommendation</span>
                                    <span className="sv-detail-value">{selectedVisit.follow_up}</span>
                                </div>
                            )}

                            <div className="sv-detail-grid" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                <div className="sv-detail-item">
                                    <span className="sv-detail-label">Record Created</span>
                                    <span className="sv-detail-value" style={{ fontSize: '0.8rem' }}>{new Date(selectedVisit.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="sv-detail-item">
                                    <span className="sv-detail-label">Last Updated</span>
                                    <span className="sv-detail-value" style={{ fontSize: '0.8rem' }}>{new Date(selectedVisit.updatedAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StartVisit;

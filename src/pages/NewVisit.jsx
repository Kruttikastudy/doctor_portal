import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patients } from '../data/mockData';
import './NewVisit.css';

const VISIT_TYPES = ['Emergency Visit', 'Routine Checkup', 'Follow-up', 'Consultation'];
const DOCTORS = ['Dr. Smith', 'Dr. Jones', 'Dr. Taylor'];

function NewVisit() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [patient, setPatient] = useState(null);

    const [formData, setFormData] = useState({
        visitType: 'Emergency Visit',
        patientId: '',
        patientName: '',
        chiefComplaints: '',
        vitals: {
            height: '',
            rr: '',
            weight: '',
            oxygen: '',
            bp: '',
            temp: '',
            pulse: ''
        },
        notes: '',
        investigationRequest: '',
        investigationResult: '',
        diagnosis: {
            condition: '',
            icdCode: '',
            treatment: ''
        },
        seenBy: 'Dr. Smith',
        medications: [{ problem: '', medicine: '', dosage: '', doseTime: 'Select', frequency: 'Select', duration: 'Select', status: 'Inactive' }],
        followUp: '',
        totalCost: '',
        amountPaid: '',
        balance: ''
    });

    useEffect(() => {
        const p = patients.find(x => x.id === patientId);
        if (p) {
            setPatient(p);
            setFormData(prev => ({ ...prev, patientId: p.id, patientName: p.name }));
        }
    }, [patientId]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleVitalChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            vitals: { ...prev.vitals, [field]: value }
        }));
    };

    const handleDiagnosisChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            diagnosis: { ...prev.diagnosis, [field]: value }
        }));
    };

    const handleMedicationChange = (index, field, value) => {
        const newMeds = [...formData.medications];
        newMeds[index][field] = value;
        setFormData(prev => ({ ...prev, medications: newMeds }));
    };

    const addMedication = () => {
        setFormData(prev => ({
            ...prev,
            medications: [...prev.medications, { problem: '', medicine: '', dosage: '', doseTime: 'Select', frequency: 'Select', duration: 'Select', status: 'Inactive' }]
        }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSave = () => {
        console.log('Saving Visit:', formData);
        navigate(`/start-visit/${patientId}/0`);
    };

    return (
        <div className="nv-container fade-in">
            <div className="nv-header">
                <h1>New Visit</h1>
            </div>

            <div className="nv-content">
                {step === 1 && (
                    <div className="nv-step-content fade-in">
                        <div className="nv-field-group">
                            <label>Visit Type <span>*</span></label>
                            <select value={formData.visitType} onChange={e => handleInputChange('visitType', e.target.value)}>
                                {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="nv-field-group">
                            <label>Patient ID</label>
                            <input type="text" placeholder="Optional for Emergency" value={formData.patientId} readOnly />
                        </div>

                        <div className="nv-field-group">
                            <label>Patient Name</label>
                            <input type="text" placeholder="Optional for Emergency" value={formData.patientName} readOnly />
                        </div>

                        <div className="nv-field-group">
                            <label>Chief Complaints</label>
                            <textarea
                                placeholder="Describe the main complaints"
                                value={formData.chiefComplaints}
                                onChange={e => handleInputChange('chiefComplaints', e.target.value)}
                            />
                        </div>

                        <div className="nv-section-header">
                            <div className="nv-section-line"></div>
                            <span className="nv-section-title">Vitals</span>
                        </div>

                        <div className="nv-vitals-grid">
                            <div className="nv-vital-field">
                                <label>Height</label>
                                <div className="nv-vital-input-wrap">
                                    <input type="text" placeholder="0.0" value={formData.vitals.height} onChange={e => handleVitalChange('height', e.target.value)} />
                                    <span>ft</span>
                                </div>
                            </div>
                            <div className="nv-vital-field">
                                <label>RR</label>
                                <div className="nv-vital-input-wrap">
                                    <input type="text" placeholder="0" value={formData.vitals.rr} onChange={e => handleVitalChange('rr', e.target.value)} />
                                    <span>bpm</span>
                                </div>
                            </div>
                            <div className="nv-vital-field">
                                <label>Weight</label>
                                <div className="nv-vital-input-wrap">
                                    <input type="text" placeholder="0.0" value={formData.vitals.weight} onChange={e => handleVitalChange('weight', e.target.value)} />
                                    <span>kg</span>
                                </div>
                            </div>
                            <div className="nv-vital-field">
                                <label>Oxygen%</label>
                                <div className="nv-vital-input-wrap">
                                    <input type="text" placeholder="0.0" value={formData.vitals.oxygen} onChange={e => handleVitalChange('oxygen', e.target.value)} />
                                    <span>%</span>
                                </div>
                            </div>
                            <div className="nv-vital-field">
                                <label>Blood pressure</label>
                                <div className="nv-vital-input-wrap">
                                    <input type="text" placeholder="120/80" value={formData.vitals.bp} onChange={e => handleVitalChange('bp', e.target.value)} />
                                </div>
                            </div>
                            <div className="nv-vital-field">
                                <label>Temperature</label>
                                <div className="nv-vital-input-wrap">
                                    <input type="text" placeholder="98.6" value={formData.vitals.temp} onChange={e => handleVitalChange('temp', e.target.value)} />
                                    <span>F</span>
                                </div>
                            </div>
                            <div className="nv-vital-field">
                                <label>Pulse</label>
                                <div className="nv-vital-input-wrap">
                                    <input type="text" placeholder="0" value={formData.vitals.pulse} onChange={e => handleVitalChange('pulse', e.target.value)} />
                                    <span>bpm</span>
                                </div>
                            </div>
                        </div>

                        <div className="nv-field-group">
                            <label>Notes</label>
                            <textarea
                                placeholder="Additional notes..."
                                value={formData.notes}
                                onChange={e => handleInputChange('notes', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="nv-step-content fade-in">
                        <div className="nv-field-group">
                            <label>Investigation Request</label>
                            <textarea
                                placeholder="Enter investigation requests..."
                                value={formData.investigationRequest}
                                onChange={e => handleInputChange('investigationRequest', e.target.value)}
                            />
                        </div>
                        <div className="nv-field-group">
                            <label>Investigation Result</label>
                            <textarea
                                placeholder="Enter investigation results..."
                                value={formData.investigationResult}
                                onChange={e => handleInputChange('investigationResult', e.target.value)}
                            />
                        </div>

                        <div className="nv-section-header">
                            <div className="nv-section-line"></div>
                            <span className="nv-section-title">Diagnosis</span>
                        </div>

                        <div className="nv-field-group">
                            <label>Condition</label>
                            <input
                                type="text"
                                placeholder="Search condition (e.g. Asthma, Diabetes)"
                                value={formData.diagnosis.condition}
                                onChange={e => handleDiagnosisChange('condition', e.target.value)}
                            />
                        </div>

                        <div className="nv-field-group">
                            <label>ICD Code</label>
                            <input
                                type="text"
                                placeholder="Search ICD Code"
                                value={formData.diagnosis.icdCode}
                                onChange={e => handleDiagnosisChange('icdCode', e.target.value)}
                            />
                        </div>

                        <div className="nv-field-group">
                            <label>Treatment</label>
                            <textarea
                                placeholder="Enter treatment plan..."
                                value={formData.diagnosis.treatment}
                                onChange={e => handleDiagnosisChange('treatment', e.target.value)}
                            />
                        </div>

                        <div className="nv-field-group">
                            <label>Seen by</label>
                            <select value={formData.seenBy} onChange={e => handleInputChange('seenBy', e.target.value)}>
                                {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="nv-step-content fade-in">
                        <div className="nv-med-history-card">
                            <h3>Medication History</h3>
                            <div className="nv-med-table-wrap">
                                <table className="nv-med-table">
                                    <thead>
                                        <tr>
                                            <th>Problem</th>
                                            <th>Medicine</th>
                                            <th>Dosage</th>
                                            <th>Dose Time</th>
                                            <th>Frequency</th>
                                            <th>Duration</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.medications.map((med, idx) => (
                                            <tr key={idx}>
                                                <td><input type="text" placeholder="e.g. Hypertension" value={med.problem} onChange={e => handleMedicationChange(idx, 'problem', e.target.value)} /></td>
                                                <td><input type="text" placeholder="e.g. Amlodipine" value={med.medicine} onChange={e => handleMedicationChange(idx, 'medicine', e.target.value)} /></td>
                                                <td><div className="nv-dose-input">
                                                    <input type="text" placeholder="5" value={med.dosage} onChange={e => handleMedicationChange(idx, 'dosage', e.target.value)} />
                                                    <span>mg</span>
                                                </div></td>
                                                <td><select value={med.doseTime} onChange={e => handleMedicationChange(idx, 'doseTime', e.target.value)}>
                                                    <option>Select</option><option>Morning</option><option>Night</option>
                                                </select></td>
                                                <td><select value={med.frequency} onChange={e => handleMedicationChange(idx, 'frequency', e.target.value)}>
                                                    <option>Select</option><option>Once Daily</option><option>Twice Daily</option>
                                                </select></td>
                                                <td><select value={med.duration} onChange={e => handleMedicationChange(idx, 'duration', e.target.value)}>
                                                    <option>Select</option><option>5 Days</option><option>10 Days</option>
                                                </select></td>
                                                <td><button className={`nv-status-btn ${med.status.toLowerCase()}`}>{med.status}</button></td>
                                                <td><button className="nv-add-btn" onClick={addMedication}>+</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="nv-step-content fade-in">
                        <div className="nv-field-group">
                            <label>Follow-up Appointment</label>
                            <input type="date" value={formData.followUp} onChange={e => handleInputChange('followUp', e.target.value)} />
                        </div>
                        <div className="nv-field-group">
                            <label>Total Cost</label>
                            <input type="text" placeholder="0.00" value={formData.totalCost} onChange={e => handleInputChange('totalCost', e.target.value)} />
                        </div>
                        <div className="nv-field-group">
                            <label>Amount Paid</label>
                            <input type="text" placeholder="0.00" value={formData.amountPaid} onChange={e => handleInputChange('amountPaid', e.target.value)} />
                        </div>
                        <div className="nv-field-group">
                            <label>Balance Amount</label>
                            <input type="text" placeholder="0.00" value={formData.balance} onChange={e => handleInputChange('balance', e.target.value)} />
                        </div>

                        <div className="nv-footer-actions">
                            <button className="btn btn-save" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="nv-navigation">
                {step > 1 && (
                    <button className="btn btn-prev" onClick={prevStep}>Previous</button>
                )}
                <div className="nv-steps-indicator">
                    {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className={`nv-step-dot ${step === idx ? 'active' : ''}`} />
                    ))}
                </div>
                {step < 4 ? (
                    <button className="btn btn-next" onClick={nextStep}>Next</button>
                ) : (
                    <div style={{ width: '100px' }}></div>
                )}
            </div>
        </div>
    );
}

export default NewVisit;

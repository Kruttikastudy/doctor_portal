import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './NewVisit.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const VISIT_TYPES = ['Emergency Visit', 'Routine Checkup', 'Follow-up', 'Consultation'];
const DOCTORS = ['Dr. Smith', 'Dr. Jones', 'Dr. Taylor'];

function NewVisit() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [patient, setPatient] = useState(null);
    const [latestVisit, setLatestVisit] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [formData, setFormData] = useState({
        visit_type: 'Routine Checkup',
        patient_id: patientId,
        chief_complaints: '',
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
        seen_by: 'Dr. Smith',
        medications: [{ problem: '', medicine: '', dosage: '', doseTime: 'Morning', frequency: 'Once Daily', duration: '5 Days', status: 'Active' }],
        follow_up: '',
        costs: {
            total: '',
            paid: '',
            balance: ''
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Patient
                const pRes = await fetch(`${API_URL}/patients/${patientId}`);
                const pData = await pRes.json();
                if (pRes.ok) setPatient(pData);

                // Fetch latest visit to pre-fill medications
                const vRes = await fetch(`${API_URL}/visits/${patientId}`);
                const vData = await vRes.json();
                if (vRes.ok && vData.length > 0) {
                    const latest = vData[0];
                    setLatestVisit(latest);
                    // Pre-fill active meds from the latest visit
                    const activeMeds = latest.medications?.filter(m => m.status === 'Active') || [];
                    if (activeMeds.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            medications: activeMeds.map(m => ({ ...m, _id: undefined })) // Remove ID to avoid conflict
                        }));
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, [patientId]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCostChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            costs: { ...prev.costs, [field]: value }
        }));
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

        if (field === 'condition' || field === 'icdCode') {
            handleICDSearch(value);
        }
    };

    const handleICDSearch = async (query) => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        setShowResults(true);

        try {
            const res = await fetch(`${API_URL}/icd/search?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data);
            }
        } catch (err) {
            console.error('Error searching ICD:', err);
        } finally {
            setIsSearching(false);
        }
    };

    const selectCondition = (item) => {
        setFormData(prev => ({
            ...prev,
            diagnosis: {
                ...prev.diagnosis,
                condition: item.condition,
                icdCode: item.icd_code
            }
        }));
        setShowResults(false);
    };

    const handleMedicationChange = (index, field, value) => {
        const newMeds = [...formData.medications];
        newMeds[index][field] = value;
        setFormData(prev => ({ ...prev, medications: newMeds }));
    };

    const toggleMedStatus = (index) => {
        const newMeds = [...formData.medications];
        newMeds[index].status = newMeds[index].status === 'Active' ? 'Discontinued' : 'Active';
        setFormData(prev => ({ ...prev, medications: newMeds }));
    };

    const addMedication = () => {
        setFormData(prev => ({
            ...prev,
            medications: [...prev.medications, { problem: '', medicine: '', dosage: '', doseTime: 'Morning', frequency: 'Once Daily', duration: '5 Days', status: 'Active' }]
        }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSave = async () => {
        try {
            const res = await fetch(`${API_URL}/visits`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                navigate(`/start-visit/${patientId}`);
            } else {
                const err = await res.json();
                alert('Error saving visit: ' + err.message);
            }
        } catch (err) {
            console.error('Error:', err);
        }
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
                            <select value={formData.visit_type} onChange={e => handleInputChange('visit_type', e.target.value)}>
                                {VISIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="nv-field-group">
                            <label>Patient ID</label>
                            <input type="text" value={patient?._id || ''} readOnly />
                        </div>

                        <div className="nv-field-group">
                            <label>Patient Name</label>
                            <input type="text" value={patient ? `${patient.name?.first} ${patient.name?.last}` : ''} readOnly />
                        </div>

                        <div className="nv-field-group">
                            <label>Chief Complaints</label>
                            <textarea
                                placeholder="Describe the main complaints"
                                value={formData.chief_complaints}
                                onChange={e => handleInputChange('chief_complaints', e.target.value)}
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
                            <div className="nv-search-container">
                                <input
                                    type="text"
                                    placeholder="Search condition (e.g. Asthma, Diabetes)"
                                    value={formData.diagnosis.condition}
                                    onChange={e => handleDiagnosisChange('condition', e.target.value)}
                                    onFocus={() => formData.diagnosis.condition.length >= 2 && setShowResults(true)}
                                />
                                {showResults && (
                                    <div className="nv-search-results">
                                        {isSearching ? (
                                            <div className="nv-searching-loader">Searching database...</div>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.map((item, idx) => (
                                                <div key={idx} className="nv-search-item" onClick={() => selectCondition(item)}>
                                                    <span className="icd-code-tag">{item.icd_code}</span>
                                                    <span className="condition-text">{item.condition}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="nv-no-results">No matches found in PostgreSQL</div>
                                        )}
                                    </div>
                                )}
                            </div>
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
                            <select value={formData.seen_by} onChange={e => handleInputChange('seen_by', e.target.value)}>
                                {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="nv-step-content fade-in">
                        <div className="nv-med-history-card">
                            <h3>Prescribe Medication</h3>
                            <p className="nv-tip">Tip: Click status to Discontinue a medication.</p>
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
                                                    <option>Morning</option><option>Night</option><option>Morning & Night</option>
                                                </select></td>
                                                <td><select value={med.frequency} onChange={e => handleMedicationChange(idx, 'frequency', e.target.value)}>
                                                    <option>Once Daily</option><option>Twice Daily</option><option>Thrice Daily</option>
                                                </select></td>
                                                <td><select value={med.duration} onChange={e => handleMedicationChange(idx, 'duration', e.target.value)}>
                                                    <option>5 Days</option><option>10 Days</option><option>15 Days</option><option>30 Days</option>
                                                </select></td>
                                                <td><button onClick={() => toggleMedStatus(idx)} className={`nv-status-btn ${med.status.toLowerCase()}`}>{med.status}</button></td>
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
                            <input type="date" value={formData.follow_up} onChange={e => handleInputChange('follow_up', e.target.value)} />
                        </div>
                        <div className="nv-field-group">
                            <label>Total Cost</label>
                            <input type="text" placeholder="0.00" value={formData.costs.total} onChange={e => handleCostChange('total', e.target.value)} />
                        </div>
                        <div className="nv-field-group">
                            <label>Amount Paid</label>
                            <input type="text" placeholder="0.00" value={formData.costs.paid} onChange={e => handleCostChange('paid', e.target.value)} />
                        </div>
                        <div className="nv-field-group">
                            <label>Balance Amount</label>
                            <input type="text" placeholder="0.00" value={formData.costs.balance} onChange={e => handleCostChange('balance', e.target.value)} />
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

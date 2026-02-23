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

    useEffect(() => {
        fetch(`${API_URL}/patients`)
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(p => ({
                    id: p._id,
                    name: `${p.name.first} ${p.name.last}`,
                    email: p.contact_info.email,
                    contact: `+${p.contact_info.mobile.code} ${p.contact_info.mobile.number}`,
                    status: p.status
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
                <button className="image-add-doctor-action-btn">Add Patient</button>
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
                                            <button className="appt-action-btn appt-start-btn" onClick={() => navigate(`/start-visit/${patient.id}/0`)}>View</button>
                                            <button className="appt-action-btn appt-edit-btn">Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Patients;

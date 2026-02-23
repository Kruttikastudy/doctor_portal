import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { appointments as mockAppointments } from '../data/mockData';
import './Appointments.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SPECIALTIES = ['All Fields', 'Cardiology', 'General', 'Orthopedics', 'Allergy', 'Dermatology', 'Pulmonology'];

function Appointments() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All Fields');
    const [selectedDate, setSelectedDate] = useState('');
    const [apptData, setApptData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectAll, setSelectAll] = useState(false);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/appointments`)
            .then(res => res.json())
            .then(data => {
                const results = Array.isArray(data) ? data : [];
                const formatted = results.map(a => ({
                    id: a._id,
                    patientId: a.patient_id || 'N/A',
                    patientName: `${a.patient_name?.first || ''} ${a.patient_name?.last || ''}`.trim() || 'Unknown',
                    date: a.appointment_date || 'N/A',
                    time: a.appointment_time || 'N/A',
                    reason: a.reason_for_appointment || 'N/A',
                    status: a.status || 'Pending',
                    specialty: a.appointment_type || 'General'
                }));
                setApptData(formatted);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching appointments:', err);
                setLoading(false);
            });
    }, []);

    const filtered = apptData.filter((a) => {
        // Handle MM-DD-YYYY date parsing
        const [m, d, y] = a.date.split('-').map(Number);
        const apptDate = new Date(y, m - 1, d);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isPending = a.status === 'Pending';
        const isFutureOrToday = apptDate >= today;

        const matchSpec = selectedSpecialty === 'All Fields' || a.specialty === selectedSpecialty;
        const matchSearch = a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.reason.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDate = !selectedDate || a.date === selectedDate;

        return isPending && isFutureOrToday && matchSpec && matchSearch && matchDate;
    });

    const totalAppts = apptData.length;
    const pendingCount = apptData.filter(a => a.status === 'Pending').length;
    const cancelledCount = apptData.filter(a => a.status === 'Cancelled').length;

    const handleComplete = (id) => {
        fetch(`${API_URL}/appointments/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Completed' })
        })
            .then(res => res.json())
            .then(updated => {
                setApptData(prev =>
                    prev.map(a => a.id === id ? { ...a, status: 'Completed' } : a)
                );
            })
            .catch(err => console.error('Error updating appointment:', err));
    };

    const toggleSelectAll = () => {
        if (selectAll) { setSelected([]); } else { setSelected(filtered.map(a => a.id)); }
        setSelectAll(!selectAll);
    };

    const toggleSelect = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    const getStatusBadge = (status) => {
        const cls = { Pending: 'scheduled', Completed: 'completed', Cancelled: 'cancelled' }[status] || '';
        return <span className={`status-badge ${cls}`}>{status}</span>;
    };

    return (
        <div className="image-appointments-page fade-in">
            {/* Top controls row */}
            <div className="image-appointments-controls-row">
                {/* Search + specialty pill */}
                <div className="image-search-container">
                    <div className="specialization-select-box">
                        <select
                            value={selectedSpecialty}
                            onChange={e => setSelectedSpecialty(e.target.value)}
                        >
                            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <input
                        type="text"
                        className="image-search-input"
                        placeholder="Search all fields..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <button className="image-search-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                </div>

                <button className="image-add-doctor-action-btn" onClick={() => navigate('/add-patient')}>Add Appointment</button>

                {/* Date filter */}
                <div className="filter-item-date-row">
                    <label>Date</label>
                    <input
                        type="date"
                        className="image-date-filter-input"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Stat cards */}
            <div className="appt-stats-row">
                <div className="appt-stat-card">
                    <span>Total Appointments</span>
                    <span className="stat-num">{totalAppts}</span>
                </div>
                <div className="appt-stat-card">
                    <span>Pending</span>
                    <span className="stat-num">{pendingCount}</span>
                </div>
                <div className="appt-stat-card">
                    <span>Cancelled</span>
                    <span className="stat-num">{cancelledCount}</span>
                </div>
            </div>

            {/* Table */}
            <div className="image-doctors-list-section">
                <div className="image-list-title-header">
                    <h2>Appointment Details</h2>
                    <span className="image-total-count-pill">Total Appointments : {filtered.length}</span>
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
                                <th>Patient Details</th>
                                <th>Date &amp; Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', color: '#999', padding: '30px' }}>
                                        Loading appointments...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', color: '#999', padding: '30px' }}>
                                        No appointments found
                                    </td>
                                </tr>
                            ) : filtered.map(appt => (
                                <tr key={appt.id}>
                                    <td>
                                        <div className="white-circle-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(appt.id)}
                                                onChange={() => toggleSelect(appt.id)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="name-avatar-cell">
                                            <div className="image-table-avatar">
                                                <div className="image-table-avatar-placeholder">
                                                    {getInitials(appt.patientName)}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{appt.patientName}</div>
                                                <div style={{ fontSize: '12px', color: '#999' }}>{appt.patientId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>{appt.date}</div>
                                        <div style={{ fontSize: '12px', color: '#999' }}>{appt.time}</div>
                                    </td>
                                    <td>{appt.reason}</td>
                                    <td>{getStatusBadge(appt.status)}</td>
                                    <td>
                                        <div className="image-row-actions">
                                            <button
                                                className={`appt-action-btn appt-start-btn ${appt.patientId === 'N/A' ? 'disabled' : ''}`}
                                                onClick={() => {
                                                    if (appt.patientId === 'N/A') {
                                                        alert('This appointment is not linked to a patient record. Please edit or re-add.');
                                                        return;
                                                    }
                                                    navigate(`/start-visit/${appt.patientId}/${appt.id}`);
                                                }}
                                            >
                                                Start Visit
                                            </button>
                                            {appt.status !== 'Completed' && (
                                                <button
                                                    className="appt-action-btn appt-complete-btn"
                                                    onClick={() => handleComplete(appt.id)}
                                                >
                                                    Complete
                                                </button>
                                            )}
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

export default Appointments;

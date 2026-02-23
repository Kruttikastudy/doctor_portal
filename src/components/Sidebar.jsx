import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CalendarCheck, Users, Settings, LogOut, UserCircle } from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        setIsOpen(false);
        navigate('/');
    };

    const navItems = [
        { to: '/appointments', label: 'Appointments', icon: CalendarCheck },
        { to: '/patients', label: 'Patients', icon: Users },
        { to: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile hamburger header */}
            <div className="mobile-header">
                <div className="mobile-logo-box">
                    <div className="mobile-logo-icon">
                        <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H8v-2h4v2zm4-4H8v-2h8v2zm0-4H8V7h8v2z" />
                        </svg>
                    </div>
                    <span className="mobile-logo-text">SSPD EMR</span>
                </div>
                <div className="hamburger-menu" onClick={() => setIsOpen(!isOpen)}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            </div>

            {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />}

            <div className={`image-sidebar ${isOpen ? 'mobile-open' : ''}`}>
                {/* White top box with logo */}
                <div className="sidebar-top-white-box">
                    <div className="image-logo-container">
                        <div className="sidebar-logo-icon">
                            <svg viewBox="0 0 24 24" fill="#0288D1" width="42" height="42">
                                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H8v-2h4v2zm4-4H8v-2h8v2zm0-4H8V7h8v2z" />
                            </svg>
                        </div>
                        <span className="image-logo-text">SSPD EMR</span>
                    </div>
                </div>

                {/* Blue nav section */}
                <div className="sidebar-blue-section">
                    <nav className="image-sidebar-nav">
                        <div className="nav-group">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => isActive ? 'image-nav-item active' : 'image-nav-item'}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="nav-icon-lucide" size={20} />
                                    <span className="nav-text-label">{item.label}</span>
                                </NavLink>
                            ))}
                        </div>

                        <div className="sidebar-footer">
                            <div className="user-profile-mock">
                                <UserCircle size={38} className="user-avatar" />
                                <div className="user-info">
                                    <span className="user-name">Dr. Smith</span>
                                    <span className="user-role">General Physician</span>
                                </div>
                            </div>
                            <div className="sidebar-logout-container">
                                <button className="image-logout-btn-link" onClick={handleLogout}>
                                    <LogOut size={18} style={{ marginRight: '10px' }} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Sidebar;

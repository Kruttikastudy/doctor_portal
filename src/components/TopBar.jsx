import React from 'react';
import './TopBar.css';

function TopBar() {
    return (
        <div className="topbar-strip">
            <div className="topbar-right">
                {/* Bell icon */}
                <div className="topbar-icon-box" title="Notifications">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                </div>
                {/* Calendar icon */}
                <div className="topbar-icon-box" title="Schedule">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                </div>
                {/* Profile circle */}
                <div className="topbar-profile-circle" title="Profile">
                    <svg viewBox="0 0 24 24" fill="#0288D1" width="38" height="38">
                        <circle cx="12" cy="12" r="12" fill="#E3F2FD" />
                        <circle cx="12" cy="9" r="4" fill="#0288D1" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#0288D1" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default TopBar;

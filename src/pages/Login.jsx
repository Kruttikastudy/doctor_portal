import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin') {
            navigate('/appointments');
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="login-container-split">
            {/* Animated ECG background */}
            <div className="login-left-image-section">
                <svg className="ecg-bg" viewBox="0 0 1440 400" preserveAspectRatio="none">
                    <polyline
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="3"
                        points="0,200 100,200 140,200 160,80 180,320 200,200 240,200 260,200 280,100 300,300 320,200 1440,200"
                    />
                    <polyline
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="2"
                        points="0,250 200,250 260,250 280,130 300,370 320,250 380,250 400,250 420,150 440,350 460,250 1440,250"
                    />
                </svg>
            </div>

            {/* Login card */}
            <div className="login-right-form-section">
                <div className="login-content-box">
                    <div className="login-logo-container">
                        <div className="login-logo-icon">
                            <svg viewBox="0 0 24 24" fill="white" width="48" height="48">
                                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H8v-2h4v2zm4-4H8v-2h8v2zm0-4H8V7h8v2z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="image-login-title">SSPD EMR</h1>

                    <form className="image-style-form" onSubmit={handleLogin}>
                        <div className="image-form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                autoComplete="username"
                            />
                        </div>
                        <div className="image-form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                autoComplete="current-password"
                            />
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <div className="login-btn-container">
                            <button type="submit" className="image-login-btn">Log in</button>
                        </div>
                    </form>

                    <p className="login-hint-text">Demo Access: admin / admin</p>
                </div>
            </div>
        </div>
    );
}

export default Login;

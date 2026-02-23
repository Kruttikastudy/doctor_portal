import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './Layout.css';

function Layout() {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;

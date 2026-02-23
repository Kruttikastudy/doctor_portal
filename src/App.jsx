import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import StartVisit from './pages/StartVisit';
import NewVisit from './pages/NewVisit';
import Settings from './pages/Settings';
import AddAppointment from './pages/AddAppointment';
import AddPatient from './pages/AddPatient';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="appointments" element={<Appointments />} />
          <Route path="patients" element={<Patients />} />
          <Route path="start-visit/:patientId/:appointmentId?" element={<StartVisit />} />
          <Route path="new-visit/:patientId" element={<NewVisit />} />
          <Route path="settings" element={<Settings />} />
          <Route path="add-appointment" element={<AddAppointment />} />
          <Route path="add-patient" element={<AddPatient />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

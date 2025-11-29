import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import MarkAttendance from './pages/MarkAttendance';
import MyHistory from './pages/MyHistory';
import AllAttendance from './pages/AllAttendance';
import Reports from './pages/Reports';

const Profile = () => <div>Profile Page</div>;

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
                        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                        <Route path="/mark-attendance" element={<MarkAttendance />} />
                        <Route path="/my-history" element={<MyHistory />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
                        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                        <Route path="/all-attendance" element={<AllAttendance />} />
                        <Route path="/reports" element={<Reports />} />
                    </Route>

                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;

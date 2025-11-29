import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ManagerDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/manager');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Loading dashboard...</div>;
    }

    if (!stats) {
        return <div className="text-center mt-10">Error loading dashboard data.</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <p className="text-gray-500 text-sm">Total Employees</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalEmployees}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <p className="text-gray-500 text-sm">Present Today</p>
                    <p className="text-3xl font-bold text-green-600">{stats.presentCount}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <p className="text-gray-500 text-sm">Absent Today</p>
                    <p className="text-3xl font-bold text-red-600">{stats.absentCount}</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Late Arrivals Today</h3>
                {stats.lateArrivals.length === 0 ? (
                    <p className="text-gray-500">No late arrivals today.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In Time</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stats.lateArrivals.map((record) => (
                                    <tr key={record._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {record.user ? record.user.name : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(record.checkInTime).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManagerDashboard;

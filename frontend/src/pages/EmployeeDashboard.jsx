import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { Link } from 'react-router-dom';

function EmployeeDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/employee');
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
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600">Today's Status:</p>
                        <p className={`text-xl font-bold ${stats.todayStatus === 'Checked In' ? 'text-green-600' :
                            stats.todayStatus === 'Checked Out' ? 'text-blue-600' : 'text-red-600'
                            }`}>
                            {stats.todayStatus}
                        </p>
                    </div>
                    <Link to="/mark-attendance" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        {stats.todayStatus === 'Not Checked In' ? 'Check In Now' : 'Manage Attendance'}
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Present Days</p>
                    <p className="text-2xl font-bold">{stats.stats.present}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Absent Days</p>
                    <p className="text-2xl font-bold">{stats.stats.absent}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Late Days</p>
                    <p className="text-2xl font-bold">{stats.stats.late}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total Hours</p>
                    <p className="text-2xl font-bold">{stats.stats.totalHours}</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.recentActivity.map((record) => (
                                <tr key={record._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'present' ? 'bg-green-100 text-green-800' :
                                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                                                record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-orange-100 text-orange-800'
                                            }`}>
                                            {record.status}
                                        </span>
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

export default EmployeeDashboard;

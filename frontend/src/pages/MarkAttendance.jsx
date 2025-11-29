import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIn, checkOut, getTodayStatus, reset } from '../store/attendanceSlice';
import { format } from 'date-fns';

function MarkAttendance() {
    const dispatch = useDispatch();
    const { todayStatus, isLoading, isError, message } = useSelector(
        (state) => state.attendance
    );
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        dispatch(getTodayStatus());

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            alert(message);
            dispatch(reset());
        }
    }, [isError, message, dispatch]);

    const handleCheckIn = () => {
        dispatch(checkIn());
    };

    const handleCheckOut = () => {
        dispatch(checkOut());
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Mark Attendance</h1>
            <p className="text-gray-500 mb-8">{format(currentTime, 'PPPP')}</p>

            <div className="text-5xl font-mono mb-10 text-gray-800">
                {format(currentTime, 'HH:mm:ss')}
            </div>

            <div className="space-y-4">
                {(!todayStatus || !todayStatus.checkInTime) && (
                    <button
                        onClick={handleCheckIn}
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition hover:scale-105 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : 'CHECK IN'}
                    </button>
                )}

                {todayStatus && todayStatus.checkInTime && !todayStatus.checkOutTime && (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            You checked in at {new Date(todayStatus.checkInTime).toLocaleTimeString()}
                        </div>
                        <button
                            onClick={handleCheckOut}
                            disabled={isLoading}
                            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition hover:scale-105 disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : 'CHECK OUT'}
                        </button>
                    </div>
                )}

                {todayStatus && todayStatus.checkOutTime && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                        You have completed your attendance for today.<br />
                        Checked Out at {new Date(todayStatus.checkOutTime).toLocaleTimeString()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MarkAttendance;

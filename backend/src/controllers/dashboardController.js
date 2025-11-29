const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { format, subDays } = require('date-fns');

const getEmployeeStats = async (req, res) => {
    const userId = req.user._id;
    const today = format(new Date(), 'yyyy-MM-dd');
    const startOfMonth = format(new Date(), 'yyyy-MM-01');

    const todayAttendance = await Attendance.findOne({ user: userId, date: today });

    const monthAttendance = await Attendance.find({
        user: userId,
        date: { $gte: startOfMonth }
    });

    const stats = {
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        totalHours: 0
    };

    monthAttendance.forEach(record => {
        if (record.status === 'present') stats.present++;
        if (record.status === 'absent') stats.absent++;
        if (record.status === 'late') stats.late++;
        if (record.status === 'half-day') stats.halfDay++;
        stats.totalHours += record.totalHours;
    });

    stats.totalHours = parseFloat(stats.totalHours.toFixed(2));

    const recentActivity = await Attendance.find({ user: userId })
        .sort({ date: -1 })
        .limit(5);

    res.json({
        todayStatus: todayAttendance ? (todayAttendance.checkOutTime ? 'Checked Out' : 'Checked In') : 'Not Checked In',
        stats,
        recentActivity
    });
};

const getManagerStats = async (req, res) => {
    const today = format(new Date(), 'yyyy-MM-dd');

    const totalEmployees = await User.countDocuments({ role: 'employee' });

    const todayAttendance = await Attendance.find({ date: today });

    const presentCount = todayAttendance.filter(a => a.status !== 'absent').length;
    const absentCount = totalEmployees - presentCount;

    const lateArrivals = await Attendance.find({ date: today, status: 'late' }).populate('user', 'name');

    const departmentStats = {};

    res.json({
        totalEmployees,
        presentCount,
        absentCount,
        lateArrivals,
        departmentStats: []
    });
};

module.exports = { getEmployeeStats, getManagerStats };

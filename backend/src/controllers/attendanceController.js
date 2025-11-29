const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { startOfDay, endOfDay, format } = require('date-fns');

const checkIn = async (req, res) => {
    const userId = req.user._id;
    const today = format(new Date(), 'yyyy-MM-dd');

    const existingAttendance = await Attendance.findOne({
        user: userId,
        date: today,
    });

    if (existingAttendance) {
        return res
            .status(400)
            .json({ message: 'You have already checked in for today' });
    }

    const attendance = await Attendance.create({
        user: userId,
        date: today,
        checkInTime: new Date(),
        status: 'present',
    });

    const checkInTime = new Date();
    const lateThreshold = new Date();
    lateThreshold.setHours(9, 30, 0, 0);

    if (checkInTime > lateThreshold) {
        attendance.status = 'late';
        await attendance.save();
    }

    res.status(201).json(attendance);
};

const checkOut = async (req, res) => {
    const userId = req.user._id;
    const today = format(new Date(), 'yyyy-MM-dd');

    const attendance = await Attendance.findOne({ user: userId, date: today });

    if (!attendance) {
        return res
            .status(400)
            .json({ message: 'You have not checked in today' });
    }

    if (attendance.checkOutTime) {
        return res
            .status(400)
            .json({ message: 'You have already checked out today' });
    }

    attendance.checkOutTime = new Date();

    const duration = attendance.checkOutTime - attendance.checkInTime;
    const hours = duration / (1000 * 60 * 60);
    attendance.totalHours = parseFloat(hours.toFixed(2));

    if (hours < 4) {
        attendance.status = 'half-day';
    }

    await attendance.save();

    res.json(attendance);
};

const getMyHistory = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const count = await Attendance.countDocuments({ user: req.user._id });
    const attendance = await Attendance.find({ user: req.user._id })
        .sort({ date: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ attendance, page, pages: Math.ceil(count / pageSize) });
};

const getMySummary = async (req, res) => {
    const { month, year } = req.query;
    const userId = req.user._id;

    const dateRegex = new RegExp(`^${year}-${month}`);

    const attendance = await Attendance.find({
        user: userId,
        date: { $regex: dateRegex },
    });

    const summary = {
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        totalHours: 0,
    };

    attendance.forEach((record) => {
        if (record.status === 'present') summary.present++;
        if (record.status === 'absent') summary.absent++;
        if (record.status === 'late') summary.late++;
        if (record.status === 'half-day') summary.halfDay++;
        summary.totalHours += record.totalHours;
    });

    summary.totalHours = parseFloat(summary.totalHours.toFixed(2));

    res.json(summary);
};

const getTodayStatus = async (req, res) => {
    const userId = req.user._id;
    const today = format(new Date(), 'yyyy-MM-dd');

    const attendance = await Attendance.findOne({ user: userId, date: today });

    if (attendance) {
        res.json(attendance);
    } else {
        res.json(null);
    }
};

const getAllAttendance = async (req, res) => {
    const pageSize = 20;
    const page = Number(req.query.page) || 1;
    const { employeeId, date, status } = req.query;

    let query = {};

    if (employeeId) {
        const user = await User.findOne({ employeeId });
        if (user) query.user = user._id;
    }

    if (date) {
        query.date = date;
    }

    if (status) {
        query.status = status;
    }

    const count = await Attendance.countDocuments(query);
    const attendance = await Attendance.find(query)
        .populate('user', 'name email employeeId department')
        .sort({ date: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ attendance, page, pages: Math.ceil(count / pageSize) });
};

const getEmployeeAttendance = async (req, res) => {
    const attendance = await Attendance.find({ user: req.params.id }).sort({ date: -1 });
    res.json(attendance);
};

const getTeamSummary = async (req, res) => {
    const { from, to } = req.query;
    res.json({ message: 'Not fully implemented for this demo' });
};

const exportAttendance = async (req, res) => {
    const { from, to, employeeId } = req.query;

    let query = {};
    if (from && to) {
        query.date = { $gte: from, $lte: to };
    }

    if (employeeId) {
        const user = await User.findOne({ employeeId });
        if (user) query.user = user._id;
    }

    const attendance = await Attendance.find(query).populate('user', 'name employeeId department');

    const fields = ['Date', 'Employee ID', 'Name', 'Department', 'Check In', 'Check Out', 'Status', 'Total Hours'];
    const csv = attendance.map(row => {
        return [
            row.date,
            row.user.employeeId,
            row.user.name,
            row.user.department,
            row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString() : '-',
            row.checkOutTime ? new Date(row.checkOutTime).toLocaleTimeString() : '-',
            row.status,
            row.totalHours
        ].join(',');
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance.csv');
    res.send(fields.join(',') + '\n' + csv.join('\n'));
};

const getTodayStatusAll = async (req, res) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const attendance = await Attendance.find({ date: today }).populate('user', 'name employeeId');
    res.json(attendance);
}


module.exports = {
    checkIn,
    checkOut,
    getMyHistory,
    getMySummary,
    getTodayStatus,
    getAllAttendance,
    getEmployeeAttendance,
    getTeamSummary,
    exportAttendance,
    getTodayStatusAll
};

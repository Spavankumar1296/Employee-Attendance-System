const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        date: {
            type: String,
            required: true,
        },
        checkInTime: {
            type: Date,
        },
        checkOutTime: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'half-day'],
            default: 'absent',
        },
        totalHours: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;

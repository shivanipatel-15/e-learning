const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentAttendanceSchema = new Schema({
    student_id: {
        type: Schema.Types.ObjectId,
        ref: 'exam'
    },
    teacher_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    subject: {
        type: String
    },
    status: {
        enum: ['present', 'absent', 'late']
    },
    login_time: {
        type: String
    },
    logout_time: {
        type: String
    },
    period_time: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('student_attendance', StudentAttendanceSchema)

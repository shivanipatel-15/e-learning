const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExamSubmissionSchema = new Schema({
    exam_id: {
        type: Schema.Types.ObjectId,
        ref: 'exam'
    },
    teacher_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    student_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    attachment: {
        type: String,
    },
    obtain_marks: {
        type: Number
    }
}, { timestamps: true })

module.exports = mongoose.model('exam_answer_sheet', ExamSubmissionSchema)

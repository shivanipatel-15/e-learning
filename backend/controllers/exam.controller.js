const moment = require('moment')
const {
    successResponse,
    errorResponse,
    catchResponse,
    getObjectId, 
    isEmpty
} = require('../utility')
const Exam = require('../models/exam.model')
const User = require('../models/user.model')
const { examValidation, editExamValidation, removeExamValidation } = require('./validation/exam.validation')
const { uploadMediaToS3 } = require('../utility/upload')
const ExamSubmission = require('../models/exam_submission.model')

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/exam/add (Add New Assignment)
 * @access protected
 * @returns {*} result
 */
 exports.addExam = async function (req, res) {
    const { error, isValid } = examValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const { subject, description, standard, division, exam_start, exam_end, attachment, exam_type, test_or_exam } = req.body
        const examData = { 
            subject,
            description,
            standard,
            division,
            attachment,
            exam_type,
            exam_start,
            exam_end,
            test_or_exam,
            teacher_id: req._user.id
        }

        if (exam_type === 'pdf') {
            if (!isEmpty(req.files.attachment)) {
                const attachment = req.files.attachment
                const file = attachment.data
                const mimetype = attachment.mimetype
                const file_name = attachment.name
                const uploadPath = `school/exam/${req._user.id}`

                try {
                    const uploadAttachment = await uploadMediaToS3(file, mimetype, file_name, uploadPath)
                    if (uploadAttachment.success != true) {
                        let uploadError = {
                            success: true,
                            error: uploadAttachment.response.code,
                            message: uploadAttachment.message
                        }
                        return errorResponse(res, uploadError, uploadAttachment.message != null ? uploadAttachment.message : 'Error! Attachment not Upload.', 200)
                    }
                    examData.attachment = uploadAttachment.response.Key
                } catch (err) {
                    console.log(err)
                    return errorResponse(res, {}, 'Attachment not uploaded on s3', 200)
                }
            }
        }

        const addExam = await new Exam(examData).save()

        if (addExam == null) {
            return errorResponse(res, {}, 'Something went wrong! Exam not add', 400)
        }

        return successResponse(res, { }, 'Exam Successfully added', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/exam/list (Exam Listing)
 * @access protected
 * @returns {*} result
 */
 exports.listExam = async function (req, res) {
    try {
        const { subject, standard, division } = req.body
        const { page } = req.query
        let where = {}

        if(req._user.type === 'teacher') {
            where.teacher_id = getObjectId(req._user.id)
        }

        if(req._user.type === 'student') {
            const user = await User.findById(getObjectId(req._user.id), 'standard division')
            where.standard = user.standard
            where.division = user.division
        }

        if ( standard && standard !== '') {
            where.standard = standard
        }

        if (division && division !== '') {
            where.division = division
        }
        
        const limit = 10
        const offset = (page - 1)*limit

        const lookup = {
            from: 'users',
            localField: 'teacher_id',
            foreignField: '_id',
            as: 'teacher'
        }
        const unwind = '$teacher'
        const getExam = await Exam.aggregate([
            { $match: where },
            { $sort: { createdAt: -1 } },
            { $skip: offset },
            { $limit: limit },
            { $lookup: lookup },
            { $unwind: unwind },
            { $project:  {
                    status: 1,
                    subject: 1,
                    description: 1,
                    standard: 1,
                    division: 1,
                    attachment: 1,
                    exam_type: 1,
                    exam_start: 1,
                    exam_end: 1,
                    teacher_id: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    test_or_exam: 1,
                    'teacher.first_name': 1,
                    'teacher.last_name': 1,
                    'teacher.email': 1,
                }
            }
        ])

        const response = {
            exam: getExam,
            s3_url: `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/`
        }

        return successResponse(res, response, 'Exams', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/exam/detail/:exam_id (Exam Listing)
 * @access protected
 * @returns {*} result
 */
 exports.detailExam = async function (req, res) {
    try {
        
        const { exam_id } = req.params
        let where = {
            _id: getObjectId(exam_id)
        }
        
        const teacherLookup = {
            from: 'users',
            localField: 'teacher_id',
            foreignField: '_id',
            as: 'teacher'
        }
        const unwind = '$teacher'

        const getExam = await Exam.aggregate([
            { $match: where },
            { $lookup: teacherLookup },
            { $unwind: unwind },
            { $project:  {
                    status: 1,
                    subject: 1,
                    description: 1,
                    standard: 1,
                    division: 1,
                    attachment: 1,
                    exam_type: 1,
                    exam_start: 1,
                    exam_end: 1,
                    teacher_id: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    test_or_exam: 1,
                    'teacher.first_name': 1,
                    'teacher.last_name': 1,
                    'teacher.email': 1,
                }
            }
        ])

        const response = {
            exam: getExam[0],
            s3_url: `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/`
        }

        return successResponse(res, response, 'Exam Detail', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/exam/submit-answer-sheet (Submit answer sheet)
 * @access protected
 * @returns {*} result
 */
 exports.submitAnswers = async function (req, res) {
    try {
        const { exam_id } = req.body
        const checkExam = await Exam.findById(getObjectId(exam_id))
        if(checkExam === null){
            return errorResponse(res, {}, 'Invalid Exam id', 400)
        }

        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const start = moment(checkExam.exam_start).format('YYYY-MM-DD HH:mm:ss')
        const end = moment(checkExam.exam_end).format('YYYY-MM-DD HH:mm:ss')
        if(now > start && now > end) {
            return errorResponse(res, {}, 'Sorry! You are late for submission. Exam is over', 400)
        }
        if(now < start && now < end) {
            return errorResponse(res, {}, 'You can not submit answer as Exam is not start yet.', 400)
        }

        const findAnswerWhere = {
            student_id: getObjectId(req._user.id),
            exam_id: getObjectId(exam_id)
        }

        const checkAnswer = await ExamSubmission.findOne(findAnswerWhere)

        if(checkAnswer !== null) {
            return errorResponse(res, {}, 'You already submitted answer sheet.', 400)
        }

        const answerSheet = {
            exam_id: exam_id,
            student_id: getObjectId(req._user.id),
            teacher_id: getObjectId(checkExam.teacher_id)
        }
        if (!isEmpty(req.files.attachment)) {
            const attachment = req.files.attachment
            const file = attachment.data
            const mimetype = attachment.mimetype
            const file_name = attachment.name
            const uploadPath = `school/exam/${req._user.id}/answer`

            try {
                const uploadAttachment = await uploadMediaToS3(file, mimetype, file_name, uploadPath)
                if (uploadAttachment.success != true) {
                    let uploadError = {
                        success: true,
                        error: uploadAttachment.response.code,
                        message: uploadAttachment.message
                    }
                    return errorResponse(res, uploadError, uploadAttachment.message != null ? uploadAttachment.message : 'Error! Attachment not Upload.', 400)
                }
                answerSheet.attachment = uploadAttachment.response.Key
            } catch (err) {
                return errorResponse(res, {}, 'Attachment not uploaded on s3', 400)
            }
        }

        const examAnswerSheet = await new ExamSubmission(answerSheet).save()

        if (examAnswerSheet == null) {
            return errorResponse(res, {}, 'Something went wrong! Exam not add', 400)
        }

        return successResponse(res, { }, 'Answer sheet successfully Submitted', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/exam/submissions/:exam_id (Exam Detail)
 * @access protected
 * @returns {*} result
 */
 exports.submissionsForExam = async function (req, res) {
    try {
        
        const { exam_id } = req.params
        let where = {
            exam_id: getObjectId(exam_id)
        }
        
        const lookup = {
            from: 'users',
            localField: 'student_id',
            foreignField: '_id',
            as: 'student'
        }
        const unwind = '$student'

        const getExamSubmission = await ExamSubmission.aggregate([
            { $match: where },
            { $lookup: lookup },
            { $unwind: unwind },
            { $project:  {
                    attachment: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'student.first_name': 1,
                    'student.last_name': 1,
                    'student.email': 1,
                    'student.roll_number': 1,
                    'student.sts_number': 1
                }
            },
            { $sort: { createdAt: -1 } }
        ])

        const response = {
            exam_answers: getExamSubmission,
            s3_url: `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/`
        }

        return successResponse(res, response, 'Exam Answer Sheet Listing', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/exam/edit (Add edit exam)
 * @access protected
 * @returns {*} result
 */
 exports.editExam = async function (req, res) {
    const { error, isValid } = editExamValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const { exam_id } = req.body
        const findExam = await Exam.findById(getObjectId(exam_id))
        if(findExam === null){
            return errorResponse(res, {}, 'No Exam found', 400)
        }

        const { subject, description, standard, division, exam_start, exam_end, attachment, exam_type, test_or_exam } = req.body
        findExam.subject = subject
        findExam.description = description
        findExam.standard = standard
        findExam.division = division
        findExam.attachment = attachment
        findExam.exam_type = exam_type
        findExam.exam_start = exam_start
        findExam.exam_end = exam_end
        findExam.test_or_exam = test_or_exam

        if (exam_type === 'pdf') {
            if (!isEmpty(req.files.attachment)) {
                const attachment = req.files.attachment
                const file = attachment.data
                const mimetype = attachment.mimetype
                const file_name = attachment.name
                const uploadPath = `school/exam/${req._user.id}`

                try {
                    const uploadAttachment = await uploadMediaToS3(file, mimetype, file_name, uploadPath)
                    if (uploadAttachment.success != true) {
                        let uploadError = {
                            success: true,
                            error: uploadAttachment.response.code,
                            message: uploadAttachment.message
                        }
                        return errorResponse(res, uploadError, uploadAttachment.message != null ? uploadAttachment.message : 'Error! Attachment not Upload.', 200)
                    }
                    findExam.attachment = uploadAttachment.response.Key
                } catch (err) {
                    console.log(err)
                    return errorResponse(res, {}, 'Attachment not uploaded on s3', 200)
                }
            }
        }

        await findExam.save()
        
        return successResponse(res, { }, 'Exam Successfully saved', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/exam/remove (Remove Exam)
 * @access protected
 * @returns {*} result
 */
 exports.removeExam = async function (req, res) {
    const { error, isValid } = removeExamValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const findExam = await Exam.findById(req.body.exam_id)
        if(findExam === null){
            return errorResponse(res, {}, 'No assignment found', 400)
        }
        // find assignment submissions
        await ExamSubmission.deleteMany({ exam_id: getObjectId(req.body.exam_id) })
        await Exam.deleteOne({ _id: getObjectId(req.body.exam_id) })
        
        return successResponse(res, { }, 'Exam Successfully Removed', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

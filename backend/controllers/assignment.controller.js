const moment = require('moment')
const {
    successResponse,
    errorResponse,
    catchResponse,
    isEmpty,
    getObjectId
} = require('../utility')
const Assignment = require('../models/assignment.model')
const User = require('../models/user.model')
const AssignmentSubmission = require('../models/assignment_submission.model')
const { assignmentValidation, editAssignmentValidation, removeAssignmentValidation } = require('./validation/assignment.validation')
const { uploadMediaToS3 }  = require('../utility/upload')

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/assignment/add (Add New Assignment)
 * @access protected
 * @returns {*} result
 */
exports.addAssignment = async function (req, res) {
    const { error, isValid } = assignmentValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const { subject, description, standard, division, submission_due, attachment, assignment_type } = req.body
        const assignmentData = { 
            subject,
            description,
            standard,
            division,
            submission_due,
            attachment,
            assignment_type,
            teacher_id: req._user.id
        }
        if (assignment_type === 'pdf') {
            if (!isEmpty(req.files.attachment)) {
                const attachment = req.files.attachment
                const file = attachment.data
                const mimetype = attachment.mimetype
                const file_name = attachment.name
                const uploadPath = `school/assignment/${req._user.id}`

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
                    assignmentData.attachment = uploadAttachment.response.Key
                } catch (err) {
                    console.log(err)
                    return errorResponse(res, {}, 'Attachment not uploaded on s3', 200)
                }
            }
        }

        const addAssignment = await new Assignment(assignmentData).save()

        if (addAssignment == null) {
            return errorResponse(res, {}, 'Something went wrong! Assignment not add', 400)
        }

        return successResponse(res, { }, 'Assignment Successfully add', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/assignment/list (Add New Assignment)
 * @access protected
 * @returns {*} result
 */
exports.listAssignment = async function (req, res) {
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
        const limit = 10
        const offset = (page - 1)*limit
        
        const lookup = {
            from: 'users',
            localField: 'teacher_id',
            foreignField: '_id',
            as: 'teacher'
        }
        const unwind = '$teacher'

        const getAssignment = await Assignment.aggregate([
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
                    assignment_type: 1,
                    submission_due: 1,
                    teacher_id: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'teacher.first_name': 1,
                    'teacher.last_name': 1,
                    'teacher.email': 1,
                }
            }
        ])

        const response = {
            assignment: getAssignment,
            s3_url: `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/`
        }
        return successResponse(res, response, 'Assignments', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/assignment/detail/:assignment_id (Assignment Detail)
 * @access protected
 * @returns {*} result
 */
exports.detailAssignment = async function (req, res) {
    try {
        
        const { assignment_id } = req.params
        let where = {
            _id: getObjectId(assignment_id)
        }
        
        const teacherLookup = {
            from: 'users',
            localField: 'teacher_id',
            foreignField: '_id',
            as: 'teacher'
        }
        const unwind = '$teacher'

        const getAssignment = await Assignment.aggregate([
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
                    assignment_type: 1,
                    submission_due: 1,
                    teacher_id: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'teacher.first_name': 1,
                    'teacher.last_name': 1,
                    'teacher.email': 1,
                }
            }
        ])
        
        const response = {
            assignment: getAssignment[0],
            s3_url: `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/`
        }

        return successResponse(res, response, 'Assignment Detail', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/assignment/submit (Submit assignment)
 * @access protected
 * @returns {*} result
 */
 exports.submit = async function (req, res) {
    try {
        const { assignment_id } = req.body
        const checkAssignment = await Assignment.findById(getObjectId(assignment_id))
        if(checkAssignment === null){
            return errorResponse(res, {}, 'Invalid Assignment id', 400)
        }

        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const end = moment(checkAssignment.submission_due).format('YYYY-MM-DD HH:mm:ss')
        if(now > end) {
            return errorResponse(res, {}, 'Sorry! You are late for submission.', 400)
        }

        const findAnswerWhere = {
            student_id: getObjectId(req._user.id),
            assignment_id: getObjectId(assignment_id)
        }

        const checkSubmission = await AssignmentSubmission.findOne(findAnswerWhere).sort({ createdAt: -1 })

        if(checkSubmission !== null && checkSubmission.status !== 'redo') {
            return errorResponse(res, {}, 'You already submitted Assignment.', 400)
        }

        const answerSheet = {
            assignment_id: assignment_id,
            student_id: getObjectId(req._user.id),
            teacher_id: getObjectId(checkAssignment.teacher_id)
        }
        if (!isEmpty(req.files.attachment)) {
            const attachment = req.files.attachment
            const file = attachment.data
            const mimetype = attachment.mimetype
            const file_name = attachment.name
            const uploadPath = `school/assignment/${req._user.id}/answer`

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

        const addAssignmentSubmission = await new AssignmentSubmission(answerSheet).save()

        if (addAssignmentSubmission == null) {
            return errorResponse(res, {}, 'Something went wrong! Assignment not Submitted', 400)
        }

        return successResponse(res, {}, 'Assignment successfully Submitted', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/assignment/submissions/:assignment_id (Assignment Detail)
 * @access protected
 * @returns {*} result
 */
exports.submissionsForAssignment = async function (req, res) {
    try {
        
        const { assignment_id } = req.params
        const { student_id, status } = req.body
        const where = {
            assignment_id: getObjectId(assignment_id)
        }

        if (student_id !== undefined) {
            where.student_id = getObjectId(student_id)
        }

        if (status !== undefined && status !== '') {
            where.status = status
        }
        
        const lookup = {
            from: 'users',
            localField: 'student_id',
            foreignField: '_id',
            as: 'student'
        }
        const unwind = '$student'
        // assignment Submission
        const getSubmissionList = await AssignmentSubmission.aggregate([
            { $match: where },
            { $lookup: lookup },
            { $unwind: unwind },
            { $project:  {
                    attachment: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    status: 1,
                    'student.first_name': 1,
                    'student.last_name': 1,
                    'student.email': 1,
                }
            },
            { $sort: { createdAt: -1 } }
        ])

        const response = {
            submission: getSubmissionList,
            s3_url: `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/`
        }

        return successResponse(res, response, 'Assignment Detail', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/assignment/edit (Edit New Assignment)
 * @access protected
 * @returns {*} result
 */
 exports.editAssignment = async function (req, res) {
    const { error, isValid } = editAssignmentValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const findAssignment = await Assignment.findById(req.body.assignment_id)
        if(findAssignment === null){
            return errorResponse(res, {}, 'No assignment found', 400)
        }
        const { subject, description, standard, division, submission_due, attachment, assignment_type } = req.body
        
        findAssignment.subject = subject
        findAssignment.description = description
        findAssignment.standard = standard
        findAssignment.division = division
        findAssignment.submission_due = submission_due
        findAssignment.attachment = attachment
        findAssignment.assignment_type = assignment_type
        findAssignment.teacher_id = req._user.id

        if (assignment_type === 'pdf') {
            if (!isEmpty(req.files.attachment)) {
                const attachment = req.files.attachment
                const file = attachment.data
                const mimetype = attachment.mimetype
                const file_name = attachment.name
                const uploadPath = `school/assignment/${req._user.id}`

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
                    findAssignment.attachment = uploadAttachment.response.Key
                } catch (err) {
                    console.log(err)
                    return errorResponse(res, {}, 'Attachment not uploaded on s3', 200)
                }
            }
        }

        await findAssignment.save()
        
        return successResponse(res, { }, 'Assignment Successfully saved', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/assignment/remove (Remove New Assignment)
 * @access protected
 * @returns {*} result
 */
exports.removeAssignment = async function (req, res) {
    const { error, isValid } = removeAssignmentValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const findAssignment = await Assignment.findById(req.body.assignment_id)
        if(findAssignment === null){
            return errorResponse(res, {}, 'No assignment found', 400)
        }
        // find assignment submissions
        await AssignmentSubmission.deleteMany({ assignment_id: getObjectId(req.body.assignment_id) })
        await Assignment.deleteOne({ _id: getObjectId(req.body.assignment_id) })
        
        return successResponse(res, { }, 'Assignment Successfully Removed', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/assignment/completed/:assignment_id (Remove New Assignment)
 * @access protected
 * @returns {*} result
 */
exports.completeAssignment = async function (req, res) {
    try {
        const assignment = await Assignment.findById(req.params.assignment_id)
        if(assignment === null){
            return errorResponse(res, {}, 'No assignment found', 400)
        }

        assignment.status = 'completed'
        await assignment.save()

        return successResponse(res, { }, 'Assignment Successfully Completed', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/assignment/assignment-update (Update assignment status)
 * @access protected
 * @returns {*} result
 */
 exports.updateAssignmentStatus = async function (req, res) {
    if (req._user.type !== 'teacher') {
        return errorResponse(res, {}, 'Error! You can not have access to this api.', 401)
    }
    try {
        
        const { assignment_submission_id, status } = req.body

        const assignmentSubmission = await AssignmentSubmission.findById(assignment_submission_id)
        if(assignmentSubmission === null){
            return errorResponse(res, {}, 'No assignment found', 400)
        }

        assignmentSubmission.status = status
        await assignmentSubmission.save()

        return successResponse(res, { }, 'Assignment Successfully Updated', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/assignment/assignment-submission/:assignment_id (Update assignment status)
 * @access protected
 * @returns {*} result
 */
exports.studentAssignmentSubmission = async function (req, res) {
    if (req._user.type !== 'student') {
        return errorResponse(res, {}, 'Error! You can not have access to this api.', 401)
    }

    try {
        const { assignment_id } = req.params
        const student_id =  req._user.id
        
        const query = {
            student_id: getObjectId(student_id),
            assignment_id: getObjectId(assignment_id)
        }

        const assignmentSubmission = await AssignmentSubmission.find(query).sort({ createdAt: -1 })
        const response =  {
            submission: assignmentSubmission,
            s3_url: `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/`
        }
        return successResponse(res, response, 'Assignments', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}
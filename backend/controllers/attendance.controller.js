const moment = require('moment')
const {
    successResponse,
    errorResponse,
    catchResponse,
    getObjectId
} = require('../utility')
const { 
    ROLE_STUDENT 
} = require('../utility/constant')
const {
    getStudentListForAttendanceValidation,
    saveAttendanceValidation,
    editAttendanceValidation,
    attendanceSaveTimeValidation
} = require('./validation/attendance.validation')
const User = require('../models/user.model')
const StudentAttendance = require('../models/student_attendance.model')

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/attendance/get-students-list (get student of class)
 * @access private
 * @returns {*} result
 */
exports.getStudentList = async function (req, res) {
    try {
        const { standard, division, subject, date } =  req.body
        if ( standard === '' &&  division === '' && subject === '' &&  date === '' ) {
            return successResponse(res, [], 'Students', 200)
        }
        const where = {
            standard: standard,
            division: division,
            user_type: ROLE_STUDENT
        } 
        const select = {
            first_name: 1,
            last_name: 1,
            roll_number: 1,
            student_attendance: 1
        }
        const getStudentByClassAndDivision = await User.find(where, select)

        if(getStudentByClassAndDivision.length === 0){
            return successResponse(res, [], 'Students', 200)
        }
        const dateStart = moment(date).format('YYYY-MM-DDT00:00:00.000')
        const dateEnd = moment(date).format('YYYY-MM-DDT23:59:59.000')
        const students = []
        for (const studentInfo of getStudentByClassAndDivision) {
            const studentWhere = {
                student_id: getObjectId(studentInfo._id),
                teacher_id: getObjectId(req._user.id),
                subject: subject,
                createdAt: {$gte: dateStart, $lte: dateEnd},
            }
            
            const findStudentAttendance = await StudentAttendance.findOne(studentWhere, { status: 1,login_time: 1, logout_time: 1 })
            const student = { 
                _id: studentInfo._id, 
                first_name: studentInfo.first_name,
                last_name: studentInfo.last_name,
                roll_number: studentInfo.roll_number,
                attendance: findStudentAttendance
            }
            students.push(student)
        }
              
        return successResponse(res, students, 'Students', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/attendance/save-attendance
 * @access private
 * @returns {*} result
 */
exports.saveAttendance = async function (req, res) {
    const { error, isValid } = saveAttendanceValidation(req.body)
    
    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const { students, subject } = req.body
        // const students = [
        //     { id:'60d85a997102ea49b41a47ab', status:'present' }
        // ]
        for (const student of students) {
            const attendance = {
                status: student.status,
            }
            const attendanceWhere = {
                student_id: getObjectId(student.id),
                teacher_id: getObjectId(req._user.id),
                subject: subject
            }
            // console.log(attendance, attendanceWhere)
            const saveAttendance = await StudentAttendance.findOneAndUpdate(attendanceWhere, attendance, { upsert: true })
        }
       
        return successResponse(res, {}, 'Attendance successfully saved', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/attendance/edit-attendance
 * @access private
 * @returns {*} result
 */
exports.editAttendance = async function (req, res) {
    const { error, isValid } = editAttendanceValidation(req.body)
    
    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    
    try {
        const { attendance_id, status } = req.body
        await StudentAttendance.findByIdAndUpdate(attendance_id, {status})
       
        return successResponse(res, {}, 'Attendance successfully updated', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/attendance/save-student-login-time
 * @access private
 * @returns {*} result
 */
exports.saveStudentLoginTime = async function (req, res) {
    const { error, isValid } = attendanceSaveTimeValidation(req.body)
    
    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    
    try {
        const { teacher_id, subject } = req.body
        const timeNow = moment().format('HH:MM:SS')
        const student_id = req._user.id
        
        const attendance = { login_time: timeNow }
        const attendanceWhere = {
            student_id: getObjectId(student_id),
            teacher_id: getObjectId(teacher_id),
            subject: subject,
            status:'present'
        }
        await StudentAttendance.findOneAndUpdate(attendanceWhere, attendance, { upsert: true })
       
        return successResponse(res, {}, 'Login time successfully Saved', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/attendance/save-student-logout-time
 * @access private
 * @returns {*} result
 */
 exports.saveStudentLogoutTime = async function (req, res) {
    const { error, isValid } = attendanceSaveTimeValidation(req.body)
    
    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    
    try {
        const { teacher_id, subject } = req.body
        const timeNow = moment().format('HH:MM:SS')
        const student_id = req._user.id
        
        const attendance = { logout_time: timeNow }
        const attendanceWhere = {
            student_id: getObjectId(student_id),
            teacher_id: getObjectId(teacher_id),
            subject: subject
        }
        await StudentAttendance.findOneAndUpdate(attendanceWhere, attendance)
       
        return successResponse(res, {}, 'Logout time successfully Saved', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}
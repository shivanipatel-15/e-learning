const { isEmpty } = require('../../utility/index')

/**
 * @description Add Get student list validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
 function getStudentListForAttendanceValidation(params) {
    const { standard, division, subject, date, time } =  params
    let error = {}

    if (isEmpty(standard)) {
        error.standard = 'Field should not be empty'
    }

    if (isEmpty(division)) {
        error.division = 'Field should not be empty'
    }

    if (isEmpty(subject)) {
        error.subject = 'Field should not be empty'
    }

    if (isEmpty(date)) {
        error.date = 'Field should not be empty'
    }

    if (isEmpty(time)) {
        error.time = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

/**
 * @description save attendance validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function saveAttendanceValidation(params) {
    const { students, subject } = params
    const error = {}
    if (isEmpty(students)) {
        error.students = 'Field should not be empty'
    }

    if (isEmpty(subject)) {
        error.subject = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

/**
 * @description save attendance validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
 function editAttendanceValidation(params) {
    const { attendance_id, status } = params
    const error = {}
    if (isEmpty(attendance_id)) {
        error.attendance_id = 'Field should not be empty'
    }

    if (isEmpty(status)) {
        error.status = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

/**
 * @description save attendance login and logout time validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
 function attendanceSaveTimeValidation(params) {
    const { teacher_id, subject } = params
    const error = {}
    if (isEmpty(teacher_id)) {
        error.teacher_id = 'Field should not be empty'
    }

    if (isEmpty(subject)) {
        error.subject = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}



module.exports = { 
    getStudentListForAttendanceValidation,
    saveAttendanceValidation, 
    editAttendanceValidation, 
    attendanceSaveTimeValidation
}
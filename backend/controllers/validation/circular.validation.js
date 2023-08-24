const { isEmpty } = require('../../utility/index')

/**
 * @description Add Exam validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function circularValidation(params) {
    let error = {}

    if (isEmpty(params.circular_type)) {
        error.circular_type = 'Field should not be empty'
        return {
            error,
            isValid: isEmpty(error)
        }
    }

    if(params.circular_type == 'circular'){
        if (isEmpty(params.title)) {
            error.title = 'Field should not be empty'
        }
    }

    if(params.circular_type === 'timetable'){
        if (isEmpty(params.circular_for)) {
            error.circular_for = 'Field should not be empty'
            return {
                error,
                isValid: isEmpty(error)
            }
        }

        if (params.circular_for === 'teacher') {
            if (isEmpty(params.teacher_id)) {
                error.teacher_id = 'Field should not be empty'
            }
        }

        if (params.circular_for === 'student') {
            if (isEmpty(params.division)) {
                error.division = 'Field should not be empty'
            }
        
            if (isEmpty(params.standard)) {
                error.standard = 'Field should not be empty'
            }
        }
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

module.exports = { circularValidation }
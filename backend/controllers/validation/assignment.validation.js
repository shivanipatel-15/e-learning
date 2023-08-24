const { isEmpty } = require('../../utility/index')

/**
 * @description Registration params validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function assignmentValidation(params) {
    let error = {}

    if (isEmpty(params.subject)) {
        error.subject = 'Field should not be empty'
    }

    if (isEmpty(params.division)) {
        error.division = 'Field should not be empty'
    }

    if (isEmpty(params.standard)) {
        error.standard = 'Field should not be empty'
    }

    if (isEmpty(params.submission_due)) {
        error.submission_due = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

/**
 * @description Registration params validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
 function editAssignmentValidation(params) {
    let error = {}

    if (isEmpty(params.assignment_id)) {
        error.assignment_id = 'Field should not be empty'
    }

    if (isEmpty(params.subject)) {
        error.subject = 'Field should not be empty'
    }

    if (isEmpty(params.division)) {
        error.division = 'Field should not be empty'
    }

    if (isEmpty(params.standard)) {
        error.standard = 'Field should not be empty'
    }

    if (isEmpty(params.submission_due)) {
        error.submission_due = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

/**
 * @description Registration params validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
 function removeAssignmentValidation(params) {
    let error = {}

    if (isEmpty(params.assignment_id)) {
        error.assignment_id = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}


module.exports = { assignmentValidation, editAssignmentValidation, removeAssignmentValidation }
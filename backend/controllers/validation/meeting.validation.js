const { isEmpty } = require('../../utility/index')

/**
 * @description Create Meeting validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function createMeetingValidation(params) {
    let error = {}

    if (isEmpty(params.subject)) {
        error.subject = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

/**
 * @description join class validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function joinMeetingValidation(params) {
    let error = {}

    if (isEmpty(params.meeting_id)) {
        error.meeting_id = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

module.exports = { createMeetingValidation, joinMeetingValidation }
const { isEmpty } = require('../../utility/index')

/**
 * @description Create class validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function createClassValidation(params) {
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
function joinClassValidation(params) {
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
function leaveClassValidation(params) {
    let error = {}

    if (isEmpty(params.class_id)) {
        error.class_id = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

module.exports = { createClassValidation, joinClassValidation, leaveClassValidation }
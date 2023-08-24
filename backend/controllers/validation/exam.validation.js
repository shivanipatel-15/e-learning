const { isEmpty } = require('../../utility/index')

/**
 * @description Add Exam validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function examValidation(params) {
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

    if (isEmpty(params.exam_start)) {
        error.exam_start = 'Field should not be empty'
    }

    if (isEmpty(params.exam_end)) {
        error.exam_end = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

/**
 * @description Edit Exam validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function editExamValidation(params) {
    let error = {}

    if (isEmpty(params.exam_id)) {
        error.exam_id = 'Field should not be empty'
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

    if (isEmpty(params.exam_start)) {
        error.exam_start = 'Field should not be empty'
    }

    if (isEmpty(params.exam_end)) {
        error.exam_end = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

/**
 * @description Add Exam validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function removeExamValidation(params) {
    let error = {}

    if (isEmpty(params.exam_id)) {
        error.exam_id = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

module.exports = { examValidation, editExamValidation, removeExamValidation }
const { isEmpty } = require('../../utility/index')

/**
 * @description Registration params validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function registrationValidation(params) {
    let error = {}

    if (isEmpty(params.first_name)) {
        error.first_name = 'First Name should not be empty'
    }

    if (isEmpty(params.last_name)) {
        error.last_name = 'Last should not be empty'
    }

    if (isEmpty(params.contact_no)) {
        error.contact_no = 'Contact no should not be empty'
    }

    if (isEmpty(params.email)) {
        error.email = 'Email should not be empty'
    }

    if (isEmpty(params.password)) {
        error.password = 'Password should not be empty'
    }

    if (isEmpty(params.user_type)) {
        error.user_type = 'User Type should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

module.exports = { registrationValidation }
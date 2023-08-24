const { isEmpty } = require('../../utility/index')

/**
 * @description Login params validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function loginValidation(params) {
    let error = {}

    if (isEmpty(params.username)) {
        error.username = 'Username should not be empty'
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

/**
 * @description Forgot password params validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
 function forgotValidation(params) {
    let error = {}

    if (isEmpty(params.username)) {
        error.username = 'Username should not be empty'
    }

    if (isEmpty(params.user_type)) {
        error.user_type = 'User Type should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

/**
 * @description Forgot password params validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
function resetPasswordValidation(params) {
    let error = {}

    if (isEmpty(params.token)) {
        error.token = 'token should not be empty'
    }

    if (isEmpty(params.password)) {
        error.password = 'password should not be empty'
    }

    if (isEmpty(params.confirm_password)) {
        error.confirm_password = 'confirm password should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}

/**
 * @description Forgot password params validation
 * @param {object} params request params
 * @returns {error: Object, isValid: boolean } result
 */
 function changePasswordValidation(params) {
    let error = {}

    if (isEmpty(params.current_password)) {
        error.current_password = 'current password should not be empty'
    }

    if (isEmpty(params.new_password)) {
        error.new_password = 'New password should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}


function forgotPasswordRequestValidation(params) {
    let error = {}

    if (isEmpty(params.user_type)) {
        error.user_type = 'Field should not be empty'
    }

    if (isEmpty(params.username)) {
        error.username = 'Field should not be empty'
    }

    if (isEmpty(params.email)) {
        error.email = 'Field should not be empty'
    }

    if (isEmpty(params.contact_no)) {
        error.contact_noe = 'Field should not be empty'
    }

    return {
        error,
        isValid: isEmpty(error)
    }
}
module.exports = { loginValidation, forgotValidation, resetPasswordValidation, changePasswordValidation, forgotPasswordRequestValidation }
const bcrypt = require('bcrypt')
const {
    successResponse,
    errorResponse,
    catchResponse,
    generateJwtAuthToken,
    generateJwtResetPasswordToken,
    verifyResetPasswordJwtToken,
    getObjectId
} = require('../utility')
const { loginValidation, forgotValidation, resetPasswordValidation, changePasswordValidation, forgotPasswordRequestValidation } = require('./validation/auth.validation')
const { 
    ROLE_ADMIN,
    ROLE_PRINCIPAL,
    ROLE_VICE_PRINCIPAL,
    ROLE_MANAGEMENT,
    ROLE_TEACHER,
    ROLE_STUDENT 
} = require('../utility/constant')
const User = require('../models/user.model')
const ForgotPasswordRequest = require('../models/forgot_password_request.model')

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/auth/register (Register User)
 * @access public
 * @returns {*} result
 */
 exports.register = async function (req, res) {
    try {
        const user = await User.findOne({ email: req.body.email, status: { $ne: 'deleted' } })
        if (user != null) {
            return errorResponse(res, {}, 'User already exists with same Email address', 400)
        }

        const userData = {
            name: req.body.name,
            email: req.body.email,
            user_type: ROLE_ADMIN
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(req.body.password, salt)
        userData.password = passwordHash

        const saveUser = await new User(userData).save()

        if (saveUser == null) {
            return errorResponse(res, {}, 'Something went wrong! User not registered', 400)
        }

        const token = generateJwtAuthToken(saveUser._id, ROLE_ADMIN)
        return successResponse(res, { token: token }, 'Successfully Registered', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/auth/login (Login for all users)
 * @access public
 * @returns {*} result
 */
 exports.login = async function (req, res) {
    const { error, isValid } = loginValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const userType = req.body.user_type
        const where = { 
            username: req.body.username,
            user_type: userType
        }
        const user  = await User.findOne(where)
        
        if(user === null){
            return errorResponse(res, {}, 'Invalid username or password', 200)
        }

        if(user.status === 'blocked' || user.status === 'deleted'){
            return errorResponse(res, {}, `Your profile is ${user.status}`, 401)
        }
        
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
        if(isPasswordValid === false) {
            return errorResponse(res, {}, 'Invalid username or password', 200)
        }

        const token = generateJwtAuthToken(user._id, userType)
        return successResponse(res, { token: token }, 'Successfully Login', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/forgot-password (Forgot Password User)
 * @access public
 * @returns {*} result
 */
 exports.forgotPassword = async function (req, res) {
    const { error, isValid } = forgotValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }

    try {
        const username = req.body.username
        const user_type = req.body.user_type
        const user = await User.findOne({ username, user_type })

        if (user == null) {
            return errorResponse(res, {}, 'Email not found', 200)
        }

        const forgotPasswordToken = generateJwtResetPasswordToken(user._id, user_type)
        // const link = `${process.env.CLIENT_URL}/reset-password/${forgotPasswordToken}`

        // const filePath = path.join(__dirname, '../mail_template/reset_password.html')
        // const source = fs.readFileSync(filePath, 'utf-8').toString()
        // const template = handlebars.compile(source)
        // const replacements = {
        //     resetpass_link: link,
        //     sender_name: 'HIBO'
        // }
        // const htmlToSend = template(replacements)

        // let mailData = {
        //     to_email: email,
        //     to_name: user.first_name,
        //     subject: 'Reset Your Password',
        //     body: htmlToSend
        // }

        // sendMail(mailData)

        const updateUser = await user.updateOne({ forgot_password_token: forgotPasswordToken })
        if (updateUser == null) {
            return errorResponse(res, {}, 'Error in Reset password link', 200)
        }
        return successResponse(res, { forgot_password_token: forgotPasswordToken }, 'Reset Password Link send to your email', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}


/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/forgot-password-request (Forgot Password User)
 * @access public
 * @returns {*} result
 */
 exports.forgotPasswordRequest = async function (req, res) {
    const { error, isValid } = forgotPasswordRequestValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }

    try {
        const requestData = req.body
        const username = req.body.username
        const user_type = req.body.user_type
        const user = await User.findOne({ username, user_type })

        if (user == null) {
            return errorResponse(res, {}, 'User not found', 200)
        }

        const forgotPasswordRequest = {
            user_type: requestData.user_type,
            username: requestData.username,
            email: requestData.email,
            contact_no: requestData.contact_no,
            user_id: user._id
        }
        
        await new ForgotPasswordRequest(forgotPasswordRequest).save()
        
        return successResponse(res, {}, 'Forgot Password Request successfully sent. Management will contact you soon', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/reset-password (Reset Password User)
 * @access public
 * @returns {*} result
 */
exports.resetPassword = async function (req, res) {
    const { error, isValid } = resetPasswordValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const forgot_password_token = req.body.token
        const password = req.body.password
        const confirm_password = req.body.confirm_password
        if (!forgot_password_token) {
            return errorResponse(res, {}, 'Invalid password reset link', 200)
        }

        if(password !== confirm_password) {
            return errorResponse(res, {}, 'Password and confirm password must be same', 200)
        }

        const user_data = await verifyResetPasswordJwtToken(forgot_password_token)

        if (!user_data) {
            return errorResponse(res, {}, 'Password Reset link expired', 200)
        }

        const where = {
            _id: getObjectId(user_data.id),
            user_type: user_data.type
        }

        const user = await User.findOne(where)
        if (user == null) {
            return errorResponse(res, {}, 'Invalid Password reset link', 200)
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const updateUserPassword = await user.updateOne({ password: passwordHash, forgot_password_token: '' })
        if (updateUserPassword == null) {
            return errorResponse(res, {}, 'Error in Password reset', 200)
        }
        
        return successResponse(res, {}, 'Password successfully reset', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/auth/change-password (Change password)
 * @access private
 * @returns {*} result
 */
 exports.changePassword = async function (req, res) {
    const { error, isValid } = changePasswordValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }

    try {
        const user = await User.findById(req._user.id)
        const current_password = req.body.current_password
        const new_password = req.body.new_password

        const is_valid_password = await bcrypt.compare(current_password, user.password)
        if (is_valid_password == false) {
            return errorResponse(res, {}, 'Invalid Current Password', 200)
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(new_password, salt)

        const updateData = { password: passwordHash }
        const updateUser = await User.findOneAndUpdate({ email: user.email }, updateData)
        if (updateUser == null) {
            return errorResponse(res, {}, 'Password not changed. try again', 200)
        }
        return successResponse(res, {}, 'Password successfully updated', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/auth/profile (get Current user profile)
 * @access private
 * @returns {*} result
 */
 exports.profile = async function (req, res) {
    try {
        const user = await User.findById(req._user.id, 'first_name last_name email status user_type contact_no subjects username standard division')

        if(user === null){
            return errorResponse(res, {}, 'User not exist', 200)
        }

        if(user.status === 'blocked' || user.status === 'deleted'){
            return errorResponse(res, {}, `Your profile is ${user.status}`, 401)
        }

        return successResponse(res, user, 'User Information', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/auth/edit-profile (Edit Current user profile)
 * @access private
 * @returns {*} result
 */
exports.editProfile = async function (req, res) {
    try {
        const requestData = req.body
        const user = await User.findById(req._user.id)
        
        if(user === null){
            return errorResponse(res, {}, 'User not exist', 200)
        }

        user.first_name = requestData.first_name 
        user.last_name = requestData.last_name
        user.contact_no = requestData.contact_no

        const updateUser = await user.save()

        return successResponse(res, updateUser, 'Your profile Successfully updated', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

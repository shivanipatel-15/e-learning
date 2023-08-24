const bcrypt = require('bcrypt')
const {
    successResponse,
    errorResponse,
    catchResponse,
    generateJwtAuthToken
} = require('../utility')
const User = require('../models/user.model')
const { registrationValidation } = require('./validation/registration.validation')

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/register/ (Register Users)
 * @access public
 * @returns {*} result
 */
exports.registerUser = async function (req, res) {
    const { error, isValid } = registrationValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const user = await User.findOne({ username: req.body.username, status: { $ne: 'deleted' } })
        if (user != null) {
            return errorResponse(res, {}, 'Username already taken', 400)
        }

        const userData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: req.body.email,
            contact_no: req.body.contact_no,
            user_type: req.body.user_type
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(req.body.password, salt)
        userData.password = passwordHash

        if(req.body.user_type === 'teacher' && req.body.is_class_teacher.status === true){
            const standard = req.body.is_class_teacher.class.standard
            const division = req.body.is_class_teacher.class.division
            const query = {
                'is_class_teacher.class.standard': standard,
                'is_class_teacher.class.division': division
            }
            const checkAlreadyClassTeacherForSameClass = await User.findOne(query)
            if(checkAlreadyClassTeacherForSameClass !== null){
                const message = `Some one is already assign class teacher for ${standard}-${division}`
                return errorResponse(res, {}, message, 200)
            }
            userData.is_class_teacher = req.body.is_class_teacher
        }

        if(req.body.user_type === 'student') {
            userData.gender = req.body.gender
            userData.birth_date = req.body.birth_date
            userData.standard = req.body.standard
            userData.division = req.body.division
            userData.admission_number = req.body.admission_number
            userData.guardian1_contact = req.body.guardian1_contact
            userData.guardian2_contact = req.body.guardian2_contact
            userData.sts_number = req.body.sts_number
            userData.roll_number = req.body.roll_number
        }
        const saveUser = await new User(userData).save()

        if (saveUser == null) {
            return errorResponse(res, {}, 'Something went wrong! User not registered', 400)
        }

        return successResponse(res, { }, 'Successfully Registered', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

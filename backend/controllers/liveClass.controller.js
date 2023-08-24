const {
    successResponse,
    errorResponse,
    catchResponse
} = require('../utility')
const liveClass = require('../models/liveClass.model')
const { createClassValidation, joinClassValidation, leaveClassValidation } = require('./validation/liveClass.validation')
const User = require('../models/user.model')
const moment = require('moment')
const { Support } = require('aws-sdk')

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/liveClass/create_class (get Current user profile)
 * @access private
 * @returns {*} result
 */
exports.create_class = async function (req, res) {
    const { error, isValid } = createClassValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const where = {
            subject: req.body.subject,
            division: req.body.division,
            standard: req.body.standard,
            teacher_id: req._user.id
        }
        await liveClass.updateMany(where, { status: 'expired' })
        
        const date = moment().format('YYYY-MM-DD')
        const className = `${req.body.subject}${req.body.division}${req.body.standard}${date}`
        const newClass = {
            teacher_id: req._user.id,
            class_name: className,
            subject: req.body.subject,
            division: req.body.division,
            standard: req.body.standard
        }

        const saveClass = await new liveClass(newClass).save()
        if(saveClass === null) {
            return errorResponse(res, {}, 'Class not saved. Try again', 400)
        }
        return successResponse(res, saveClass, 'Class Created', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/liveClass/join_class (get current live class link)
 * @access private
 * @returns {*} result
 */
 exports.join_class = async function (req, res) {
    const { error, isValid } = joinClassValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }

    try {
        const user_id = req._user.id
        const getUser = await User.findById(user_id)

        const dateStart = moment().format('YYYY-MM-DDT00:00:00.000')
        const dateEnd = moment().format('YYYY-MM-DDT23:59:59.000')
        const where = {
            standard: getUser.standard,
            division: getUser.division,
            subject: req.body.subject,
            status: 'live',
            createdAt: {$gte: dateStart, $lte: dateEnd}
        }

        const getClass = await liveClass.findOne(where)
        if(getClass === null) {
            return successResponse(res, {}, 'No Class Found', 200)
        }
        const now = moment(new Date())
        const start_time = moment(getClass.createdAt).format(`YYYY-MM-DD HH:mm`)
        const duration = moment.duration(now.diff(start_time))
        
        // if(duration > 20.00) {
        //     return successResponse(res, {}, 'You are late. can\'t join class', 200)
        // }

        return successResponse(res, getClass, 'Class Found', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/liveClass/leave_class (get current live class link)
 * @access private
 * @returns {*} result
 */
 exports.leave_class = async function (req, res) {
    const { error, isValid } = leaveClassValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }

    try {
        const class_id = req.body.class_id
        const getClass = await liveClass.findById(class_id)

        if(getClass === null) {
            return successResponse(res, {}, 'No Class Found', 200)
        }

        getClass.status = 'expired'
        await getClass.save()

        return successResponse(res, getClass, 'Successfully saved', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/liveClass/list (Get All Live Class List)
 * @access private
 * @returns {*} result
 */
 exports.listClass = async function (req, res) {
    try {
        const dateStart = moment().format('YYYY-MM-DDT00:00:00.000')
        const dateEnd = moment().format('YYYY-MM-DDT23:59:59.000')
        const query = {
            status: 'live',
            createdAt: {$gte: dateStart, $lte: dateEnd}
        }
        const getClass = await liveClass.find(query).sort({createdAt: 1})

        return successResponse(res, getClass, 'All Class', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}


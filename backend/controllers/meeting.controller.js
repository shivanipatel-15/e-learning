const {
    successResponse,
    errorResponse,
    catchResponse
} = require('../utility')
const meeting = require('../models/meeting.model')
const { createMeetingValidation, joinMeetingValidation } = require('./validation/meeting.validation')

/**
 * @param {*} req request
 * @param {*} res request
* @description POST api/v1/meeting/create_class (get Current user profile)
 * @access private
 * @returns {*} result
 */
exports.createMeeting = async function (req, res) {
    const { error, isValid } = createMeetingValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }
    try {
        const newMeeting = {
            created_by: req._user.id,
            user_ids: req.body.user_ids,
            subject: req.body.subject,
            meeting_id: req.body.subject,
            start_date_time: req.body.start_date,
            end_date_time: req.body.end_date
        }

        const saveMeeting = await new meeting(newMeeting).save()
        if(saveMeeting === null) {
            return errorResponse(res, {}, 'Meeting not saved. Try again', 400)
        }
        return successResponse(res, saveMeeting, 'Meeting Created', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/meeting/join_class (get current live class link)
 * @access private
 * @returns {*} result
 */
exports.joinMeeting = async function (req, res) {
    const { error, isValid } = joinMeetingValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }

    try {
        const user_id = req._user.id
        const meeting_id = req.body.meeting_id
        
        const query = {
            _id: meeting_id,
            status: { $ne: 'completed' }
        }

        if(req._user.type !== 'admin' && req._user.type !== 'principal') {
            query.user_ids = user_id
        }
        
        const meetingInfo = await meeting.findOne(query)
        if(meetingInfo === null) {
            return errorResponse(res, {}, 'Meeting not found', 400)
        }

        const total_participant_joined = meetingInfo.total_participant_joined
        total_participant_joined.push(user_id)
        
        meetingInfo.total_participant_joined = total_participant_joined
        await meetingInfo.save()

        return successResponse(res, meetingInfo, 'Meeting Found', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/meeting/list (Get All Live Class List)
 * @access private
 * @returns {*} result
 */
exports.listMeeting = async function (req, res) {
    try {
        const user_id = req._user.id
        const query = {
            status: 'pending',
        }
        if(req._user.type !== 'admin' && req._user.type !== 'principal') {
            query.user_ids = user_id
        }
        const findMeeting = await meeting.find(query).sort({start_date_time: 1})

        return successResponse(res, findMeeting, 'Upcoming meeting', 200)

    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/meeting/leave/ (Leave meeting)
 * @access private
 * @returns {*} result
 */
exports.leaveMeeting = async function (req, res) {
    try {
        const user_id = req._user.id
        const meeting_id = req.body.meeting_id

        const meetingInfo = await meeting.findById(meeting_id)
        if(meetingInfo.created_by === user_id) {
            meetingInfo.status = 'completed'
        }
        await meetingInfo.save()

        return successResponse(res, {}, 'Meeting completed', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}
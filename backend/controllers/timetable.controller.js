const {
    successResponse,
    errorResponse,
    catchResponse,
    isEmpty,
    getObjectId
} = require('../utility')
const Timetable = require('../models/timetable.model')
const User = require('../models/user.model')
const csvtojson = require('csvtojson')
const moment = require('moment')

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/timetable/add (Add New timetable)
 * @access protected
 * @returns {*} result
 */
exports.addTimetable = async function (req, res) {
    try {
        if (!isEmpty(req.files.csv)) {
            const csv = req.files.csv
            const csvData = csv.data.toString('utf-8')
            const timetableData = await csvtojson().fromString(csvData)
            if (timetableData.length === 0) {
                return errorResponse(res, {}, 'Invalid Data', 200)
            }

            for (const timetable of timetableData) {
                const teacherQuery = {
                    username: timetable.teacher_username,
                    status: 'active',
                    user_type: 'teacher'
                }
                const teacher = await User.findOne(teacherQuery, { _id: 1 })
                if (teacher !== null) {
                    const insertData = {
                        subject: timetable.subject,
                        standard: timetable.standard,
                        division: timetable.division,
                        day: timetable.day.toLowerCase(),
                        start_time: timetable.start_time,
                        end_time: timetable.end_time,
                        teacher_id: teacher._id,
                        teacher_username: timetable.teacher_username
                    }
                    const addTimetable = new Timetable(insertData)
                    await addTimetable.save()
                }
            }
            return successResponse(res, {}, 'Your CSV Successfully import', 200)
        }
        return errorResponse(res, {}, 'CSV file not found', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/timetable/get-standard-class (get Class for student)
 * @access protected
 * @returns {*} result
 */
exports.getTodayClassByStandard = async function (req, res) {
    try {
        const { standard, division } = req.body
        const day = moment().format('dddd').toLocaleLowerCase()

        const query = {
            standard, division, day
        }

        const todayClasses = await Timetable.find(query).sort({ start_time: 1 })
        return successResponse(res, todayClasses, 'Your Class for today', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/timetable/get-teacher-class (get Class for teacher)
 * @access protected
 * @returns {*} result
 */
 exports.getTodayClassByTeacher = async function (req, res) {
    try {
        const teacher_id = req.body.teacher_id
        const day = moment().format('dddd').toLocaleLowerCase()

        const query = { teacher_id, day }
        // const query = { teacher_id }

        const todayClasses = await Timetable.find(query).sort({ start_time: 1 })
        return successResponse(res, todayClasses, 'Your Class for today', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/timetable/get-all-class (get Class for Management and principal)
 * @access protected
 * @returns {*} result
 */
 exports.getAllTodayClass = async function (req, res) {
    try {
        const day = moment().format('dddd').toLocaleLowerCase()
        const query = { day }
        // const query = {  }
        const todayClasses = await Timetable.find(query).sort({ start_time: 1 })
        return successResponse(res, todayClasses, 'Your Class for today', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/timetable/get-timetable-list
 * @access protected
 * @returns {*} result
 */
 exports.getTimeTableList = async function (req, res) {
    try {
        const query = {}
        if(req.body.teacher_id !== '') {
            query.teacher_id = req.body.teacher_id
        }
        if(req.body.standard !== '') {
            query.standard = req.body.standard
        }
        if(req.body.division !== '') {
            query.division = req.body.division
        }
        if(req.body.day !== '') {
            query.day = req.body.day
        }
        
        const todayClasses = await Timetable.find(query).sort({ day: 1, start_time: 1 })
        return successResponse(res, todayClasses, 'Your Class for today', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/timetable/remove/:timetable_id (Remove Timetable)
 * @access protected
 * @returns {*} result
 */
 exports.removeTimetable = async function (req, res) {
    try {
        const { timetable_id } = req.params

        await Timetable.deleteOne({ _id: getObjectId(timetable_id) })
        return successResponse(res, { }, 'Timetable Successfully Removed', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/timetable/edit/:timetable_id (Remove Timetable)
 * @access protected
 * @returns {*} result
 */
 exports.editTimetable = async function (req, res) {
    try {
        const { timetable_id } = req.params
        const timetable = await Timetable.findById(timetable_id)

        const { subject, standard, division, day, start_time, end_time, teacher_id } = req.body
        timetable.subject = subject
        timetable.standard = standard
        timetable.division = division
        timetable.day = day
        timetable.start_time = start_time
        timetable.end_time = end_time
        timetable.teacher_id = teacher_id

        await timetable.save()

        return successResponse(res, { }, 'Timetable Successfully Updated', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/timetable/detail/:timetable_id (Remove Timetable)
 * @access protected
 * @returns {*} result
 */
 exports.detailTimetable = async function (req, res) {
    try {
        const { timetable_id } = req.params
        const timetable = await Timetable.findById(timetable_id)

        return successResponse(res, timetable, 'Timetable Detail', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}
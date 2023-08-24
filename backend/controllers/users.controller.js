const bcrypt = require('bcrypt')
const {
    successResponse,
    errorResponse,
    catchResponse,
    isEmpty,
    getObjectId
} = require('../utility')
const { 
    ROLE_VICE_PRINCIPAL,
    ROLE_MANAGEMENT,
    ROLE_TEACHER,
    ROLE_STUDENT 
} = require('../utility/constant')
const User = require('../models/user.model')
const ForgotPasswordRequest = require('../models/forgot_password_request.model')
const allUsers = [ROLE_VICE_PRINCIPAL, ROLE_MANAGEMENT, ROLE_TEACHER, ROLE_STUDENT]
const moment = require('moment')
const csvtojson = require("csvtojson")
const { v4: uuidv4 } = require('uuid')

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/list (Get all user list by type)
 * @access public
 * @returns {*} result
 */
exports.userList = async function (req, res) {
    try {
        
        const request =  req.body

        if(allUsers.includes(request.user_type) === false) {
            return errorResponse(res, {}, 'Invalid Request', 400)
        }
        const limit = 10
        const page = req.body.page || 1
        const offset = (page - 1)*limit

        const query = {
            status: { $ne: 'archive'}
        }
        if (request.first_name && request.first_name !== '') {
            query.first_name = request.first_name
        }
        if (request.last_name && request.last_name !== '') {
            query.last_name = request.last_name
        }
        if (request.email && request.email !== '') {
            query.email = request.email
        }
        if (request.status && request.status !== '') {
            query.status = request.status
        }
        if (request.user_type && request.user_type !== '') {
            query.user_type = request.user_type
        }
        if (request.standard && request.standard !== '') {
            query.standard = request.standard
        }
        if (request.division && request.division !== '') {
            query.division = request.division
        }
        if (request.gender && request.gender !== '') {
            query.gender = request.gender
        }
        if (request.student_id && request.student_id !== '') {
            query.student_id = request.student_id
        }
        
        const notSelect = {
            password: 0,
            forgot_password_token: 0
        }

        const users = await User.find(query, notSelect).limit(limit).skip(offset).sort({ _id: -1 })
        
        return successResponse(res, users, 'Users List', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/detail/:user_id (Get User profile)
 * @access public
 * @returns {*} result
 */
 exports.userDetail = async function (req, res) {
    try {
        const user_id = req.params.user_id

        const notSelect = {
            password: 0,
            forgot_password_token: 0
        }
        const user = await User.findById(getObjectId(user_id), notSelect)
        if(user === null) {
            return errorResponse(res, {}, 'Invalid User id', 400)
        }
        
        return successResponse(res, user, 'User Detail', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/forgot-password-request-list (Get User profile)
 * @access public
 * @returns {*} result
 */
 exports.forgotPasswordRequestList = async function (req, res) {
    try {
        const limit = 10
        const page = req.body.page || 1
        const offset = (page - 1)*limit

        const requestList = await ForgotPasswordRequest.find({ status: 'active' }).limit(limit).skip(offset).sort({ createdAt: -1 })
        
        return successResponse(res, requestList, 'Forgot Password Request', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/forgot-password-request-complete (Get User profile)
 * @access public
 * @returns {*} result
 */
 exports.forgotPasswordRequestComplete = async function (req, res) {
    try {
        const requestId = getObjectId(req.body.request_id)
        await ForgotPasswordRequest.findByIdAndUpdate(requestId, { status: 'complete' })
        
        return successResponse(res, {}, 'Forgot Password Request Successfully completed', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}


/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/edit-profile/:user_id (Edit User Profile)
 * @access public
 * @returns {*} result
 */
 exports.userProfileEdit = async function (req, res) {
    const user_id = req.params.user_id

    try {
        const userData = await User.findById(user_id)
        if (userData === null) {
            return errorResponse(res, {}, 'Invalid User', 400)
        }

        userData.first_name = req.body.first_name
        userData.last_name = req.body.last_name
        userData.username = req.body.username
        userData.email = req.body.email
        userData.contact_no = req.body.contact_no

        if(req.body.password !== '') {
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(req.body.password, salt)
            userData.password = passwordHash
        }

        if(userData.user_type === 'teacher' && req.body.is_class_teacher.status === true){
            const standard = req.body.is_class_teacher.class.standard
            const division = req.body.is_class_teacher.class.division
            const query = {
                'is_class_teacher.class.standard': standard,
                'is_class_teacher.class.division': division
            }
            const checkAlreadyClassTeacherForSameClass = await User.findOne(query)
            if(checkAlreadyClassTeacherForSameClass !== null && checkAlreadyClassTeacherForSameClass._id.toString() !== userData._id.toString()){
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
            userData.roll_number = req.body.roll_number
            userData.sts_number = req.body.sts_number
        }
        const saveUser = await userData.save()

        if (saveUser == null) {
            return errorResponse(res, {}, 'Something went wrong! User Profile Updated', 400)
        }

        return successResponse(res, { }, 'Profile Successfully Updated', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/get-all-teacher (Get All Teachers)
 * @access public
 * @returns {*} result
 */
 exports.getAllTeachers = async function (req, res) {
    try {
        const query = {
            user_type: 'teacher',
            status: 'active'
        }
        const select = {
            first_name: 1,
            last_name: 1,
            username: 1,
        }
        const teacherList = await User.find(query, select).sort({ createdAt: -1 })
        
        return successResponse(res, teacherList, 'Teacher List', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/assign-subjects (Assign subject to teachers)
 * @access public
 * @returns {*} result
 */
exports.addTeacherSubject = async function (req, res) {
    try {
        const teacher_id = req.body.teacher_id
        const teacherProfile = await User.findById(teacher_id, { subjects: 1 })
        const subjects = teacherProfile.subjects
        const subject = {
            uuid: req.body.uuid,
            subject: req.body.subject,
            standard: req.body.standard,
            division: req.body.division
        }
        subjects.push(subject)
        teacherProfile.subjects = subjects
        teacherProfile.save()
        return successResponse(res, {}, 'Subject Successfully Added', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/remove-subject (Assign subject to teachers)
 * @access public
 * @returns {*} result
 */
exports.removeTeacherSubject = async function (req, res) {
    try {
        const teacher_id = req.body.teacher_id
        const subject_id = req.body.subject_id
        const teacherProfile = await User.findById(teacher_id, { subjects: 1 })
        const subjects = teacherProfile.subjects
        const newSubjects = subjects.filter(subject => subject.uuid !== subject_id)
        
        teacherProfile.subjects = newSubjects
        teacherProfile.save()
        return successResponse(res, {}, 'Subject Successfully Removed', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/import/csv (Import Student CSV)
 * @access public
 * @returns {*} result
 */
 exports.importStudentCSV = async function (req, res) {
    try {
        if (!isEmpty(req.files.csv)) {
            const csv = req.files.csv
            const csvData = csv.data.toString('utf-8')
            const studentsData = await csvtojson().fromString(csvData)
            if (studentsData.length === 0)  {
                return errorResponse(res, {}, 'Invalid Data', 200)    
            }
            for (const student of studentsData) {
                const query = {
                    username: student.username,
                    user_type: 'student'
                }
                if(student.birth_date) {
                    const birthDate = student.birth_date.split('-')
                    student.birth_date = moment(`${birthDate[2]}-${birthDate[1]}-${birthDate[0]}`).format('YYYY-MM-DD')
                }
                
                const salt = await bcrypt.genSalt(10)
                const passwordHash = await bcrypt.hash(student.password, salt)
                student.password = passwordHash
                student.user_type = 'student'
                student.status = 'active'

                await User.updateOne(query, student, { upsert : true })
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
 * @description POST api/v1/users/get-count (get All users count)
 * @access public
 * @returns {*} result
 */
exports.countUsers = async function (req, res) {
    try {
        const countStudent = await User.countDocuments({ user_type: 'student' })
        const countTeacher = await User.countDocuments({ user_type: 'teacher' })
        const countManagement = await User.countDocuments({ user_type: 'management' })
        const countVicePrincipal = await User.countDocuments({ user_type: 'vice_principal' })

        const counts = {
            student: countStudent,
            teacher: countTeacher,
            management: countManagement,
            vice_principal: countVicePrincipal
        }

        return successResponse(res, counts, 'User Count', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/import-teacher/csv (Import Teacher CSV)
 * @access public
 * @returns {*} result
 */
 exports.importTeacherCSV = async function (req, res) {
    try {
        if (!isEmpty(req.files.csv)) {
            const csv = req.files.csv
            const csvData = csv.data.toString('utf-8')
            const teachersData = await csvtojson().fromString(csvData)
            if (teachersData.length === 0)  {
                return errorResponse(res, {}, 'Invalid Data', 200)    
            }
            for (const teacher of teachersData) {
                const teacherInfo = {
                    first_name: teacher.first_name,
                    last_name: teacher.last_name,
                    username: teacher.username,
                    email: teacher.email,
                    contact_no: teacher.contact_no,
                    status: 'active'
                }
                const query = {
                    username: teacher.username,
                    user_type: 'teacher'
                }

                const salt = await bcrypt.genSalt(10)
                const passwordHash = await bcrypt.hash(teacher.password, salt)
                teacherInfo.password = passwordHash
                teacherInfo.user_type = 'teacher'
                if(teacher.is_class_teacher === 'yes'){
                    teacherInfo.is_class_teacher = {
                        status: true,
                        class: {
                            standard: teacher.standard,
                            division: teacher.division
                        }
                    }
                }

                await User.updateOne(query, teacherInfo, { upsert : true })
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
 * @description POST api/v1/users/change-status (get All users count)
 * @access public
 * @returns {*} result
 */
exports.changeStatus = async function (req, res) {
     if(req._user.type !== 'admin') {
        return errorResponse(res, {}, 'Error! You can not have access to this api.', 401)
     }
    try {
        const { user_id, status } = req.body

        const user = await User.findById(user_id)

        if(user === null) {
            return errorResponse(res, {}, 'Invalid User id', 400)
        }

        user.status = status
        await user.save()

        return successResponse(res, {}, 'User Status successfully updated', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/get-all-staff (Get All Staff)
 * @access public
 * @returns {*} result
 */
 exports.getAllStaff = async function (req, res) {
    try {
        const query = {
            user_type: { $ne: 'admin'},
            status: 'active'
        }
        const select = {
            first_name: 1,
            last_name: 1,
            username: 1,
            user_type: 1,
        }
        const staffList = await User.find(query, select).sort({ createdAt: -1 })
        
        return successResponse(res, staffList, 'Staff List', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}


/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/users/import-teacher/subject-csv (Import Teacher CSV)
 * @access public
 * @returns {*} result
 */
exports.importTeacherSubjectCSV = async function (req, res) {
    try {
        if (!isEmpty(req.files.csv)) {
            const csv = req.files.csv
            const csvData = csv.data.toString('utf-8')
            const subjectData = await csvtojson().fromString(csvData)
            if (subjectData.length === 0)  {
                return errorResponse(res, {}, 'Invalid Data', 200)    
            }
            for (const subject of subjectData) {
                const query = {
                    username: subject.username,
                    user_type: 'teacher'
                }
                const teacherProfile = await User.findOne(query, { subjects: 1 })
                const subjects = teacherProfile.subjects
                const checkSubjects = subjects.find(sub => (sub.subject === subject.subject && sub.standard === subject.standard && sub.division === subject.division))
                if(checkSubjects === undefined) {
                    const subjectInfo = {
                        uuid: uuidv4(),
                        subject: subject.subject,
                        standard: subject.standard,
                        division: subject.division
                    }
                    subjects.push(subjectInfo)
                    teacherProfile.subjects = subjects
                    teacherProfile.save()
                }
            }
            return successResponse(res, {}, 'Your CSV Successfully import', 200)
        } 
        return errorResponse(res, {}, 'CSV file not found', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}
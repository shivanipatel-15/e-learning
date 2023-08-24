const express = require('express')
const { protectRouteWithRole } = require('../middleware/auth.middleware')
const {
    ROLE_ADMIN,
    ROLE_PRINCIPAL,
    ROLE_VICE_PRINCIPAL,
    ROLE_MANAGEMENT,
    ROLE_TEACHER,
    ROLE_STUDENT
} = require('../utility/constant')

const auth = require('./auth.route')
const register = require('./registration.route')
const assignment = require('./assignment.route')
const exam = require('./exam.route')
const attendance = require('./attendance.route')
const liveClass = require('./liveClass.route')
const users = require('./users.route')
const circular = require('./circular.route')
const timetable = require('./timetable.route')
const meeting = require('./meeting.route')

const app = express()
app.use('/api/v1', auth)
app.use('/api/v1/auth', [protectRouteWithRole([ROLE_ADMIN, ROLE_PRINCIPAL, ROLE_VICE_PRINCIPAL, ROLE_MANAGEMENT, ROLE_TEACHER, ROLE_STUDENT])], auth)
app.use('/api/v1/register_user', [protectRouteWithRole([ROLE_ADMIN, ROLE_PRINCIPAL, ROLE_VICE_PRINCIPAL, ROLE_MANAGEMENT, ROLE_TEACHER])], register)
app.use('/api/v1/assignment', [protectRouteWithRole([ROLE_ADMIN, ROLE_PRINCIPAL, ROLE_MANAGEMENT, ROLE_TEACHER, ROLE_STUDENT])], assignment)
app.use('/api/v1/exam', [protectRouteWithRole([ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT, ROLE_PRINCIPAL, ROLE_MANAGEMENT])], exam)
app.use('/api/v1/attendance', [protectRouteWithRole([ROLE_ADMIN, ROLE_MANAGEMENT, ROLE_TEACHER, ROLE_STUDENT])], attendance)
app.use('/api/v1/liveClass', [protectRouteWithRole([ROLE_ADMIN, ROLE_PRINCIPAL, ROLE_VICE_PRINCIPAL, ROLE_MANAGEMENT, ROLE_TEACHER, ROLE_STUDENT])], liveClass)
app.use('/api/v1/users', [protectRouteWithRole([ROLE_ADMIN, ROLE_PRINCIPAL, ROLE_VICE_PRINCIPAL, ROLE_MANAGEMENT, ROLE_TEACHER])], users)
app.use('/api/v1/circular', [protectRouteWithRole([ROLE_ADMIN, ROLE_PRINCIPAL, ROLE_MANAGEMENT])], circular)
app.use('/api/v1/timetable', [protectRouteWithRole([ROLE_ADMIN, ROLE_VICE_PRINCIPAL, ROLE_TEACHER, ROLE_STUDENT])], timetable)
app.use('/api/v1/calender', [protectRouteWithRole([ROLE_ADMIN, ROLE_VICE_PRINCIPAL])], circular)
app.use('/api/v1/circulars', [protectRouteWithRole([ROLE_ADMIN, ROLE_PRINCIPAL, ROLE_VICE_PRINCIPAL, ROLE_MANAGEMENT, ROLE_TEACHER, ROLE_STUDENT])], circular)
app.use('/api/v1/notes', [protectRouteWithRole([ROLE_ADMIN, ROLE_PRINCIPAL, ROLE_MANAGEMENT, ROLE_TEACHER])], circular)
app.use('/api/v1/meeting', [protectRouteWithRole([ROLE_ADMIN, ROLE_PRINCIPAL, ROLE_MANAGEMENT, ROLE_TEACHER])], meeting)

module.exports = app

const {
    successResponse,
    errorResponse,
    catchResponse,
    getObjectId, 
    isEmpty
} = require('../utility')
const Circular = require('../models/circular.model')
const { circularValidation } = require('./validation/circular.validation')
const { uploadMediaToS3 } = require('../utility/upload')
const moment = require('moment')

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/circular/add (Add New Circular)
 * @access protected
 * @returns {*} result
 */
exports.addCircular = async function (req, res) {
    const { error, isValid } = circularValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }

    if (req.files === null) {
        return errorResponse(res, { subject: 'Please select file to upload' }, 'Invalid Request', 400)
    }

    try {
        const requestData = req.body

        const circularData = {
            circular_type: requestData.circular_type
        }
        if(requestData.circular_type === 'circular'){
            circularData.title = requestData.title
        }

        if(requestData.circular_type === 'syllabus'){
            circularData.board = requestData.board
            circularData.standard = requestData.standard
            circularData.division = requestData.division
        }

        if(requestData.circular_type === 'notes'){
            circularData.title = requestData.title
            circularData.standard = requestData.standard
            circularData.division = requestData.division
            circularData.subject = requestData.subject
            circularData.teacher_id = getObjectId(req._user.id)
        }
        
        const attachment = req.files.attachment
        const file = attachment.data
        const mimetype = attachment.mimetype
        const file_name = attachment.name
        const uploadPath = `school/circular/`
        try {
            const uploadAttachment = await uploadMediaToS3(file, mimetype, file_name, uploadPath)
            if (uploadAttachment.success != true) {
                let uploadError = {
                    success: true,
                    error: uploadAttachment.response.code,
                    message: uploadAttachment.message
                }
                return errorResponse(res, uploadError, uploadAttachment.message != null ? uploadAttachment.message : 'Error! Attachment not Upload.', 200)
            }

            circularData.circular_url = uploadAttachment.response.Key
        } catch (err) {
            console.log(err)
            return errorResponse(res, {}, 'Attachment not uploaded on s3', 200)
        }

        const addCircular = await new Circular(circularData).save()

        if (addCircular == null) {
            return errorResponse(res, {}, 'Something went wrong! Circular not add', 400)
        }

        return successResponse(res, addCircular, `${requestData.circular_type} Successfully added`, 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/circular/edit/:circular_id (Edit Circular)
 * @access protected
 * @returns {*} result
 */
exports.editCircular = async function (req, res) {
    const { error, isValid } = circularValidation(req.body)

    if (!isValid) {
        return errorResponse(res, error, 'Invalid Request', 400)
    }

    try {
        const requestData = req.body
        const circular_id = req.params.circular_id
        const circularData = await Circular.findById(getObjectId(circular_id))
        if(circularData === null) {
            return errorResponse(res, {}, 'Invalid Circular id', 400)
        }
        
        circularData.circular_type = requestData.circular_type
        if(requestData.circular_type === 'circular'){
            circularData.title = requestData.title
        }

        if(requestData.circular_type === 'syllabus'){
            circularData.board = requestData.board
            circularData.standard = requestData.standard
            circularData.division = requestData.division
        }

        if(requestData.circular_type === 'notes'){
            circularData.title = requestData.title
            circularData.standard = requestData.standard
            circularData.division = requestData.division
            circularData.subject = requestData.subject
        }

        if (req.files !== null && !isEmpty(req.files.attachment)) {
            const attachment = req.files.attachment
            const file = attachment.data
            const mimetype = attachment.mimetype
            const file_name = attachment.name
            const uploadPath = `school/circular/`
            try {
                const uploadAttachment = await uploadMediaToS3(file, mimetype, file_name, uploadPath)
                if (uploadAttachment.success != true) {
                    let uploadError = {
                        success: true,
                        error: uploadAttachment.response.code,
                        message: uploadAttachment.message
                    }
                    return errorResponse(res, uploadError, uploadAttachment.message != null ? uploadAttachment.message : 'Error! Attachment not Upload.', 200)
                }

                circularData.circular_url = uploadAttachment.response.Key
            } catch (err) {
                console.log(err)
                return errorResponse(res, {}, 'Attachment not uploaded on s3', 200)
            }
        }

        const editCircular = await circularData.save()

        if (editCircular == null) {
            return errorResponse(res, {}, 'Something went wrong! Circular not update', 400)
        }

        return successResponse(res, editCircular, `${requestData.circular_type} Successfully updated`, 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/circular/remove/:circular_id (Remove Circular)
 * @access protected
 * @returns {*} result
 */
exports.removeCircular = async function (req, res) {
    try {
        const circular_id = req.params.circular_id
        const circularData = await Circular.findById(getObjectId(circular_id))
        if(circularData === null) {
            return errorResponse(res, {}, 'Invalid Circular id', 400)
        }
        
        const removeCircular = await circularData.deleteOne()

        if (removeCircular == null) {
            return errorResponse(res, {}, 'Something went wrong! Circular not removed', 400)
        }

        return successResponse(res, {}, `Successfully removed`, 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/circular/list/:type (Circular Listing)
 * @access protected
 * @returns {*} result
 */
 exports.listCircular = async function (req, res) {
    try {
        const circular_type = req.params.type
        const requestData = req.body
        const query = {
            circular_type: circular_type,
            status: 'active'
        }
        if(circular_type === 'syllabus'){
            if(requestData.board) {
                query.board = requestData.board
            }
            if(requestData.standard) {
                query.standard = requestData.standard
            }
            if(requestData.division) {
                query.division = requestData.division
            }
        }
        if(circular_type === 'notes'){
            if(requestData.standard) {
                query.standard = requestData.standard
            }
            if(requestData.division) {
                query.division = requestData.division
            }
            if(requestData.date) {
                const dateStart = moment(requestData.date).format('YYYY-MM-DDT00:00:00.000')
                const dateEnd = moment(requestData.date).format('YYYY-MM-DDT23:59:59.000')
                query.createdAt = {$gte: dateStart, $lte: dateEnd}
            }
            if(req._user.type === 'teacher') {
                query.teacher_id = getObjectId(req._user.id)
            }
        }

        const circularData = await Circular.find(query).sort({ createdAt: -1})
        const response = {
            circular: circularData,
            s3_url: `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/`
        }
        return successResponse(res, response, 'Listing', 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}

/**
 * @param {*} req request
 * @param {*} res request
 * @description POST api/v1/circular/detail/:circular_id (Circular Listing)
 * @access protected
 * @returns {*} result
 */
exports.detailCircular = async function (req, res) {
    try {
        const circular_id = req.params.circular_id
        
        const circularData = await Circular.findById(getObjectId(circular_id))
        if(circularData === null) {
            return errorResponse(res, {}, 'Invalid Circular id', 400)
        }
        const response = {
            circular: circularData,
            s3_url: `https://${process.env.s3_bucket}.s3.${process.env.s3_region}.amazonaws.com/`
        }
        return successResponse(res, response, `Detail`, 200)
    } catch (err) {
        return catchResponse(res, err, {}, 'Something went wrong', 500)
    }
}
import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import imageIcon from './../../assets/images/image_color.svg'
import { getAssignmentDetail, submitAssignment, getSubmittedAssignment, getSubmittedAssignmentsForStudent, updateSubmittedAssignmentStatus } from './../../api/assignmentAction'
import { errorToast, successToast } from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'
import { v4 } from 'uuid'
import { Button, Modal } from "react-bootstrap"
import { Dropdown, DropdownButton } from 'react-bootstrap'

interface Props {
    rootStore: RootStore
}

interface Assignment {
    _id: string
    subject: string
    description: string
    standard: string
    division: string
    submission_due: string
    attachment: string
    assignment_type: string
    createdAt: Date
    teacher: {
        first_name: string
        last_name: string
    }
}

interface AssignmentSubmission {
    _id: string
    assignment_id: string
    status: string
    attachment: string
    assignment_type: string
    createdAt: Date
    student: {
        first_name: string
        last_name: string
    }
}

const AssignmentDetail: React.FC<Props> = ({ rootStore }) => {
    const params: any = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [assignment, setAssignmentDetail] = useState<Assignment | undefined>(undefined)
    const [s3BucketUrl, setS3BucketUrl] = useState('')
    const [uploadAnswerSheet, setUploadAnswerSheet] = useState(false)
    const [assignmentStatus, setAssignmentStatus] = useState('')
    const [assignmentSubmission, setAssignmentSubmission] = useState([])
    const { userRole } = rootStore.authStore
    const { assignment_id } = params
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const [pdfUrl, setPdfUrl] = useState('')
    const [status, setStatus] = useState('pending')

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        getAssignments(assignment_id)
    }, [])

    const getAssignments = async (assignment_id: string) => {
        try {
            setIsLoading(true)
            const response = await getAssignmentDetail(assignment_id)
            const responseData = response.data
            setAssignmentDetail(responseData.data.assignment)
            getAssignmentStatus(responseData.data.assignment?.submission_due)
            setS3BucketUrl(responseData.data.s3_url)
            getSubmittedAssignments(assignment_id, {})
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const getSubmittedAssignments = async (assignment_id: string, filter: object) => {
        try {
            let response
            if (userRole === 'student') {
                response = await getSubmittedAssignmentsForStudent(assignment_id)
            } else {
                response = await getSubmittedAssignment(assignment_id, filter)
            }
            const responseData = response.data
            setAssignmentSubmission(responseData.data.submission)
        } catch (error) {
            console.log(error)
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const getMediaUrl = (type: string, url: string) => {
        const fullUrl = type === 'pdf' ? `${s3BucketUrl}${url}` : url
        if (type === 'pdf') {
            setPdfUrl(fullUrl)
            setShow(true)
        } else {
            window.open(fullUrl, '_blank')
        }
    }

    const getAssignmentStatus = (endTime: any) => {
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const end = moment(endTime).format('YYYY-MM-DD HH:mm:ss')
        let status
        if (now > end) {
            status = 'Finished'
            setAssignmentStatus(status)
        }
        if (now < end) {
            status = 'Live'
            setAssignmentStatus(status)
        }
    }

    const onSubmit = async (data: any) => {
        const postData = new FormData()
        postData.append('attachment', data.attachment[0]);
        postData.append('assignment_id', assignment_id)
        try {
            setIsLoading(true)
            const response = await submitAssignment(postData)
            const responseData = response.data
            if (responseData.status === 200) {
                setIsLoading(false)
                successToast(responseData.message)
                setUploadAnswerSheet(false)
                return
            }
            errorToast(responseData.message)
            setIsLoading(false)
            setUploadAnswerSheet(false)
        } catch (error) {
            console.log(error)
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const AssignmentStatus = async (assignment_submission_id: string, status: string) => {
        const data = {assignment_submission_id:assignment_submission_id, status: status}
        try {
            const response = await updateSubmittedAssignmentStatus(data)
            const responseData = response.data
            if (responseData.data.success === 0) {
                errorToast(responseData.data.message)
                return
            }
            successToast(responseData.message)
            getSubmittedAssignments(assignment_id, {})
        } catch (error) {
            errorToast('Error! something is wrong')
        }

    }

    const onFilterChange = (e: any) => {
        const name = e.target.name
        const value = e.target.value
        let data: any = {}
        if (name === 'status') {
            data.status = value
        }

        getSubmittedAssignments(assignment_id, data)
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row">
            <div className="mt-2">
                <HistoryBack text="Back" />
            </div>
            {
                assignment !== undefined &&
                <div className="col-12">
                    <div className="card mt-4">
                        <div className="table-responsive">
                            <table className="table assignment_table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Paper</th>
                                        <th>Standard/Division</th>
                                        <th>Teacher</th>
                                        <th>Assignment Due Date</th>
                                        <th>Status</th>
                                        {
                                            userRole === 'student' &&
                                            <th>Action</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='d-flex justify-content-between'>
                                            {assignment.subject}
                                        </td>
                                        <td>
                                            <a onClick={() => getMediaUrl(assignment.assignment_type, assignment.attachment)} target="_blank">
                                                <img src={imageIcon} alt="Image upload" height='40' width='40' />
                                            </a>
                                        </td>
                                        <td>Std: {assignment.standard} - {assignment.division}</td>
                                        <td>{assignment.teacher.first_name} {assignment.teacher.last_name}</td>
                                        <td>{moment(assignment.submission_due).format('DD/MM/YYYY  hh:mm A')}</td>
                                        <td>{assignmentStatus}</td>
                                        {
                                            userRole === 'student' &&
                                            <td>
                                                <button
                                                    className="btn btn-link"
                                                    disabled={assignmentStatus !== 'Finished' ? false : true}
                                                    onClick={() => setUploadAnswerSheet(!uploadAnswerSheet)}
                                                >Submit Assignment</button>
                                            </td>
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="card-body">
                            <div className="text-left rules_table">
                                <tr>
                                    <td>Rules and Regulations</td>
                                </tr>
                            </div>
                            <div className="assignment_rules_rules px-5">
                                {assignment.description}
                            </div>
                        </div>
                        {
                            (uploadAnswerSheet === true && userRole === 'student') && <>
                                <hr />
                                <div className="card-body">

                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="card-heading">Upload AnswerSheet</div>
                                        <div className="form-group">
                                            <input
                                                type="file"
                                                id="attachment"
                                                className="form-control"
                                                accept='.pdf'
                                                {...register('attachment', { required: true })}
                                            />
                                            {(errors.attachment && errors.attachment.type === 'required') && <p className="text-danger mb-0 text-left">Select Answer sheet to upload</p>}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={assignmentStatus !== 'Finished' ? false : true}
                                            className="btn btn-primary btn-block btn-login">Submit</button>
                                    </form>
                                </div> </>
                        }
                    </div>
                    {
                        (userRole === 'teacher') &&
                        <>
                            <div className="card-title mt-4">Submitted Assignments</div>
                            <div className="card mb-4">
                                <div className="card-body d-flex filters">
                                    <div className="attendance_filter">
                                        <div className="form-group">
                                            <label htmlFor="status">Status</label>
                                            <select
                                                className="form-control"
                                                id="status"
                                                name="status"
                                                onChange={onFilterChange}
                                            >
                                                <option value="">All</option>
                                                <option value="pending">Pending</option>
                                                <option value="redo">Redo</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card mb-4">
                                <div className="table-responsive">
                                    <table className="table assignment_table">
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>File</th>
                                                <th>Submission Date</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                assignmentSubmission.length === 0 ?
                                                    <tr><td colSpan={5} className="text-center">No record found</td></tr>
                                                    :
                                                    assignmentSubmission.map((submission: AssignmentSubmission) => {
                                                        return <tr key={v4()} className={(status === "Mark Complete" ? 'green_color' : '')}>
                                                            <td>{submission.student.first_name} {submission.student.last_name}</td>
                                                            <td>
                                                                <a onClick={() => getMediaUrl('pdf', submission.attachment)} target="_blank">
                                                                    <img src={imageIcon} alt="Image upload" height='40' width='40' />
                                                                </a>
                                                            </td>
                                                            <td>{moment(submission.createdAt).format('DD/MM/YYYY hh:mm A')}</td>
                                                            <td>
                                                                {
                                                                    (submission.status === 'complete') && <span className="badge badge-success">Complete</span>
                                                                }
                                                                {
                                                                    (submission.status === 'redo') && <span className="badge badge-danger">Redo</span>
                                                                }
                                                                {
                                                                    (submission.status === 'pending') && <span className="badge badge-dark">Pending</span>
                                                                }
                                                            </td>
                                                            <td>
                                                                <DropdownButton id="dropdown-basic-button" title="...">
                                                                    {
                                                                        submission.status !== 'complete' &&
                                                                        <Dropdown.Item onClick= { () =>AssignmentStatus(submission._id, 'complete') }>Mark Completed</Dropdown.Item>
                                                                    }
                                                                    {
                                                                        submission.status !== 'redo' &&
                                                                        <Dropdown.Item  onClick= { () =>AssignmentStatus(submission._id, 'redo') }>Redo</Dropdown.Item>
                                                                    }
                                                                </DropdownButton>
                                                            </td>
                                                        </tr>
                                                    })
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    }
                    {
                        (userRole === 'student') &&
                        <>
                            <div className="card-title mt-4">Submitted Assignments</div>
                            <div className="card mb-4">
                                <div className="table-responsive">
                                    <table className="table assignment_table">
                                        <thead>
                                            <tr>
                                                <th>File</th>
                                                <th>Submission Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                assignmentSubmission.length === 0 ?
                                                    <tr><td colSpan={2} className="text-center">No record found</td></tr>
                                                    :
                                                    assignmentSubmission.map((submission: AssignmentSubmission) => {
                                                        return <tr key={v4()}>
                                                            <td>
                                                                <a onClick={() => getMediaUrl('pdf', submission.attachment)} target="_blank">
                                                                    <img src={imageIcon} alt="Image upload" height='40' width='40' />
                                                                </a>
                                                            </td>
                                                            <td>{moment(submission.createdAt).format('DD/MM/YYYY hh:mm A')}</td>
                                                            <td>
                                                                {
                                                                    (submission.status === 'complete') && <span className="badge badge-success">Complete</span>
                                                                }
                                                                {
                                                                    (submission.status === 'redo') && <span className="badge badge-danger">Redo</span>
                                                                }
                                                                {
                                                                    (submission.status === 'pending') && <span className="badge badge-dark">Pending</span>
                                                                }
                                                            </td>
                                                        </tr>
                                                    })
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    }
                </div>
            }
        </div>
        <Modal size="xl" show={show} onHide={handleClose} >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <iframe
                    className="card-img-top timetable-img" 
                    src={`https://docs.google.com/viewer?url=${pdfUrl}&embedded=true`}
                ></iframe>
            </Modal.Body>
            {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer> */}
        </Modal>
    </Container>
}


export default observer(AssignmentDetail);
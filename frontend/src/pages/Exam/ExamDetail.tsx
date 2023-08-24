import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import imageIcon from './../../assets/images/image_color.svg'
import { getExamDetail, submitExamAnswers, getSubmittedExam } from './../../api/examAction'
import { errorToast, successToast } from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'
import { Button, Modal } from "react-bootstrap"

interface Props {
    rootStore: RootStore
}

interface Exam {
    _id: string
    subject: string
    description: string
    standard: string
    division: string
    exam_start: Date
    exam_end: Date
    attachment: string
    exam_type: string
    createdAt: Date
    teacher: {
        first_name: string
        last_name: string
    }
}

interface ExamSubmission {
    _id: string
    attachment: string
    createdAt: Date
    student: {
        first_name: string
        last_name: string
    }
}

const ExamDetail: React.FC<Props> = ({ rootStore }) => {
    const params: any = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [exam, setExamDetail] = useState<Exam | undefined>(undefined)
    const [s3BucketUrl, setS3BucketUrl] = useState('')
    const [uploadAnswerSheet, setUploadAnswerSheet] = useState(false)
    const [examStatus, setExamStatus] = useState('')
    const [examSubmission, setExamSubmission] = useState([])
    const { userRole } = rootStore.authStore
    const { exam_id } = params
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const [pdfUrl, setPdfUrl] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        getExams(exam_id)
    }, [])

    const getExams = async (exam_id: string) => {
        try {
            setIsLoading(true)
            const response = await getExamDetail(exam_id)
            const responseData = response.data
            setExamDetail(responseData.data.exam)
            getExamStatus(responseData.data.exam.exam_start, responseData.data.exam.exam_end)
            setS3BucketUrl(responseData.data.s3_url)
            if (userRole === 'principal' || userRole === 'management' || userRole === 'teacher' || userRole === 'admin') {
                getSubmittedExams(exam_id)
            }
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const getSubmittedExams = async (exam_id: string) => {
        try {
            const response = await getSubmittedExam(exam_id)
            const responseData = response.data
            setExamSubmission(responseData.data.exam_answers)
        } catch (error) {
            console.log(error)
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const getDuration = (startTime: any, endTime: any) => {
        const start = moment(startTime)
        const end = moment(endTime)
        const duration = moment.duration(end.diff(start))
        const hours = `${duration.asHours()} hour`
        return hours
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

    const getExamStatus = (startTime: any, endTime: any) => {
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const start = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
        const end = moment(endTime).format('YYYY-MM-DD HH:mm:ss')
        let status
        if (now > start && now > end) {
            status = 'Finished'
            setExamStatus(status)
        }
        if (now > start && now < end) {
            status = 'Live'
            setExamStatus(status)
        }
        if (now < start && now < end) {
            status = 'Up-Coming'
            setExamStatus(status)
        }
    }

    const onSubmit = async (data: any) => {
        const postData = new FormData()
        postData.append('attachment', data.answer_sheet[0]);
        postData.append('exam_id', exam_id)
        try {
            setIsLoading(true)
            const response = await submitExamAnswers(postData)
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
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row">
            <div className="my-2">
                <HistoryBack text="Back" />
            </div>
            {
                exam !== undefined &&
                <div className="col-12">
                    <div className="student_custom_scrollbar">
                        <div className="card card_div">
                            <div className="table-responsive">
                                <table className="table assignment_table">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Paper</th>
                                            <th>Standard/Division</th>
                                            <th>Examiner</th>
                                            <th>Exam Date</th>
                                            <th>Status</th>
                                            {userRole === 'student' &&
                                                <th>Action</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='d-flex justify-content-between'>
                                                {exam.subject}
                                            </td>
                                            <td>
                                                {(examStatus === 'Live' || userRole === 'teacher') ? <a onClick={() => getMediaUrl(exam.exam_type, exam.attachment)} target="_blank">
                                                    <img src={imageIcon} alt="Image upload" height='40' width='40' />
                                                </a> : <a href='#'>
                                                    <img src={imageIcon} alt="Image upload" height='40' width='40' />
                                                </a>}
                                            </td>
                                            <td>Std: {exam.standard} - {exam.division}</td>
                                            <td>{exam.teacher.first_name} {exam.teacher.last_name}</td>
                                            <td>
                                                {moment(exam.exam_start).format('DD/MM/YYYY')} ({getDuration(exam.exam_start, exam.exam_end)}) <br />
                                                {moment(exam.exam_start).format('hh:mm A')} to {moment(exam.exam_end).format('hh:mm A')} <br />
                                            </td>
                                            <td>{examStatus}</td>
                                            {userRole === 'student' &&
                                                <td>
                                                    <button
                                                        className="btn btn-link"
                                                        disabled={examStatus === 'Live' ? false : true}
                                                        onClick={() => setUploadAnswerSheet(!uploadAnswerSheet)}
                                                    >Upload Answer sheet</button>
                                                </td>
                                            }
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-body">
                                <div className="text-left rules_table">
                                    Rules and Regulations
                                </div>
                                <div className="exam_rules_rules px-5">
                                    {exam.description}
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
                                                    id="answer_sheet"
                                                    className="form-control"
                                                    accept='.pdf'
                                                    {...register('answer_sheet', { required: true })}
                                                />
                                                {(errors.answer_sheet && errors.answer_sheet.type === 'required') && <p className="text-danger mb-0 text-left">Select Answer sheet to upload</p>}
                                            </div>
                                            <button type="submit" disabled={examStatus === 'Live' ? false : true} className="btn btn-primary btn-block btn-login">Submit</button>
                                        </form>
                                    </div> </>
                            }
                        </div>
                        {
                            (userRole === 'principal' || userRole === 'management' || userRole === 'teacher' || userRole === 'admin') &&
                            <>
                                <div className="card-title mt-4">Submitted Answer Sheets</div>
                                <div className="card">
                                    <table className="table assignment_table">
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>File</th>
                                                <th>Submission Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                examSubmission.length === 0 ?
                                                    <tr><td colSpan={3} className="text-center">No record found</td></tr>
                                                    :
                                                    examSubmission.map((submission: ExamSubmission) => {
                                                        return <tr>
                                                            <td>{submission.student.first_name} {submission.student.last_name}</td>
                                                            <td>
                                                                <a onClick={() => getMediaUrl('pdf', submission.attachment)} target="_blank">
                                                                    <img src={imageIcon} alt="Image upload" height='40' width='40' />
                                                                </a>
                                                            </td>
                                                            <td>{moment(submission.createdAt).format('DD/MM/YYYY  hh:mm A')}</td>
                                                        </tr>
                                                    })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        }
                    </div>
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


export default observer(ExamDetail);
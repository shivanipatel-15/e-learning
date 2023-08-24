import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import binIcon from './../../assets/images/bin_color.svg'
import imageIcon from './../../assets/images/image_color.svg'
import editIcon from './../../assets/images/edit_color.svg'
import { getExam, removeExam } from './../../api/examAction'
import { errorToast, successToast } from './../../utility/toast'
import { Button, Modal } from "react-bootstrap"

const limit = 10
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

const ExamList: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [examList, setExamList] = useState([])
    const [s3BucketUrl, setS3BucketUrl] = useState('')
    const [page, setPage] = useState(1)
    const { userRole } = rootStore.authStore
    const [isMoreRecord, setIsMoreRecord] = useState(true)
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const [pdfUrl, setPdfUrl] = useState('')

    useEffect(() => {
        getExams(page)
    }, [])

    const getExams = async (page: number) => {
        try {
            setIsLoading(true)
            const response = await getExam(page)
            const responseData = response.data
            const exams = page === 1 ? responseData.data.exam : [...examList, ...responseData.data.exam]
            setExamList(exams)
            setS3BucketUrl(responseData.data.s3_url)
            setIsLoading(false)
            setIsMoreRecord((limit * page === responseData.data.exam.length) ? true : false)
        } catch (error) {
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
            return status
        }
        if (now > start && now < end) {
            status = 'Live'
            return status
        }
        if (now < start && now < end) {
            status = 'Up-Coming'
            return status
        }
    }

    const remove = async (exam_id: string) => {
        const confirmRemove = window.confirm('Are you sure to do this?')
        if (confirmRemove === false) {
            return
        }
        const data = { exam_id }
        try {
            const response = await removeExam(data)
            const responseData = response.data
            if (responseData.data.success === 0) {
                errorToast(responseData.data.message)
                return
            }
            successToast(responseData.message)
            getExams(page)
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    const loadMore = (page: number) => {
        page = page + 1
        setPage(page)
        getExams(page)
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row">
            {
                (rootStore.authStore.userRole === 'teacher') &&
                <div className="col-12 d-flex justify-content-end">
                    <Link to='/exam/add' className="btn btn-primary btn-login mt-3 px-5 mb-0">Add New Exam</Link>
                </div>
            }

            <div className="col-12">
                <div className="card mt-4">
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    examList.length === 0 ?
                                        <tr><td colSpan={7} className="text-center">No record found</td></tr>
                                        :
                                        examList.map((data: Exam) => {
                                            const key = uuidv4()
                                            const exam_id = data._id
                                            return <tr key={key}>
                                                <td className='d-flex justify-content-between'>
                                                    {data.subject}
                                                </td>
                                                <td>
                                                    {(getExamStatus(data.exam_start, data.exam_end) === 'Live' || userRole === 'teacher') ? <a onClick={() => getMediaUrl(data.exam_type, data.attachment)} target="_blank">
                                                        <img src={imageIcon} alt="Image upload" height='40' width='40' />
                                                    </a> : <a href='#'>
                                                        <img src={imageIcon} alt="Image upload" height='40' width='40' />
                                                    </a>}
                                                </td>
                                                <td>Std: {data.standard} - {data.division}</td>
                                                <td>{data.teacher.first_name} {data.teacher.last_name}</td>
                                                <td>
                                                    {moment(data.exam_start).format('DD/MM/YYYY')} ({getDuration(data.exam_start, data.exam_end)}) <br />
                                                    {moment(data.exam_start).format('hh:mm A')} to {moment(data.exam_end).format('hh:mm A')} <br />
                                                </td>
                                                <td>{getExamStatus(data.exam_start, data.exam_end)}</td>
                                                <td>
                                                    {
                                                        userRole === 'teacher' ? <>
                                                            <Link to={`/exam/edit/${data._id}`}>
                                                                <img src={editIcon} alt="Edit icon" />
                                                            </Link>
                                                            <button
                                                                className='btn btn-link btn-action ml-2'
                                                                onClick={() => remove(exam_id)}>
                                                                <img src={binIcon} alt="Delete icon" />
                                                            </button>
                                                            <Link to={`/exam/detail/${data._id}`}>
                                                                View Detail
                                                            </Link>
                                                        </> : <>
                                                            <Link to={`/exam/detail/${data._id}`}>
                                                                View Detail
                                                            </Link>
                                                        </>
                                                    }
                                                </td>
                                            </tr>
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {
                    isMoreRecord === true &&
                    <div className="col-12 d-flex justify-content-center">
                        <button
                            className="btn btn-primary btn-login mt-3 px-5"
                            onClick={() => loadMore(page)}
                        >Load More</button>
                    </div>
                }
            </div>
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


export default observer(ExamList);
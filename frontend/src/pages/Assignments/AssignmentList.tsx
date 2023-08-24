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
import { getAssignment, removeAssignment, completeAssignment} from './../../api/assignmentAction'
import { errorToast, successToast } from './../../utility/toast'
import { Button, Modal } from "react-bootstrap"
import { Dropdown, DropdownButton } from 'react-bootstrap'

const limit = 10
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
    },
    status: string
}

const AssignmentList: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [assignmentList, setAssignmentList] = useState([])
    const [s3BucketUrl, setS3BucketUrl] = useState('')
    const [page, setPage] = useState(1)
    const { userRole } = rootStore.authStore
    const [isMoreRecord, setIsMoreRecord] = useState(true)
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const [pdfUrl, setPdfUrl] = useState('')

    useEffect(() => {
        getAssignments(page)
    }, [])

    const getAssignments = async (page: number) => {
        try {
            setIsLoading(true)
            const response = await getAssignment(page)
            const responseData = response.data
            const assignments = page === 1 ? responseData.data.assignment : [...assignmentList, ...responseData.data.assignment]
            setAssignmentList(assignments)
            setS3BucketUrl(responseData.data.s3_url)
            setIsLoading(false)
            setIsMoreRecord((page === responseData.data.assignment.length) ? true : false)
        } catch (error) {
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

    const remove = async (assignment_id: string) => {
        const confirmRemove = window.confirm('Are you sure to do this?')
        if (confirmRemove === false) {
            return
        }
        const data = { assignment_id }
        try {
            const response = await removeAssignment(data)
            const responseData = response.data
            if (responseData.data.success === 0) {
                errorToast(responseData.data.message)
                return
            }
            successToast(responseData.message)
            getAssignments(page)
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    const complete = async (assignment_id: string) => {
        const confirmRemove = window.confirm('Are you sure to complete assignment?')
        if (confirmRemove === false) {
            return
        }
        try {
            const response = await completeAssignment(assignment_id)
            const responseData = response.data
            if (responseData.data.success === 0) {
                errorToast(responseData.data.message)
                return
            }
            successToast(responseData.message)
            getAssignments(page)
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    const loadMore = (page: number) => {
        page = page + 1
        setPage(page)
        getAssignments(page)
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        {<>
            {/* //isLoading === false ?  */}
            <div className="row">
                {
                    (userRole === 'teacher') &&
                    <div className="col-12 d-flex justify-content-end add_btn">
                        <Link to='/assignment/add' className="btn btn-primary btn-login mt-3 px-5 mb-0">Add New Assignment</Link>
                    </div>
                }
                <div className="col-12">
                    <div className="card mt-4">
                        <div className="table-responsive">
                            <table className="table assignment_table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th></th>
                                        <th>Standard/Division</th>
                                        <th>Assign Date</th>
                                        <th>Due Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        assignmentList.length === 0 ?
                                            <tr><td colSpan={6} className="text-center">No record found</td></tr>
                                            :
                                            assignmentList.map((data: Assignment) => {
                                                const key = uuidv4()
                                                const assignment_id = data._id
                                                return <tr key={key}>
                                                    <td className='d-flex justify-content-between'>
                                                        <div className="assignment_description">
                                                            <div className="assignment_subject">{data.subject}</div>
                                                            <div className="assignment_standard">{data.description}</div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <a onClick={() => getMediaUrl(data.assignment_type, data.attachment)}>
                                                            <img src={imageIcon} alt="Image upload" height='40' width='40' />
                                                        </a>
                                                    </td>
                                                    <td>Std: {data.standard} - {data.division}</td>
                                                    <td>{moment(data.createdAt).format('DD/MM/YYYY  hh:mm A')}</td>
                                                    <td>{moment(data.submission_due).format('DD/MM/YYYY  hh:mm A')}</td>
                                                    {/* <td>
                                                        {
                                                            userRole !== 'student' && <>
                                                                <Link to={`/assignment/detail/${data._id}`}>View Detail</Link>

                                                                {
                                                                    (data.status !== 'completed') && <>
                                                                        <button
                                                                            className='btn btn-link btn-action mr-2'
                                                                            onClick={() => complete(assignment_id)}>
                                                                            Mark Complete
                                                                        </button>
                                                                        <Link
                                                                            className='btn btn-link btn-action'
                                                                            to={`/assignment/edit/${data._id}`}>
                                                                            <img src={editIcon} alt="Edit icon" />
                                                                        </Link>
                                                                    </>
                                                                }
                                                                <button
                                                                    className='btn btn-link btn-action ml-2'
                                                                    onClick={() => remove(assignment_id)}>
                                                                    <img src={binIcon} alt="Delete icon" />
                                                                </button>
                                                            </>
                                                        }
                                                        {
                                                            userRole === 'student' && <>
                                                                <Link to={`/assignment/detail/${data._id}`}>
                                                                    View Detail
                                                                </Link>
                                                            </>
                                                        }
                                                    </td> */}
                                                    <td>

                                                        <DropdownButton id="dropdown-basic-button" title="..." className="btn_title">
                                                            {userRole !== 'student' && <>
                                                                <Dropdown.Item>
                                                                    <Link to={`/assignment/detail/${data._id}`} className="view_link">View Detail</Link>
                                                                </Dropdown.Item>
                                                                {
                                                                    (data.status !== 'completed') && <>
                                                                        <Dropdown.Item >
                                                                            <button
                                                                                className='btn btn-link btn-action btn_name'
                                                                                onClick={() => complete(assignment_id)}>
                                                                                Mark Complete
                                                                            </button>
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item>
                                                                            <Link
                                                                                className='btn btn-link btn-action btn_name'
                                                                                to={`/assignment/edit/${data._id}`}>
                                                                                Edit Assignment
                                                                            </Link>
                                                                        </Dropdown.Item>
                                                                    </>
                                                                }
                                                                <Dropdown.Item>
                                                                    <button
                                                                        className='btn btn-link btn-action btn_name'
                                                                        onClick={() => remove(assignment_id)}>
                                                                        Delete Assignment
                                                                    </button>
                                                                </Dropdown.Item>
                                                            </>
                                                            }
                                                            {
                                                                userRole === 'student' && <>
                                                                <Dropdown.Item>
                                                                    <Link to={`/assignment/detail/${data._id}`}>
                                                                        View Detail
                                                                    </Link>
                                                                </Dropdown.Item>
                                                                </>

                                                            }
                                                        </DropdownButton>
                                                    </td>
                                                </tr>
                                            })
                                    }
                                </tbody>
                            </table>
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
            </div>
            {/* // : <></> */}
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
        </>
        }
    </Container >
}


export default observer(AssignmentList);
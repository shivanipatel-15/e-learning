import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import CountCard from './../../components/Widget/CountCard'
import AddIcon from './../../components/Widget/AddIcon'
import EditIcon from './../../components/Widget/EditIcon'
import { errorToast } from './../../utility/toast'
import { v4 as uuidv4 } from 'uuid'
import { getCircular } from './../../api/circularAction'
import moment from 'moment'
import { listTimeTable, getTodayClassesForStudent } from './../../api/timetableAction'
import UploadTimeTable from '../../components/TimeTable/UploadTimeTable'
import { Button, Modal } from "react-bootstrap"

interface Props {
    rootStore: RootStore
}

const StudentDashboard: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { userRole } = rootStore.authStore
    const [circularList, setCircularList] = useState([])
    const [s3BucketUrl, setS3BucketUrl] = useState('')
    const [timeTables, setTimeTable] = useState([])
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const [pdfUrl, setPdfUrl] = useState('')
    const [onlineClass, setOnlineClass] = useState([])

    const viewPdf = (s3Url: string, path: string) => {
        const url = `${s3Url}${path}`
        setPdfUrl(url)
        setShow(true)
    }

    useEffect(() => {
        getCirculars()
        getTimetable()
        getOnlineClass()
    }, [])

    const getCirculars = async () => {
        try {
            setIsLoading(true)
            const response = await getCircular()
            const responseData = response.data
            setCircularList(responseData.data.circular)
            setS3BucketUrl(responseData.data.s3_url)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const getTimetable = async () => {
        try {
            let data: any = {
                circular_for: userRole
            }

            if (userRole === 'student') {
                data.standard = rootStore.authStore.userLoginData.standard
                data.division = rootStore.authStore.userLoginData.division
            }

            setIsLoading(true)
            const response = await listTimeTable(data)
            const responseData = response.data
            setTimeTable(responseData.data.circular)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const getOnlineClass = async () => {
        try {
            setIsLoading(true)
            const data: any = {
                standard: rootStore.authStore.userLoginData.standard,
                division: rootStore.authStore.userLoginData.division
            }
            const response = await getTodayClassesForStudent(data)
            
            const responseData = response.data
            setOnlineClass(responseData.data)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }
    const today = moment().format('YYYY-MM-DD')
    
    return <>
        <div className="row mt-5">
            <div className="col-md-6 col-12">
                <div className="card card-dashboard">
                    <div className="card-body">
                        <div className="card-title">
                            <h5 className="mb-0">Notice Board</h5>
                        </div>
                        <div className="card-detail custom-scroll">
                            {
                                circularList.length > 0 ?
                                    <div className="notice">
                                        {circularList.map((data: any) => {
                                            return <div key={uuidv4()}>
                                                <div className="notice-body">
                                                    <p>{data.title}</p>
                                                </div>
                                                <div className="notice-header d-flex justify-content-between align-items-center notice_div">
                                                    <div className="notice-for">
                                                        <a className="badge custom-badge"
                                                            onClick={() => viewPdf(s3BucketUrl, data.circular_url)}>View</a>
                                                    </div>
                                                    <div className="notice-time">
                                                        {moment(data.createdAt).format(' Do MMMM YYYY, hh:mm a')}
                                                    </div>
                                                </div>

                                            </div>
                                        })}
                                    </div> : <div className='text-center'>No Data found</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-12">
                <div className="card card-dashboard card-online-class">
                    <div className="card-body">
                        <div className="card-title">
                            <h5 className="mb-0">Today's Classes</h5>
                        </div>
                        {
                            isLoading === false &&
                            <div className="card-detail custom-scroll">
                                {
                                    onlineClass.length > 0 ?
                                        onlineClass.map((classData: any) => {
                                            const startTime = `${today} ${classData.start_time}`
                                            const endTime = `${today} ${classData.end_time}`
                                            return <div key={uuidv4()} className="online-class d-flex align-items-center justify-content-between mb-3">
                                                <div className="class-title">{classData.subject} {moment(startTime).format(`hh:mm A`)} - {moment(endTime).format(`hh:mm A`)}</div>
                                                <div className="action">
                                                    <Link to={`/live-class`}><span className="badge custom-badge">Attend Class</span></Link>
                                                </div>
                                            </div>
                                        }) : <div className='text-center'>No record found</div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        <Modal size="xl" show={show} onHide={handleClose} >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <embed
                    className="card-img-top timetable-img"
                    src={pdfUrl}
                    type="application/pdf"
                />
            </Modal.Body>
            {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer> */}
        </Modal>
    </>
}


export default StudentDashboard;
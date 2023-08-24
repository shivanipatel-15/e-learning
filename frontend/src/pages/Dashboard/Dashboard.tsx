import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import CountCard from './../../components/Widget/CountCard'
import StudentDashboard from './StudentDashboard'
import { liveClassList } from './../../api/onlineClassAction'
import { errorToast } from './../../utility/toast'
import { v4 as uuidv4 } from 'uuid'
import { getCircular } from './../../api/circularAction'
import { listTimeTable, getTodayClassesForAdmins, getTodayClassesForTeacher } from './../../api/timetableAction'
import moment from 'moment'
import UploadTimeTable from '../../components/TimeTable/UploadTimeTable'
import { countUsers } from './../../api/userAction'
import { Button, Modal } from "react-bootstrap"
import Countdown from 'react-countdown';

interface Props {
    rootStore: RootStore
}

const Dashboard: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { userRole } = rootStore.authStore
    const [onlineClass, setOnlineClass] = useState([])
    const [circularList, setCircularList] = useState([])
    const [s3BucketUrl, setS3BucketUrl] = useState('')
    const [timeTables, setTimeTable] = useState([])
    const [userCount, setUserCount] = useState<any>()
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const [pdfUrl, setPdfUrl] = useState('')
   
    const viewPdf = (s3Url: string, path: string) => {
        const url = `${s3Url}${path}`
        setPdfUrl(url)
        setShow(true)
    }

    useEffect(() => {
        if (userRole !== 'student') {
            getCirculars()
            getUserCount()
        }

        if (userRole === 'admin' || userRole === 'principal' || userRole === 'vice_principal') {
            getTodayClass()
        }
        if (userRole === 'teacher') {
            setTimeout(() => {
                getTodayClass()
            }, 2000)
        }
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

    const getTodayClass = async () => {
        try {
            setIsLoading(true)
            let response: any
            if(userRole === 'teacher') {
                const data: any = {
                    teacher_id: rootStore.authStore.userLoginData._id
                }
                response = await getTodayClassesForTeacher(data)
            } else {
                response = await getTodayClassesForAdmins()
            }
            
            const responseData = response.data
            setOnlineClass(responseData.data)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const getUserCount = async () => {
        try {
            setIsLoading(true)
            const response = await countUsers()
            const responseData = response.data
            setUserCount(responseData.data)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }
    const today = moment().format('YYYY-MM-DD')
    const countDownForStartTime = (time: string, className: string) => {
        const today = moment().format('YYYY-MM-DD')
        const start_time = moment(`${today} ${time}`).format(`YYYY-MM-DD HH:mm`)
        return <Countdown date={start_time}>
            <Link to={`inspectClass/${className}`}>
                <span className="badge custom-badge">Inspect</span>
            </Link>
        </Countdown>
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        {
            userRole === 'student' ? <StudentDashboard rootStore={rootStore} /> :
                <>
                    <div className="row justify-content-center">
                        {
                            (userRole === 'admin' || userRole === 'management') &&
                            <>
                                <div className="col-md-3 col-12 my-5">
                                    <CountCard title="Teachers" count={userCount?.teacher} color="#f09992" to='add/teacher' />
                                </div>
                                <div className="col-md-3 col-12 my-5">
                                    <CountCard title="Students" count={userCount?.student} color="#5c4d8e" to='add/student' />
                                </div>
                                <div className="col-md-3 col-12 my-5">
                                    <CountCard title="Vice Principal" count={userCount?.vice_principal} color="#2d7567" to='add/vice_principal' />
                                </div>
                            </>
                        }
                        {
                            (userRole === 'admin' || userRole === 'principal' || userRole === 'vice_principal') &&
                            <div className="col-md-3 col-12 my-5">
                                <CountCard title="Management" count={userCount?.management} color="#ffc000" to='add/management' />
                            </div>
                        }
                    </div>
                    <div className={'row' + ((userRole !== 'admin' && userRole !== 'management') ? ' mt-5' : '')}>
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
                                                            <div className="class-title">Std {classData.standard} {classData.division} ({classData.subject}) {moment(startTime).format(`hh:mm A`)} - {moment(endTime).format(`hh:mm A`)} </div>
                                                            <div className="action">
                                                                <Link to={`inspectClass/${classData.class_name}`}>
                                                                    <span className="badge custom-badge">Inspect</span>
                                                                </Link>
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
    </Container>
}


export default Dashboard;
import { useState, useEffect } from 'react';
import Container from '../../components/Layout/Container'
import RootStore from '../../store/Root'
import { createClass, joinClass, leaveClass }  from './../../api/onlineClassAction'
import { saveStudentLoginTime, saveStudentLogoutTime }  from './../../api/attendanceAction'
import { profile }  from './../../api/authAction'
import { errorToast } from '../../utility/toast';
import { v4 } from 'uuid'
import { getTodayClassesForStudent, getTodayClassesForTeacher } from './../../api/timetableAction'
import Countdown from 'react-countdown';
import moment from 'moment';

interface Props {
    rootStore: RootStore
}

interface Class {
    standard: string
    division: string
    subject: string
    start_time: string
    end_time: string
}

const LiveClass: React.FC<Props> = ({ rootStore }) => {
    const [classStatus, setClassStatus] = useState(false)
    const [classUrl, setClassUrl] = useState('')
    const [subjects, setSubjects] = useState([])
    const { authStore } = rootStore
    const { userLoginData, userRole } = authStore
    const [classId, setClassId] = useState('')
    const [teacher_id, setTeacherId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [onlineClass, setOnlineClass] = useState([])

    const [classParam, setClass] = useState<Class>({
        standard: '',
        division: '',
        subject: '',
        start_time: '',
        end_time: ''
    })

    const getLoginUser = async () => {
        setIsLoading(true)
        try {
            const response = await profile()
            const responseData = response.data
            if(responseData.success === 0){
                errorToast(responseData.message)
                setIsLoading(false)
            }
            setSubjects(responseData.data.subjects)
            getTodayClass(responseData.data.user_type, responseData.data)
            setIsLoading(false)
        } catch(error) {
            errorToast(error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getLoginUser()
    }, [])

    const create_class = async (classDetail: any) => {
        try {
            const response = await createClass(classDetail)
            const responseData = response.data
            const classInfo = responseData.data
            const urlParams = {
                name: userLoginData.first_name,
                email: userLoginData.email,
                roomName: classInfo.class_name,
                user: 'teacher'
            }
            const searchParams = new URLSearchParams(urlParams).toString()
            const classUrl = `./videoCall.html?v=1.0&${searchParams}`
            setClassUrl(classUrl)
            setClassId(classInfo._id)
            setClassStatus(true)
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    const getTodayClass = async (user_type: string, userData: any) => {
        try {
            setIsLoading(true)
            let response: any
            if(user_type === 'teacher') {
                const data: any = {
                    teacher_id: userData._id
                }
                response = await getTodayClassesForTeacher(data)
            } else {
                const data: any = {
                    standard: userData.standard,
                    division: userData.division
                }
                response = await getTodayClassesForStudent(data)
            }
            
            const responseData = response.data
            setOnlineClass(responseData.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const findAndJoinClass = async (classDetail: any) => {
        try {
            const response = await joinClass(classDetail)
            const responseData = response.data
            const classInfo = responseData.data
            if(Object.keys(classInfo).length > 0){
                setTeacherId(classInfo.teacher_id)
                const attendanceData = {
                    teacher_id: teacher_id,
                    subject: classDetail.subject
                }
                await saveStudentLoginTime(attendanceData)
                
                const urlParams = {
                    name: userLoginData.first_name,
                    email: userLoginData.email,
                    roomName: classInfo.class_name,
                    user: 'student'
                }
                const searchParams = new URLSearchParams(urlParams).toString()
                const classUrl = `./videoCall.html?v=1.0&${searchParams}`
                setClassUrl(classUrl)
                setClassId(classInfo._id)
                setClassStatus(true)
                
            } else {
                errorToast(responseData.message)
            }
            
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    const leave_class = async () => {
        try {
            if(userLoginData.user_type === 'teacher'){
                await leaveClass({class_id: classId})
            }
            setClassUrl('')
            setClassStatus(false)
            if(userLoginData.user_type === 'student'){
                const attendanceData = {
                    teacher_id: teacher_id,
                    subject: classParam.subject
                }
                await saveStudentLogoutTime(attendanceData)
            }
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    const joinLiveClass = async (classInfo: any) => {
        setClass({ 
            subject: classInfo.subject, 
            standard: classInfo.standard, 
            division: classInfo.division,
            start_time: classInfo.start_time,
            end_time: classInfo.end_time,
        })
        try {
            if(userRole === 'teacher') {
                create_class({ subject: classInfo.subject, standard: classInfo.standard, division: classInfo.division })
            }

            if(userRole === 'student') {
                findAndJoinClass({ subject: classInfo.subject, standard: classInfo.standard, division: classInfo.division })
            }
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    const today = moment().format('YYYY-MM-DD')
    const countDownTimer = (time: string) => {
        const today = moment().format('YYYY-MM-DD')
        const start_time = moment(`${today} ${time}`).format(`YYYY-MM-DD HH:mm`)
        return <> Class End within: <Countdown date={start_time} /></>
    }
    
    
    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <div className="row">
            <div className="col-lg-4 col-md-12 mt-5">
                <div className="card card-dashboard">
                    <div className="card-body">
                        <div className="card-title">
                            <h5 className="mb-0">Today's Classes</h5>
                        </div>
                        {
                            isLoading === false &&
                            <div className="class-detail">
                                {
                                    onlineClass.length > 0 ?
                                        onlineClass.map((classData: any) => {
                                            const startTime = `${today} ${classData.start_time}`
                                            const endTime = `${today} ${classData.end_time}`
                                            return <div key={v4()} className="online-class d-flex align-items-center justify-content-between mb-3">
                                                <div className="class-title">
                                                    {
                                                        userRole === 'teacher' ?
                                                        `Std ${classData.standard} ${classData.division} (${classData.subject}) ${moment(startTime).format(`hh:mm A`)} - ${moment(endTime).format(`hh:mm A`)}` : 
                                                        `${classData.subject} ${moment(startTime).format(`hh:mm A`)} - ${moment(endTime).format(`hh:mm A`)}`
                                                    }
                                                </div>
                                                <div className="action">
                                                    <button 
                                                        className='btn text-white btn-block badge custom-badge m-0'
                                                        onClick={() => joinLiveClass(classData)}
                                                    >{ userLoginData.user_type === 'student' ?  'Attend Class' : 'Create Class' }</button>
                                                </div>
                                            </div>
                                        }) : <div className='text-center'>No record found</div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
            {
                classStatus === true && <div className="col-lg-8 col-12 mt-5 text-right">
                    {countDownTimer(classParam.end_time)}
                     <button 
                        className="btn btn-primary btn-login m-0 mb-2 ml-2" 
                        onClick={leave_class}
                    >Leave Class</button>
                    <iframe 
                        className="videoCall custom-scroll iframe_size" 
                        src={classUrl}
                    ></iframe>
                </div>
            }
        </div>
    </Container>
}


export default LiveClass;
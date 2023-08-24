import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { meetingList, joinMeeting, meetingLeave } from './../../api/meetingAction'
import { errorToast, successToast } from './../../utility/toast'

const limit = 10
interface Props {
    rootStore: RootStore
}


const ListMeeting: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [meetings, setMeetings] = useState([])
    const [classStatus, setClassStatus] = useState(false)
    const [classUrl, setClassUrl] = useState('')
    const [meeting_id, setMeetingId] = useState('')
    const { authStore } = rootStore
    const { userLoginData, userRole } = authStore
    
    useEffect(() => {
        getMeetings()
    }, [])

    const getMeetings = async () => {
        try {
            setIsLoading(true)
            const response = await meetingList()
            const responseData = response.data
            setMeetings(responseData.data)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const joinMeetings = async (meeting_id: string) => {        
        try {
            const data = { meeting_id }
            const response = await joinMeeting(data)
            const responseData = response.data
            const meetingInfo = responseData.data
            if(Object.keys(meetingInfo).length > 0){
                const urlParams = {
                    name: userLoginData.first_name,
                    email: userLoginData.email,
                    roomName: meetingInfo.subject,
                    user: (userLoginData.user_type === 'admin' || userLoginData.user_type === 'principal') ? 'teacher' : 'student'
                }
                const searchParams = new URLSearchParams(urlParams).toString()
                const classUrl = `./videoCall.html?v=1.0&${searchParams}`
                setClassUrl(classUrl)
                setMeetingId(meeting_id)
                setClassStatus(true)
            } else {
                errorToast(responseData.message)
            }
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    const leaveMeeting = async () => {
        try {
            const data = { meeting_id }
            const response = await meetingLeave(data)
            const responseData = response.data
            setClassUrl('')
            setMeetingId('')
            setClassStatus(false)
            getMeetings()
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row">
            <div className="my-3 col-12 d-flex justify-content-between">
                <h4>Meetings</h4>
                { 
                    (rootStore.authStore.userRole === 'admin' && classStatus === false) &&
                    <Link to='/meeting/create' className="btn btn-primary btn-login mt-0 px-5">Create new meeting</Link>
                }
                {
                    classStatus === true && 
                    <button className="btn btn-primary btn-login mt-0 px-5"  onClick={() => leaveMeeting()}>Leave Meeting</button>
                }
            </div>
            {
                classStatus === false && 
                <div className="col-12">
                    <div className="card">
                        <div className="table-responsive">
                            <table className="table assignment_table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Meeting Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        meetings.length === 0 ?
                                            <tr><td colSpan={4} className="text-center">No record found</td></tr>
                                            :
                                            meetings.map((data: any) => {
                                                return <tr key={uuidv4()}>
                                                    <td className='d-flex justify-content-between'>
                                                        {data.subject}
                                                    </td>
                                                    <td>
                                                        {moment(data.start_date_time).format('DD/MM/YYYY')} 
                                                        <br />
                                                        {moment(data.start_date_time).format('hh:mm A')} to {moment(data.end_date_time).format('hh:mm A')} <br />
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className='btn btn-primary m-0'
                                                            onClick={() => joinMeetings(data._id)}
                                                        >Join Meeting</button>
                                                    </td>
                                                </tr>
                                            })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            }
            
            {
                classStatus === true && 
                <div className="col-12">
                    <div className="card">
                        <iframe 
                            className="videoCall custom-scroll iframe_size" 
                            src={classUrl}
                        ></iframe>        
                    </div>
                </div>
            }
            
        </div>
    </Container>
}


export default observer(ListMeeting);
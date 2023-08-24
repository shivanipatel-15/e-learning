import React from 'react'
import RootStore from '../../store/Root'
import Container from './../../components/Layout/Container'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { standard } from './../../utility/standard'
import { division } from './../../utility/division'
import { errorToast, successToast } from '../../utility/toast'
import { profile } from './../../api/authAction'
import { getTimeTableList, removeTimetable } from './../../api/timetableAction'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { getAllTeachers } from './../../api/userAction'


interface Props {
    rootStore: RootStore
}

const TimeTableList: React.FC<Props> = ({ rootStore }) => {
    const [isSearch, setIsSearch] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [timeTableList, setTimeTableList] = useState([])
    const [userRole, setUserRole] = useState('')
    const [teachers, setTeachers] = useState([])
    const [filter, setFilter] = useState<any>({
        teacher_id: '',
        standard: '',
        division: '',
        day: ''
    })
    const today = moment().format('YYYY-MM-DD')

    const getLoginUser = async () => {
        setIsLoading(true)
        try {
            const response = await profile()
            const responseData = response.data
            if (responseData.success === 0) {
                errorToast(responseData.message)
                setIsLoading(false)
            }
            setUserRole(responseData.data.user_type)
            if (responseData.data.user_type === 'student') {
                const data: any = {
                    standard: responseData.data.standard,
                    division: responseData.data.division
                }
                setFilter(data)
                getTimeTables(data)
            } else {
                getTimeTables(filter)
            }
            setIsLoading(false)
        } catch (error) {
            errorToast(error)
            setIsLoading(false)
        }
    }

    const getTeachers = async () => {
        try {
            setIsLoading(true)
            const response = await getAllTeachers()
            const responseData = response.data
            setTeachers(responseData.data)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getLoginUser()
        getTeachers()
    }, [])

    const getTimeTables = async (filter: any) => {
        setIsSearch(true)
        try {
            const response = await getTimeTableList(filter)
            const responseData = response.data
            if (responseData.success === 0) {
                errorToast(responseData.message)
                setIsSearch(false)
            }
            setTimeTableList(responseData.data)
            setIsSearch(false)
        } catch (error) {
            errorToast(error)
            setIsSearch(false)
        }
    }

    const onChange = (e: any) => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'standard') {
            filter.standard = value
        } else if (name === 'division') {
            filter.division = value
        } else if (name === 'teacher') {
            filter.teacher_id = value
        } else if (name === 'day') {
            filter.day = value
        }
        setFilter(filter)
        getTimeTables(filter)
    }

    const remove = async (timetable_id: string) => {
        const confirm = window.confirm('Are you sure to delete timetable?')
        if(confirm === false) {
            return false
        }
        setIsSearch(true)
        try {
            const response = await removeTimetable(timetable_id)
            const responseData = response.data
            if (responseData.success === 0) {
                errorToast(responseData.message)
                setIsSearch(false)
                return false
            }
            successToast(responseData.message)
            getTimeTables(filter)
            setIsSearch(false)
        } catch (error) {
            errorToast(error)
            setIsSearch(false)
        }
        
        
    }

    return (<Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <>
        <div className="row">
            {
                (userRole === 'admin') &&
                <div className="mb-3 col-12 d-flex justify-content-end add_btn">
                    <Link to='/timetable/add' className="btn btn-primary btn-login px-5 mb-0">Import Timetable</Link>
                </div>
            }
        </div>
        <div className="row">
            <div className="col-12">
                {
                    (userRole !== 'student') &&
                    <div className=" card syllabus_card">
                        <div className="card-body d-flex justify-content-around align-items-center filters">
                            <div className="attendance_filter">
                                <div className="form-group">
                                    <label htmlFor="day">Day</label>
                                    <select className="form-control" id="day" name="day" onChange={onChange} defaultValue={filter.day}>
                                        <option value=''> All Day </option>
                                        <option value='monday'>Monday</option>
                                        <option value='tuesday'>Tuesday</option>
                                        <option value='wednesday'>Wednesday</option>
                                        <option value='thursday'>Thursday</option>
                                        <option value='friday'>Friday</option>
                                        <option value='saturday'>Saturday</option>
                                        <option value='sunday'>Sunday</option>
                                    </select>
                                </div>
                            </div>
                            <div className="attendance_filter">
                                <div className="form-group">
                                    <label htmlFor="teacher">Teacher</label>
                                    <select className="form-control" id="teacher" name="teacher" onChange={onChange} value={filter.teacher_id}>
                                        <option value=''> Select Teacher </option>
                                        {teachers.map((teacher: any) => {
                                            return <option  key={uuidv4()} value={teacher._id}
                                            >{teacher.username}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="attendance_filter">
                                <div className="form-group">
                                    <label htmlFor="standard">Standard</label>
                                    <select className="form-control" id="standard" name="standard" onChange={onChange} value={filter.standard}>
                                        <option value=''> Select Standard </option>
                                        {standard.map((std: any) => {
                                            return <option key={uuidv4()} value={std.id}>{std.text}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="attendance_filter">
                                <div className="form-group">
                                    <label htmlFor="division">Division</label>
                                    <select
                                        className="form-control"
                                        id="division"
                                        name="division"
                                        onChange={onChange}
                                        value={filter.division}
                                    >
                                        <option value=''> Select Division </option>
                                        {division.map((div: string) => {
                                            return <option key={uuidv4()} value={div}>{div}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className="card mt-4">
                    <div className="table-responsive">
                        <table className="table assignment_table">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Subject</th>
                                    <th>Time</th>
                                    <th>Standard</th>
                                    <th>Teacher</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (isSearch === false && timeTableList.length === 0) ?
                                        <tr><td colSpan={5} className="text-center">No record found</td></tr>
                                        :
                                        timeTableList.map((data: any) => {
                                            const startTime = moment(`${today} ${data.start_time}`).format(`hh:mm A`)
                                            const endTime = moment(`${today} ${data.end_time}`).format(`hh:mm A`)
                                            return <tr key={uuidv4()}>
                                                <td>{data.day}</td>
                                                <td>{data.subject}</td>
                                                <td>{startTime}-{endTime}</td>
                                                <td>{data.standard}-{data.division}</td>
                                                <td>{data.teacher_username}</td>
                                                {userRole === 'admin' &&
                                                    <td>
                                                        <DropdownButton id="dropdown-basic-button" title="..." className="btn_title">
                                                            <Dropdown.Item as="button">
                                                                <Link to={`/timetable/edit/${data._id}`} className='mr-2 action_info'>Edit Timetable</Link>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item as="button" onClick={() => remove(data._id)}>Remove Timetable</Dropdown.Item>
                                                        </DropdownButton>
                                                    </td>
                                                }
                                            </tr>
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* {
                    isMoreRecord === true &&
                    <div className="col-12 d-flex justify-content-center">
                        <button
                            className="btn btn-primary btn-login mt-3 px-5"
                            onClick={() => loadMore(filter.page)}
                        >Load More</button>
                    </div>
                } */}
            </div>
        </div>
        
        </>
    </Container>
    )
}

export default TimeTableList



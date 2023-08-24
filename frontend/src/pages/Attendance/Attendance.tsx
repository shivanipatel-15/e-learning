import moment from 'moment';
import { useState, useEffect } from 'react';
import Container from '../../components/Layout/Container'
import RootStore from '../../store/Root'
import { observer } from 'mobx-react'
import { getStudentList, saveAttendance } from './../../api/attendanceAction'
import { errorToast, successToast } from '../../utility/toast';
import { standard } from './../../utility/standard'
import { division } from './../../utility/division'
import { v4 as uuidv4 } from 'uuid'
import { profile } from './../../api/authAction'
interface Props {
    rootStore: RootStore
}

interface Filter {
    standard: string
    division: string
    subject: string
    date: any
}

interface AttendanceObj {
    id: string
    status: string
}

const Attendance: React.FC<Props> = ({ rootStore }) => {
    const [isApiCall, setIsApiCall] = useState(false)
    const dateNow = moment().format('YYYY-MM-DD')
    const [filter, setFilter] = useState<Filter>({
        standard: '',
        division: '',
        subject: '',
        date: dateNow
    })
    const [studentList, setStudentList] = useState([])
    const [studentAttendance, setStudentAttendance] = useState<any>([])
    const [subjects, setSubjects] = useState([])
    const [subject, setSubject] = useState('')

    const onChange = (e: any) => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'standard') {
            filter.standard = value
        } else if (name === 'division') {
            filter.division = value
        } else if (name === 'subject') {
            filter.subject = value
        } else if (name === 'date') {
            filter.date = value
        }
        setFilter(filter)
        getStudentLists(filter)
    }

    const onSubjectChange = (e: any) => {
        const value = e.target.value
        const arrayOfSubject = value.split("|")
        filter.standard = arrayOfSubject[0]
        filter.division = arrayOfSubject[1]
        filter.subject = arrayOfSubject[2]
        setSubject(value)
        setFilter(filter)
        getStudentLists(filter)
    }

    useEffect(() => {
        getLoginUser()
    }, [])

    const getLoginUser = async () => {
        try {
            const response = await profile()
            const responseData = response.data
            if (responseData.success === 0) {
                errorToast(responseData.message)
            }
            
            if (subjects.length === 0) {
                setSubjects(responseData.data.subjects)
            }

        } catch (error) {
            errorToast(error)
        }
    }

    useEffect(() => {
        getStudentLists(filter)
    }, [])

    const getStudentLists = async (filter: Filter) => {
        try {
            setIsApiCall(true)
            const response: any = await getStudentList(filter)
            if (response.data.success === 0) {
                errorToast(response.data.message)
                setIsApiCall(false)
                return
            }
            setStudentList(response.data.data)
            setIsApiCall(false)
            return
        } catch (error) {
            setIsApiCall(false)
            console.log(error)
            errorToast(error.message)
            return
        }
    }

    const onAttendanceChange = (e: any) => {
        const name = e.target.name
        const value = e.target.value
        const data = {
            id: name,
            status: value
        }

        const index = studentAttendance.findIndex((attendance: AttendanceObj) => attendance.id == name)
        if (index === -1) {
            studentAttendance.push(data)
        } else {
            studentAttendance[index].status = value
        }
        setStudentAttendance(studentAttendance)
    }

    const saveStudentAttendance = async () => {
        if (studentAttendance.length === 0) {
            errorToast('Mark Student Attendance first')
            return
        }
        try {
            const attendanceData = {
                students: studentAttendance,
                subject: filter.subject,
                division: filter.division,
                standard: filter.standard
            }
            const response: any = await saveAttendance(attendanceData)
            if (response.data.success === 0) {
                errorToast(response.data.message)
                return
            }
            successToast(response.data.message)
            return
        } catch (error) {
            console.log(error)
            errorToast(error.message)
            return
        }
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <div className="row">
            <div className="col-12">
                <div className="card mt-5">
                    <div className="card-body d-flex justify-content-between align-items-center main_div">
                        <div className="attendance_filter">
                            <div className="form-group">
                                <label htmlFor="standard">Standard, Division and subject</label>
                                <select
                                    className="form-control"
                                    id="class_subject"
                                    onChange={onSubjectChange}
                                    value={subject}
                                >
                                    <option value=''>Select Standard and class</option>
                                    {subjects.map((standard: any) => {
                                        return <option key={uuidv4()} value={`${standard.standard}|${standard.division}|${standard.subject}`}>Std: {standard.standard} - {standard.division} ( {standard.subject} )</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="attendance_filter">
                            <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    id="date"
                                    name="date"
                                    defaultValue={dateNow}
                                    onChange={onChange} />
                            </div>
                        </div>
                        <div className="attendance_filter d-flex align-items-center attendance">
                            <div className="attendance_status">
                                <button className="btn btn-primary btn-login m-0" onClick={saveStudentAttendance}>Save Attendance</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card mt-5">
                    <div className="table-responsive">
                        <table className="table attendance_table mb-0">
                            <thead className="table-header">
                                <tr>
                                    <th className="card_title">Roll Number</th>
                                    <th className="card_title">Student Name</th>
                                    <th className="card_title">Status</th>
                                    <th className="card_title">Login Time</th>
                                    <th className="card_title">Logout Time</th>
                                </tr>
                            </thead>
                            {
                                isApiCall === true ? 'Loading...' :
                                    <tbody className="table-body">
                                        {
                                            studentList.length === 0 ?
                                                <tr><td colSpan={6} className="text-center">No record found</td></tr>
                                                :
                                                studentList.map((student: any, index) => {
                                                    return <tr key={index}>
                                                        <td className="card_data align-middle">{student.roll_number}</td>
                                                        <td className="card_data align-middle">{student.first_name} {student.last_name}</td>
                                                        <td className="card_data align-middle">
                                                            <div className="btn-group">
                                                                <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name={student._id}
                                                                    id={"present" + student._id}
                                                                    onChange={onAttendanceChange}
                                                                    value="present"
                                                                    defaultChecked={((student.attendance !== null && student.attendance.status === 'present')) ? true : false}
                                                                />
                                                                <label className="btn btn-attendance btn-present" htmlFor={"present" + student._id}>Present</label>

                                                                <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name={student._id}
                                                                    id={"absent" + student._id}
                                                                    onChange={onAttendanceChange}
                                                                    defaultChecked={((student.attendance !== null && student.attendance.status === 'absent')) ? true : false} value="absent" />
                                                                <label className="btn btn-attendance btn-absent" htmlFor={"absent" + student._id}>Absent</label>

                                                                <input
                                                                    type="radio"
                                                                    className="btn-check"
                                                                    name={student._id}
                                                                    id={"late" + student._id}
                                                                    onChange={onAttendanceChange}
                                                                    defaultChecked={((student.attendance !== null && student.attendance.status === 'late')) ? true : false}
                                                                    value="late"
                                                                />
                                                                <label className="btn btn-attendance btn-late" htmlFor={"late" + student._id}>Late</label>
                                                            </div>
                                                        </td>
                                                        <td className="card_data align-middle">{ student.attendance?.login_time }</td>
                                                        <td className="card_data align-middle">{ student.attendance?.logout_time }</td>
                                                    </tr>
                                                })
                                        }
                                    </tbody>
                            }

                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Container>
}


export default observer(Attendance);
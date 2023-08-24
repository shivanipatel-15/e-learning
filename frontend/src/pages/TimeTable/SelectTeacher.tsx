import React, { useState, useEffect } from 'react'
import RootStore from '../../store/Root'
import Container from './../../components/Layout/Container'
import { listTimeTable } from '../../api/timetableAction'
import { getAllTeachers  } from '../../api/userAction'
import { errorToast } from '../../utility/toast'
import { v4 as uuidv4 } from 'uuid'
import UploadTimeTable from '../../components/TimeTable/UploadTimeTable'

interface Props {
    rootStore: RootStore
}

const SelectTeacher: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [teachers, setTeachers] = useState([])
    const [timetables, setSetTimetables] = useState([])
    const [s3BucketUrl, setS3BucketUrl] = useState('')

    useEffect(() => {
        getTeachers()
    }, [])

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

    const getTimetables = async (teacher_id: string) => {
        try {
            const data = {
                teacher_id: teacher_id,
                circular_for: 'teacher'
            }
            setIsLoading(true)
            const response = await listTimeTable(data)
            const responseData = response.data
            setSetTimetables(responseData.data.circular)
            setS3BucketUrl(responseData.data.s3_url)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    return (<Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <div className="row">
            <div className="col-12">
                <div className="card select-teacher-card">
                    <div className="card-body select-teacher-body">
                        <div className="row">
                            <div className="col-md-6 col-12">
                                <div className="select_box">
                                    <div className="form-group select_teacher_div">
                                        <label htmlFor="select-teacher" className="teacher_title">Teacher Timetable</label>
                                        <select
                                            className="form-control select_teacher_menu"
                                            id="select-teacher"
                                            onChange={(e) => getTimetables(e.target.value)}
                                        >
                                            <option value=''>Select Teacher</option>
                                            {teachers.map((teacher: any) => {
                                                return <option  key={uuidv4()} value={teacher._id}
                                                >{teacher.first_name} {teacher.last_name}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {
            (isLoading === false ) && 
            <div className="card select-teacher-card">
                <div className="card-body select-teacher-body">
                    {
                        timetables.length > 0 ? 
                        <div className="row">
                            {timetables.map((timetable: any) => {
                                return <div  key={uuidv4()} className="col-md-4 col-12">
                                    <UploadTimeTable
                                        avatar={`${s3BucketUrl}${timetable.circular_url}`}
                                        id={timetable._id} 
                                    />
                                </div>
                            })}
                        </div> : <div className='text-center'>No Data found</div>
                    }
                </div>
            </div>
        }
    </Container>
    )
}

export default SelectTeacher


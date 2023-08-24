import React, { useState } from 'react'
import RootStore from '../../store/Root'
import Container from './../../components/Layout/Container'
import { errorToast } from '../../utility/toast'
import { listTimeTable } from '../../api/timetableAction'
import { v4 as uuidv4 } from 'uuid'
import UploadTimeTable from '../../components/TimeTable/UploadTimeTable'
import { standard } from './../../utility/standard'

interface Props {
    rootStore: RootStore
}

const SelectStd: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [timetables, setSetTimetables] = useState([])
    const [s3BucketUrl, setS3BucketUrl] = useState('')

    const getTimetables = async (standard: string) => {
        try {
            const data = {
                standard: standard,
                circular_for: 'student'
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
                            <div className="col-md-4 col-12">
                                <div className="select_box">
                                    <div className="form-group select_teacher_div">
                                        <label htmlFor="select-teacher" className="teacher_title">Student Timetable</label>
                                        <select
                                            className="form-control select_teacher_menu"
                                            id="select-teacher"
                                            onChange={(e) => getTimetables(e.target.value)}
                                        >
                                            <option value=''>Select Standard</option>
                                            {standard.map((std: any) => {
                                                return <option key={uuidv4()} value={std.id}>{std.text}</option>
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
                                        name={`STD: ${timetable.standard} - ${timetable.division}`}
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

export default SelectStd


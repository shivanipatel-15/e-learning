import React, { useState } from 'react'
import Container from '../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useForm } from 'react-hook-form'
import { useParams, useHistory } from 'react-router-dom';
import { errorToast, successToast } from '../../utility/toast'
import { editTimeTable, detailTimetable } from '../../api/timetableAction'
import { getAllTeachers  } from '../../api/userAction'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { standard } from './../../utility/standard'
import { division } from './../../utility/division'

interface Props {
    rootStore: RootStore
}

const AddTimeTablePage: React.FC<Props> = ({ rootStore }) => {
    const history = useHistory()
    const { timetable_id } = useParams<any>()
    const [isLoading, setIsLoading] = useState(false)
    const [isTimetableLoading, setIsTimetableLoading] = useState(false)
    const [teachers, setTeachers] = useState([])
    const [timetable, setTimeTableDetail] = useState<any>({})
    
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        getTeachers()
        getTimetable(timetable_id)
    }, [])


    const onSubmit = async (data: any) => {
        console.log(data)
        try {
            const response = await editTimeTable(data, timetable_id)
            const responseData = response.data
            if(responseData.success === 0){
                errorToast(responseData.message)
                return
            }
            successToast(responseData.message)
            history.goBack()
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    const getTimetable = async (timetable_id: string) => {
        try {
            setIsTimetableLoading(true)
            const response = await detailTimetable(timetable_id)
            const responseData = response.data
            setTimeTableDetail(responseData.data)
            setIsTimetableLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsTimetableLoading(false)
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

    return (<Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <div className="row justify-content-center">
            <div className="col-md-6 col-12 my-5">
                <div className="card add_timetable_card ">
                    <div className="card-body add_timetable_cardbody">
                        <h5 className="card-title"> Edit TimeTable</h5>
                        {
                            isTimetableLoading === false && 
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="select_box">
                                    <div className="form-group teacher_timetable_div">
                                        <label htmlFor="select-teacher" >Select Teacher</label>
                                        <select
                                            className="form-control"
                                            id="select-teacher"
                                            defaultValue={timetable.teacher_id}
                                            {...register('teacher_id', { required: true })}
                                        >
                                            <option value=''>Select Teacher</option>
                                            {teachers.map((teacher: any) => {
                                                return <option  key={uuidv4()} value={teacher._id}
                                                >{teacher.first_name} {teacher.last_name}</option>
                                            })}
                                        </select>
                                        {(errors.teacher_id && errors.teacher_id.type === 'required') &&
                                            <p className="text-danger mb-0 text-left">Select Teacher</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="standard">Standard</label>
                                    <select
                                        className="form-control"
                                        id="standard"
                                        defaultValue={timetable.standard}
                                        {...register('standard', { required: true })}
                                    >
                                        <option value=''>--- Select Standard ---</option>
                                        {standard.map((std: any) => {
                                            return <option key={uuidv4()} value={std.id}>{std.text}</option>
                                        })}
                                    </select>
                                    {
                                        (errors.standard && errors.standard.type === 'required') &&
                                        <p className="text-danger mb-0 text-left">Select Standard</p>
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="division">Division</label>
                                    <select
                                        className="form-control"
                                        id="division"
                                        defaultValue={timetable.division}
                                        {...register('division', { required: true })}
                                    >
                                        <option value=''>--- Select Division ---</option>
                                        {division.map((div: string) => {
                                            return <option key={uuidv4()} value={div}>{div}</option>
                                        })}
                                    </select>
                                    {(errors.division && errors.division.type === 'required') && <p className="text-danger mb-0 text-left">Select Division</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input 
                                        type="text" 
                                        id="subject"
                                        className="form-control" 
                                        placeholder="Enter Subject" 
                                        defaultValue={timetable.subject}
                                        {...register('subject', { required: true })}
                                    />
                                    { (errors.subject && errors.subject.type === 'required') && <p className="text-danger mb-0 text-left">Enter Subject</p> }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="day">Day</label>
                                    <select className="form-control" id="day" defaultValue={timetable.day} {...register('day', { required: true })}>
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
                                <div className="form-row">
                                    <div className="col-md-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="start_time">Start time</label>
                                            <input 
                                                type="text" 
                                                id="start_time"
                                                className="form-control" 
                                                placeholder="Enter Start time" 
                                                defaultValue={timetable.start_time}
                                                {...register('start_time', { 
                                                    required: 'Enter Start time',
                                                    pattern: {
                                                        value: new RegExp('^[0-9]{2}:+[0-9]{2}$'),
                                                        message: "Time must be hh:mm format in 24hour"
                                                    }
                                                })}
                                            />
                                            { (errors.start_time) && <p className="text-danger mb-0 text-left">{errors.start_time.message}</p> }
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="end_time">End time</label>
                                            <input 
                                                type="text" 
                                                id="end_time"
                                                className="form-control" 
                                                placeholder="Enter End time" 
                                                defaultValue={timetable.end_time}
                                                {...register('end_time', { 
                                                    required: 'Enter End time',
                                                    pattern: {
                                                        value: new RegExp('^[0-9]{2}:+[0-9]{2}$'),
                                                        message: "Time must be hh:mm format in 24hour"
                                                    }
                                                })}
                                            />
                                            { (errors.end_time) && <p className="text-danger mb-0 text-left">{errors.end_time.message}</p> }
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-block btn-login"
                                >Submit</button>
                            </form>
                        }
                    </div>
                </div>
            </div>
        </div>
    </Container>
    )
}

export default AddTimeTablePage


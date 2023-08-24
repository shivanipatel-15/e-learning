import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useParams } from 'react-router-dom'
import { detailUser, assignSubjects, removeSubjects } from './../../api/userAction'
import { errorToast, successToast } from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'
import { v4 as uuidv4 } from 'uuid'
import { standard } from './../../utility/standard'
import { division } from './../../utility/division'
import { useForm } from 'react-hook-form'
import binIcon from './../../assets/images/bin_color.svg'

interface Props {
    rootStore: RootStore
}

const AssignSubjects: React.FC<Props> = ({ rootStore }) => {
    const params: any = useParams()
    const { teacher_id } = params
    const [isLoading, setIsLoading] = useState(false)
    const [teacher, setTeacherDetail] = useState<any>(undefined)
    const [subjects, setAssignSubjects] = useState<any>([])
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    useEffect(() => {
        getUserDetail(teacher_id)
    }, [])

    const getUserDetail = async (teacher_id: string) => {
        try {
            setIsLoading(true)
            const response = await detailUser(teacher_id)
            const responseData = response.data
            setTeacherDetail(responseData.data)
            setAssignSubjects(responseData.data.subjects)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const addSubject = async (data: any) => {
        try {
            data.teacher_id = teacher_id
            data.uuid = uuidv4()
            setIsLoading(true)
            const response = await assignSubjects(data)
            const responseData = response.data
            if(responseData.success === 0) {
                errorToast(responseData.message)
                setIsLoading(false)    
                return
            }
            subjects.push(data)
            setAssignSubjects(subjects)
            setIsLoading(false)
            successToast(responseData.message)
            reset()
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const removeSubject = async (subject_id: string) => {
        const confirm = window.confirm('Are you sure to do this?')
        if(confirm === false) {
            return false
        }
        try {
            const data = { teacher_id, subject_id }
            setIsLoading(true)
            const response = await removeSubjects(data)
            const responseData = response.data
            if(responseData.success === 0) {
                errorToast(responseData.message)
                setIsLoading(false)    
                return
            }
            const subject = subjects.filter((subject: any) => subject.uuid !== subject_id)
            setAssignSubjects(subject)
            setIsLoading(false)
            successToast(responseData.message)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }
    

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row">
            <div className="my-2">
                <HistoryBack text="Back" /> {teacher?.first_name} {teacher?.last_name}'s Subject
            </div>
        </div>
        <div className="row">
            <div className="col-6">
                <div className="card">
                    <div className="card-header">
                        <h5 className='card-title mb-0'>Assign Subject</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(addSubject)}>
                            <div className="col-md-12 col-12">
                                <div className="form-group">
                                    <label htmlFor="standard">Standard</label>
                                    <select
                                        className="form-control"
                                        id="standard"
                                        {...register('standard', { required: 'Select Standard' })}
                                    >
                                        <option value=''>Select Standard</option>
                                        {standard.map((std: any) => {
                                            return <option key={uuidv4()} value={std.id}>{std.text}</option>
                                        })}
                                    </select>
                                    {(errors.standard) && <p className="text-danger mb-0 text-left">{errors.standard.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-12 col-12">
                                <div className="form-group">
                                    <label htmlFor="division">Division</label>
                                    <select
                                        className="form-control"
                                        id="division"
                                        {...register('division', { required: 'Select Division' })}
                                    >
                                        <option value=''>Select Division</option>
                                        {division.map((div: string) => {
                                            return <option key={uuidv4()} value={div}>{div}</option>
                                        })}
                                    </select>
                                    {(errors.division) && <p className="text-danger mb-0 text-left">{errors.division.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-12 col-12">
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input 
                                        type="text" 
                                        id="subject"
                                        className="form-control" 
                                        placeholder="Enter Subject" 
                                        {...register('subject', { required: 'Enter Subject' })} />
                                    {(errors.subject) && <p className="text-danger mb-0 text-left">{errors.subject.message}</p>}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block btn-login">Save</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-6">
                <div className="card">
                    <div className="table-responsive">
                        <table className="table assignment_table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Standard</th>
                                    <th>Division</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    subjects.length === 0 ?
                                        <tr><td colSpan={4} className="text-center">No record found</td></tr>
                                        :
                                        subjects.map((subject: any) => {
                                            return <tr key={uuidv4()}>
                                                <td>{subject.subject}</td>
                                                <td>{subject.standard}</td>
                                                <td>{subject.division}</td>
                                                <td>
                                                    <button 
                                                        className='btn btn-link btn-action ml-2'
                                                        onClick={() => removeSubject(subject.uuid)}>
                                                        <img src={binIcon} alt="Delete icon"/>
                                                    </button>
                                                </td>
                                            </tr>
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Container>
}


export default observer(AssignSubjects);
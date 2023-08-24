import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useForm } from 'react-hook-form'
import { errorToast } from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'
import { v4 } from 'uuid'
import { getAllStaffList } from './../../api/userAction'
import { createMeeting } from './../../api/meetingAction'
import Select from 'react-select';

interface Props {
    rootStore: RootStore
}

const CreateMeeting: React.FC<Props> = ({ rootStore }) => {
    const history = useHistory()
    const [staff, setStaff] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false)
    const [staffIds, setStaffIDs] = useState<any>([])
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm()

    useEffect(() => {
        getAllStaff()
    }, [])

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    const getAllStaff = async () => {
        try {
            setIsLoading(true)
            const response = await getAllStaffList()
            const responseData = response.data
            if (responseData.success === 0) {
                errorToast(responseData.message)
            }
            let options: any[] = []
            const websiteOptions = responseData.data.map((option: any) => ({ 
                label: `${option.first_name} ${option.last_name} (${option.user_type})`, 
                value: option._id 
            }))
            options.push(...websiteOptions)
            setStaff(options)
            setIsLoading(false)
        } catch (error) {
            errorToast(error)
            setIsLoading(false)
        }
    }

    const handleChange = (selectedOption: any, e: any) => {
        const staffIds = [...selectedOption].map(opt => opt.value);
        setStaffIDs(staffIds)
        setValue('user_ids', staffIds)
    }

    const onSubmit = async (data: any) => {
        try {
            createMeeting(data)
            history.push('/meetings')
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <div className="row justify-content-center">
            <div className="col-md-6 col-12 my-5">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title"><HistoryBack /> Create Meeting</h5>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="subject">Topic for meeting</label>
                                <input
                                    type="subject"
                                    id="subject"
                                    className="form-control"
                                    placeholder="Topic for meeting"
                                    {...register('subject', { required: true, maxLength: 30 })}
                                />
                                {(errors.subject && errors.subject.type === 'required') && <p className="text-danger mb-0 text-left">Enter Notes Title</p>}
                                {(errors.subject && errors.subject.type === "maxLength") && <p className="text-danger mb-0 text-left">Max 30 characters are allowed</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Select Staff for meeting</label>
                                <Select
                                    isMulti
                                    options={staff}
                                    id="class_subject"
                                    {...register('user_ids', { required: true })}
                                    onChange={handleChange}
                                    defaultValue={staffIds}
                                />
                                {(errors.user_ids && errors.user_ids.type === 'required') && <p className="text-danger mb-0 text-left">Select Staff members</p>}
                            </div>
                            <div className="form-row">
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="start_date">Meeting Start date-time</label>
                                        <input 
                                            className="form-control"
                                            type="datetime-local" 
                                            id="start_date" 
                                            {...register('start_date', { required: true })} />
                                        {(errors.start_date && errors.start_date.type === 'required') && <p className="text-danger mb-0 text-left">Enter Meeting Start date and time</p>}
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="end_date">Meeting End date-time</label>
                                        <input 
                                            className="form-control"
                                            type="datetime-local" 
                                            id="end_date" 
                                            {...register('end_date', { required: true })} />
                                        {(errors.end_date && errors.end_date.type === 'required') && <p className="text-danger mb-0 text-left">Enter Meeting End date and time</p>}
                                    </div>
                                </div>
                            </div>
                           
                            <button
                                type="submit"
                                className="btn btn-primary btn-block btn-login"
                            >Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Container>
}


export default CreateMeeting;
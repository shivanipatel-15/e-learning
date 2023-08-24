import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useForm } from 'react-hook-form'
import { addUser } from './../../api/userAction'
import { errorToast, successToast } from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'
import { standard } from './../../utility/standard'
import { division } from './../../utility/division'
import { v4 as uuidv4 } from 'uuid'

interface Props {
    rootStore: RootStore
}

interface ParamTypes {
    user_type: string;
}

const AddUsers: React.FC<Props> = ({ rootStore }) => {
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(false)
    const [isClassTeacher, setIsClassTeacher] = useState(false)
    const { user_type } = useParams<ParamTypes>()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    let user = ''
    if(user_type === 'teacher') {
        user =  'Teacher'
    } else if(user_type === 'management') {
        user =  'Management'
    } else if(user_type === 'vice_principal') {
        user =  'Vice Principal'
    } else if(user_type === 'student') {
        user =  'Student'
    } else {
        errorToast('Invalid Url')
        history.push('/dashboard')
    }

    const onSubmit = async (data: any) => {
        setIsLoading(true)
        try {
            data.user_type = user_type
            if(user_type === 'teacher') {
                data.is_class_teacher = {
                    status: data.class_teacher,
                    class: {
                        standard: data.standard,
                        division: data.division
                    }
                }
            }
            const response = await addUser(data)
            const responseData = response.data
            if (responseData.success === 0) {
                setIsLoading(false)
                errorToast(responseData.message)
                return
            }
            setIsLoading(false)
            successToast('Profile Created')
            history.push('/dashboard')
        } catch (error) {
            setIsLoading(false)
            errorToast(error)
        }
    }
    
    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row">
            <div className="col-md-6 col-12 my-5">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title"><HistoryBack /> Add { user }</h5>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-row">
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="first_name">First Name</label>
                                        <input 
                                            type="text" 
                                            id="first_name"
                                            className="form-control" 
                                            placeholder="Enter First name" 
                                            {...register('first_name', { required: true })}
                                        />
                                        {
                                            (errors.first_name && errors.first_name.type === 'required') && <p className="text-danger mb-0 text-left">Enter First name</p>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="last_name">Last Name</label>
                                        <input 
                                            type="text" 
                                            id="last_name"
                                            className="form-control" 
                                            placeholder="Enter Last name" 
                                            {...register('last_name', { required: true })}
                                        />
                                        { (errors.last_name && errors.last_name.type === 'required') && <p className="text-danger mb-0 text-left">Enter Last name</p> }
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input 
                                    type="username" 
                                    id="username"
                                    className="form-control" 
                                    placeholder="Enter Username" 
                                    {...register('username', { required: true })}
                                />
                                {
                                    (errors.username && errors.username.type === 'required') && <p className="text-danger mb-0 text-left">Enter Username</p>
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email"
                                    className="form-control" 
                                    placeholder="Enter Email Address" 
                                    {...register('email', { required: true })}
                                />
                                {
                                    (errors.email && errors.email.type === 'required') && <p className="text-danger mb-0 text-left">Enter Email Address</p>
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact_no">Contact no</label>
                                <input 
                                    type="text" 
                                    id="contact_no"
                                    className="form-control" 
                                    placeholder="Enter Contact no" 
                                    {...register('contact_no')}
                                />
                                {
                                    (errors.contact_no && errors.contact_no.type === 'required') && <p className="text-danger mb-0 text-left">Enter Contact no</p>
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password" 
                                    id="password"
                                    className="form-control" 
                                    placeholder="Enter Password" 
                                    {...register('password', { required: true })}
                                />
                                {
                                    (errors.password && errors.password.type === 'required') && <p className="text-danger mb-0 text-left">Enter Password</p>
                                }
                            </div>
                            {
                                user_type === 'teacher' && 
                                <>
                                    <div className="form-check">
                                        <input 
                                            type="checkbox" 
                                            className="form-check-input" 
                                            id="isClassTeacher"
                                            {...register('class_teacher')}
                                            onChange={() => setIsClassTeacher(!isClassTeacher)}
                                        />
                                        <label className="form-check-label" htmlFor="isClassTeacher">Is Class Teacher?</label>
                                    </div>
                                    {
                                        isClassTeacher === true && 
                                        <>
                                            <div className="form-row">
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="standard">Standard</label>
                                                        <select
                                                            className="form-control"
                                                            id="standard"
                                                            {...register('standard', { required: true })}
                                                        >
                                                            <option value=''>Select Standard</option>
                                                            {standard.map((std: any) => {
                                                                return <option key={uuidv4()} value={std.id}>{std.text}</option>
                                                            })}
                                                        </select>
                                                        {(errors.standard && errors.standard.type === 'required') && <p className="text-danger mb-0 text-left">Select Standard</p>}
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="division">Division</label>
                                                        <select
                                                            className="form-control"
                                                            id="division"
                                                            {...register('division', { required: true })}
                                                        >
                                                            <option value=''>Select Division</option>
                                                            {division.map((div: string) => {
                                                                return <option key={uuidv4()} value={div}>{div}</option>
                                                            })}
                                                        </select>
                                                        {
                                                            (errors.division && errors.division.type === 'required') && <p className="text-danger mb-0 text-left">Select Division</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </>
                            }
                            {
                                user_type === 'student' && 
                                <>
                                    <div className="form-row">
                                        <div className="col-md-6 col-12">
                                            <div className="form-group">
                                                <label htmlFor="birth_date">Date of birth</label>
                                                <input 
                                                    type="date" 
                                                    id="birth_date"
                                                    className="form-control" 
                                                    {...register('birth_date', { required: true })}
                                                />
                                                {
                                                    (errors.birth_date && errors.birth_date.type === 'required') && <p className="text-danger mb-0 text-left">Enter Date of birth</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <label htmlFor="gender">Gender</label>
                                            <div className="form-group">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" id="male" value="male" {...register('gender', { required: true })} />
                                                    <label className="form-check-label" htmlFor="male">Male</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" id="female" value="female" {...register('gender', { required: true })} />
                                                    <label className="form-check-label" htmlFor="female">Female</label>
                                                </div>
                                                { (errors.gender && errors.gender.type === 'required') && <p className="text-danger mb-0 text-left">Select Gender</p> }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col-md-6 col-12">
                                            <div className="form-group">
                                                <label htmlFor="standard">Standard</label>
                                                <select
                                                    className="form-control"
                                                    id="standard"
                                                    {...register('standard', { required: true })}
                                                >
                                                    <option value=''>Select Standard</option>
                                                    {standard.map((std: any) => {
                                                        return <option key={uuidv4()} value={std.id}>{std.text}</option>
                                                    })}
                                                </select>
                                                {(errors.standard && errors.standard.type === 'required') && <p className="text-danger mb-0 text-left">Select Standard</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <div className="form-group">
                                                <label htmlFor="division">Division</label>
                                                <select
                                                    className="form-control"
                                                    id="division"
                                                    {...register('division', { required: true })}
                                                >
                                                    <option value=''>Select Division</option>
                                                    {division.map((div: string) => {
                                                        return <option key={uuidv4()} value={div}>{div}</option>
                                                    })}
                                                </select>
                                                {
                                                    (errors.division && errors.division.type === 'required') && <p className="text-danger mb-0 text-left">Select Division</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="admission_number">Student Admission Number</label>
                                        <input 
                                            type="text" 
                                            id="admission_number"
                                            className="form-control" 
                                            placeholder="Enter Student Admission Number" 
                                            {...register('admission_number', { required: true })}
                                        />
                                        { (errors.admission_number && errors.admission_number.type === 'required') && <p className="text-danger mb-0 text-left">Enter Student Admission Number</p> }
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="roll_number">Roll Number</label>
                                        <input 
                                            type="text" 
                                            id="roll_number"
                                            className="form-control" 
                                            placeholder="Enter Roll Number" 
                                            {...register('roll_number', { required: true })}
                                        />
                                        { (errors.roll_number && errors.roll_number.type === 'required') && <p className="text-danger mb-0 text-left">Enter Roll Number</p> }
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="sts_number">STS Number</label>
                                        <input 
                                            type="text" 
                                            id="sts_number"
                                            className="form-control" 
                                            placeholder="Enter STS Number" 
                                            {...register('sts_number')}
                                        />
                                        { (errors.sts_number && errors.sts_number.type === 'required') && <p className="text-danger mb-0 text-left">Enter STS Number</p> }
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="guardian1_contact">Parents Contact No 1</label>
                                        <input 
                                            type="text" 
                                            id="guardian1_contact"
                                            className="form-control" 
                                            placeholder="Enter Parents Contact No" 
                                            {...register('guardian1_contact')}
                                        />
                                        { (errors.guardian1_contact && errors.guardian1_contact.type === 'required') && <p className="text-danger mb-0 text-left">Enter Parents Contact No</p> }
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="guardian2_contact">Parents Contact No 2</label>
                                        <input 
                                            type="text" 
                                            id="guardian2_contact"
                                            className="form-control" 
                                            placeholder="Enter Parents Contact No" 
                                            {...register('guardian2_contact')}
                                        />
                                    </div>
                                </>
                                
                            }

                            <button type="submit" className="btn btn-primary btn-block btn-login">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Container>
}


export default AddUsers;
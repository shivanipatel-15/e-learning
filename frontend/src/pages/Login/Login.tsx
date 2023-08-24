import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import DefaultLayout from './../../components/Layout/DefaultLayout'
import RootStore from '../../store/Root'
import Logo from './../../assets/images/logo.svg'
import student from './../../assets/images/student.svg'
import principal from './../../assets/images/principal.svg'
import management from './../../assets/images/management.svg'
import teacher from './../../assets/images/teacher.svg'
import vice_principal from './../../assets/images/vice-principal.svg'
import admin from './../../assets/images/admin.svg'
import school from './../../assets/images/school.png'
import { login } from './../../api/authAction'
import { useHistory } from 'react-router-dom'
import { errorToast } from './../../utility/toast'
interface Banner {
    [key: string]: string
}

interface Props {
    rootStore: RootStore,
}

const banners: Banner = {
    school: school,
    student: student,
    principal: principal,
    management: management,
    teacher: teacher,
    vice_principal: vice_principal,
    admin: admin
}

const Login: React.FC<Props> = ({ rootStore }) => {
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(false)
    const [banner, setBanner] = useState(banners.school)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm()

    const selectRole = (role: string) => {
        role = role !== '' ? role : 'school'
        setValue('user_type', role)
        setBanner(banners[role])
    }

    const onSubmit = async (data: any) => {
        if(data.user_type === undefined) {
            errorToast('Please Select User role')
            return false
        }
        setIsLoading(true)
        try {
            const response = await login(data)
            const responseData = response.data
            if (responseData.success === 0) {
                setIsLoading(false)
                errorToast(responseData.message)
                return
            }
            setIsLoading(false)
            rootStore.authStore.setAuthToken(responseData.data.token)
            await rootStore.authStore.restoreToken()
            history.push('/dashboard')
        } catch (error) {
            setIsLoading(false)
            errorToast(error)
        }
    }

    return <DefaultLayout rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="login_page">
            <div className="d-flex">
                <div className="left_area">
                    <div className="logo d-flex justify-content-center align-items-center">
                        <img src={Logo} className="logo_img" alt="Shree Bharathi Vidyalaya" />
                        <div className="school_name">
                            <h1>Shree Bharathi Vidyalaya</h1>
                            <p>A School With a Difference</p>
                        </div>
                    </div>
                    <div className="page_banner">
                        <img src={banner} alt="Page banner"/>
                    </div>
                </div>
                <div className="right_area">
                    <div className="card login_card">
                        <div className="card-body">
                            <h5 className="card-title">Login</h5>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <label htmlFor="user_role">Login as</label>
                                    <select 
                                        id="user_role" 
                                        className="form-control"
                                        onChange={ (e) => selectRole(e.target.value) }
                                    >
                                        <option value="">--- Login As ---</option>
                                        <option value="admin">Admin</option>
                                        <option value="management">Management</option>
                                        <option value="principal">Principal</option>
                                        <option value="vice_principal">Vice-Principal</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="student">Student</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input 
                                        type="text" 
                                        id="username"
                                        className="form-control" 
                                        placeholder="Enter Your Username" 
                                        {...register('username', { required: true })}
                                    />
                                    {
                                        (errors.username && errors.username.type === 'required') && <p className="text-danger mb-0 text-left">Enter Username</p>
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input 
                                        type="password" 
                                        id="password"
                                        className="form-control" 
                                        placeholder="Enter your Password" 
                                        {...register('password', { required: true })}
                                    />
                                    {
                                        (errors.password && errors.password.type === 'required') && <p className="text-danger mb-0 text-left">Enter Password</p>
                                    }
                                </div>
                                <div className="remember_me_forgot_password">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="remember_me" />
                                        <label className="form-check-label" htmlFor="remember_me">Remember me</label>
                                    </div>
                                    <Link to="/forgot-password-request">Forgot password?</Link>
                                </div>
                                
                                <button type="submit" className="btn btn-primary btn-block btn-login">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
}

export default Login;

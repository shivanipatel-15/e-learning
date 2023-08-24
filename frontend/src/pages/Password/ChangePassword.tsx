import { useState, useRef } from 'react';
import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useForm } from 'react-hook-form'
import { changePassword } from './../../api/authAction'
import { errorToast, successToast } from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'

interface Props {
    rootStore: RootStore
}

const ChangePassword: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm()

    const password = useRef({})
    password.current = watch('new_password', '')
   
    const onSubmit = async (data: any) => {
        setIsLoading(true)
        try {
            const changePasswordData = {
                current_password: data.current_password,
                new_password: data.new_password
            }
            const response = await changePassword(changePasswordData)
            const responseData = response.data
            if (responseData.success === 0) {
                setIsLoading(false)
                errorToast(responseData.message)
                return
            }
            setIsLoading(false)
            successToast(responseData.message)
            reset()
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
                        <h5 className="card-title"><HistoryBack /> Change Your Password</h5>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="current_password">Current Password</label>
                                <input 
                                    type="password" 
                                    id="current_password"
                                    className="form-control" 
                                    placeholder="Enter Current Password" 
                                    {...register('current_password', { required: 'Enter Current Password' })}
                                />
                                {
                                    errors.current_password && <p className="text-danger mb-0 text-left">{errors.current_password.message}</p>
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="new_password">New Password</label>
                                <input 
                                    type="password" 
                                    id="new_password"
                                    className="form-control" 
                                    placeholder="Enter New Password" 
                                    {...register('new_password', { required: 'Enter New Password' })}
                                />
                                {
                                    errors.new_password && <p className="text-danger mb-0 text-left">{errors.new_password.message}</p>
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm_password">Re-type New Password</label>
                                <input 
                                    type="password" 
                                    id="confirm_password"
                                    className="form-control" 
                                    placeholder="Enter New Password" 
                                    {...register('confirm_password', { 
                                            required: 'Re-type New Password', 
                                            validate: value => value === password.current || "The passwords do not match" 
                                        }
                                    )}
                                />
                                {
                                    errors.confirm_password && <p className="text-danger mb-0 text-left">{errors.confirm_password.message}</p>
                                }
                            </div>
                            <button type="submit" className="btn btn-primary btn-block btn-login">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Container>
}


export default ChangePassword;
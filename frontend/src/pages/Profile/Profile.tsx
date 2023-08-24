import { useState, useEffect } from 'react';
import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useForm } from 'react-hook-form'
import { editProfile, profile } from './../../api/authAction'
import { errorToast, successToast } from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'

interface Props {
    rootStore: RootStore
}

const Profile: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [userProfile, setUserProfile] = useState<any>(undefined)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = async () => {
        try {
            const response = await profile()
            const responseData = response.data
            setUserProfile(responseData.data)
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

   
    const onSubmit = async (data: any) => {
        setIsLoading(true)
        try {
            const response = await editProfile(data)
            const responseData = response.data
            if (responseData.success === 0) {
                setIsLoading(false)
                errorToast(responseData.message)
                return
            }
            setIsLoading(false)
            successToast('Profile Successfully Updated')
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
                        <h5 className="card-title"><HistoryBack /> Edit Profile</h5>
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
                                            defaultValue={userProfile?.first_name}
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
                                            defaultValue={userProfile?.last_name}
                                            {...register('last_name', { required: true })}
                                        />
                                        { (errors.last_name && errors.last_name.type === 'required') && <p className="text-danger mb-0 text-left">Enter Last name</p> }
                                    </div>
                                </div>
                            </div>                            
                            <div className="form-group">
                                <label htmlFor="contact_no">Contact no</label>
                                <input 
                                    type="text" 
                                    id="contact_no"
                                    className="form-control" 
                                    placeholder="Enter Contact no" 
                                    defaultValue={userProfile?.contact_no}
                                    {...register('contact_no', { required: true })}
                                />
                                {
                                    (errors.contact_no && errors.contact_no.type === 'required') && <p className="text-danger mb-0 text-left">Enter Contact no</p>
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


export default Profile;
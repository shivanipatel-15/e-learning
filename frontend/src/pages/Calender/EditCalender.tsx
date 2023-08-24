import React, { useState, useEffect } from 'react'
import Container from '../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom';
import { errorToast, successToast } from '../../utility/toast'
import { editCalender, detailCalender }  from './../../api/calenderAction'

interface Props {
    rootStore: RootStore
}

const AddSyllabus: React.FC<Props> = ({ rootStore }) => {
    const { calender_id } = useParams<any>()
    const [isLoading, setIsLoading] = useState(false)
    const [calender, setCalenderDetail] = useState<any>({})
    const [s3BucketUrl, setS3BucketUrl] = useState('')
    const history = useHistory()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        getCalender(calender_id)
    }, [])
    
    const onSubmit = async (data: any) => {
        const postData = new FormData()
        postData.append('circular_type', 'calender');
        postData.append('attachment', data.attachment[0]);
        try {
            const response = await editCalender(postData, calender_id)
            const responseData = response.data
            if(responseData.success === 0){
                errorToast(responseData.message)
                return
            }
            successToast(responseData.message)
            history.push('/calender')
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    const getCalender = async (calender_id: string) => {
        try {
            setIsLoading(true)
            const response = await detailCalender(calender_id)
            const responseData = response.data
            setCalenderDetail(responseData.data.circular)
            setS3BucketUrl(responseData.data.s3_url)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    return (<Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row justify-content-center">
            <div className="col-md-6 col-12 my-5">
                <div className="card add_timetable_card ">
                    <div className="card-body add_timetable_cardbody">
                        <h5 className="card-title"> Edit Calender</h5>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="attachment">Upload Calender</label>
                                <input
                                    type="file"
                                    id="attachment"
                                    className="form-control"
                                    accept='.pdf'
                                    {...register('attachment', { required: 'Select file to upload' })}
                                />
                                {(errors.attachment) && <p className="text-danger mb-0 text-left">{errors.attachment.message}</p>}
                            </div>
                            <embed 
                                className="card-img-top timetable-img" 
                                src={`${s3BucketUrl}${calender?.circular_url}`} 
                                type="application/pdf" 
                            />
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-block btn-login"
                            >Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Container>
    )
}

export default AddSyllabus

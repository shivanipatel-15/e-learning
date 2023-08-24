import React, { useState } from 'react'
import Container from '../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom';
import { errorToast, successToast } from '../../utility/toast'
import { addCircular } from './../../api/circularAction'

interface Props {
    rootStore: RootStore
}

const AddCalender: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = async (data: any) => {
        const postData = new FormData()
        postData.append('circular_type', 'circular');
        postData.append('attachment', data.attachment[0]);
        postData.append('title', data.title);
        try {
            const response = await addCircular(postData)
            const responseData = response.data
            if (responseData.success === 0) {
                errorToast(responseData.message)
                return
            }
            successToast(responseData.message)
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    return (<Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row justify-content-center">
            <div className="col-md-6 col-12 my-5">
                <div className="card add_timetable_card ">
                    <div className="card-body add_timetable_cardbody">
                        <h5 className="card-title"> Add Circular</h5>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="formGroupExampleInput2">Title</label>
                                <input type="text" className="form-control" placeholder="Enter circular title"
                                    {...register('title', { required: 'Enter circular title' })}
                                />
                                {(errors.title) && <p className="text-danger mb-0 text-left">{errors.title.message}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="attachment">Upload Circular</label>
                                <input
                                    type="file"
                                    id="attachment"
                                    className="form-control"
                                    accept='.pdf'
                                    {...register('attachment', { required: 'Select file to upload' })}
                                />
                                {(errors.attachment) && <p className="text-danger mb-0 text-left">{errors.attachment.message}</p>}
                            </div>
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

export default AddCalender

import React, { useState } from 'react'
import Container from '../../components/Layout/Container'
import RootStore from '../../store/Root'
import HistoryBack from '../../components/Widget/HistoryBack'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom';
import { errorToast, successToast } from '../../utility/toast'
import { AddTimeTable } from '../../api/timetableAction'

interface Props {
    rootStore: RootStore
}

const AddTimeTablePage: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: any) => {
        const postData = new FormData()
        postData.append('csv', data.attachment[0]);
        try {
            const response = await AddTimeTable(postData)
            const responseData = response.data
            if(responseData.success === 0){
                errorToast(responseData.message)
                return
            }
            successToast(responseData.message)
            reset()
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    return (<Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row justify-content-center">
            <div className="col-md-6 col-12 my-5">
                <div className="card add_timetable_card">
                    <div className="card-body add_timetable_cardbody">
                        <div className='d-flex justify-content-between'>
                            <h5 className="card-title"><HistoryBack /> Upload TimeTable</h5>
                            <a href='./../../csv/timetable.csv'
                                className="btn btn-link" 
                                rel="noopener noreferrer" target="_blank"
                            >Download Sample CSV</a>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="attachment">Upload Timetable</label>
                                <input
                                    type="file"
                                    id="attachment"
                                    className="form-control"
                                    accept='.csv'
                                    {...register('attachment', { required: true })}
                                />
                                {
                                    (errors.attachment && errors.attachment.type === 'required') &&
                                    <p className="text-danger mb-0 text-left">Select file to upload</p>
                                }
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

export default AddTimeTablePage

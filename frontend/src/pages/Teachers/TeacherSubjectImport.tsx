import React, { useState } from 'react'
import Container from '../../components/Layout/Container'
import RootStore from '../../store/Root'
import HistoryBack from '../../components/Widget/HistoryBack'
import { useForm } from 'react-hook-form'
import { errorToast, successToast } from '../../utility/toast'
import { importTeachersSubject  } from '../../api/userAction'

interface Props {
    rootStore: RootStore
}

const TeacherSubjectImport: React.FC<Props> = ({ rootStore }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: any) => {
        const postData = new FormData()
        postData.append('csv', data.csv[0]);
        try {
            const response = await importTeachersSubject(postData)
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

    return (<Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <div className="row justify-content-center">
            <div className="col-md-6 col-12 my-5">
                <div className="card add_timetable_card ">
                    <div className="card-body add_timetable_cardbody">
                        <div className='d-flex justify-content-between'>
                            <h5 className="card-title"><HistoryBack /> Import Teachers Subjects</h5>
                            <a href='./../../csv/teacher_subject_import.csv'
                                className="btn btn-link" 
                                rel="noopener noreferrer" target="_blank"
                            >Download Sample CSV</a>
                        </div>
                        
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="csv">Upload CSV</label>
                                <input
                                    type="file"
                                    id="csv"
                                    className="form-control"
                                    accept='.csv'
                                    {...register('csv', { required: 'Select CSV file for upload' })}
                                />
                                {errors.csv && <p className="text-danger mb-0 text-left">{errors.csv.message}</p>}
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

export default TeacherSubjectImport

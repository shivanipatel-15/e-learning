import React, { useState } from 'react'
import Container from '../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom';
import { errorToast, successToast } from '../../utility/toast'
import { addSyllabus } from './../../api/syllabusAction'
import HistoryBack from './../../components/Widget/HistoryBack'
import { standard } from './../../utility/standard'
import { division } from './../../utility/division'
import { v4 as uuidv4 } from 'uuid'

interface Props {
    rootStore: RootStore
}

const AddSyllabus: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = async (data: any) => {
        const postData = new FormData()
        postData.append('circular_type', 'syllabus');
        postData.append('attachment', data.attachment[0]);
        postData.append('board', data.board);
        postData.append('standard', data.standard);
        postData.append('division', data.division);
        try {
            const response = await addSyllabus(postData)
            const responseData = response.data
            if (responseData.success === 0) {
                errorToast(responseData.message)
                return
            }
            successToast(responseData.message)
            history.push('/syllabus')
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    return (<Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row justify-content-center">
            <div className="col-md-6 col-12 my-5">
                <div className="card add_timetable_card ">
                    <div className="card-body add_timetable_cardbody">
                        <h5 className="card-title"> <HistoryBack /> Add Syllabus</h5>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="board">Board</label>
                                <select
                                    className="form-control"
                                    id="board"
                                    {...register('board', { required: true })}
                                >
                                    <option value=''> Select Board </option>
                                    <option value="CBSE">CBSE</option>
                                    <option value="State">State</option>
                                </select>
                                {(errors.board && errors.board.type === 'required') && <p className="text-danger mb-0 text-left">Select Board</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="standard">Standard</label>
                                <select
                                    className="form-control"
                                    id="standard"
                                    {...register('standard', { required: true })}
                                >
                                    <option value=''> Select Standard </option>
                                    {standard.map((std: any) => {
                                        return <option key={uuidv4()} value={std.id}>{std.text}</option>
                                    })}
                                </select>
                                {(errors.standard && errors.standard.type === 'required') && <p className="text-danger mb-0 text-left">Select Standard</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="division">Division</label>
                                <select
                                    className="form-control"
                                    id="division"
                                    {...register('division', { required: true })}
                                >
                                    <option value=''> Select Division </option>
                                    {division.map((div: string) => {
                                        return <option key={uuidv4()} value={div}>{div}</option>
                                    })}
                                </select>
                                {(errors.division && errors.division.type === 'required') && <p className="text-danger mb-0 text-left">Select Division</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="attachment">Upload Syllabus</label>
                                <input
                                    type="file"
                                    id="attachment"
                                    className="form-control"
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

export default AddSyllabus

import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useForm } from 'react-hook-form'
import { errorToast } from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'
import { profile } from './../../api/authAction'
import { v4 } from 'uuid'

interface Props {
    rootStore: RootStore
}

interface ParamTypes {
    user_type: string;
}

const AssignmentAdd: React.FC<Props> = ({ rootStore }) => {
    const history = useHistory()
    const [assignmentType, setAssignmentType] = useState('')
    const { assignmentStore } = rootStore
    let { isLoading, addNewAssignment, isSubmit } = assignmentStore
    const [subjects, setSubjects] = useState([])
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        getLoginUser()
    }, [])

    const getLoginUser = async () => {
        try {
            const response = await profile()
            const responseData = response.data
            if (responseData.success === 0) {
                errorToast(responseData.message)
            }
            
            if (subjects.length === 0) {
                setSubjects(responseData.data.subjects)
            }

        } catch (error) {
            errorToast(error)
        }
    }

    const onSubmit = async (data: any) => {
        const postData = new FormData()
        postData.append('attachment', data.assignment_type === 'google_form' ? data.attachment_text : data.attachment[0]);
        const subjectAndDivision = data.class_subject
        const arrayOfSubject = subjectAndDivision.split("|")
        postData.append('standard', arrayOfSubject[0])
        postData.append('division', arrayOfSubject[1])
        postData.append('subject', arrayOfSubject[2])
        postData.append('description', data.description)
        postData.append('submission_due', data.submission_due)
        postData.append('assignment_type', data.assignment_type)
        try {
            addNewAssignment(postData)
            history.push('/assignment/list')
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    const onAssignmentTypeChange = (value: string) => {
        setAssignmentType(value)
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <div className="row justify-content-center">
            <div className="col-md-6 col-12 my-5">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title"><HistoryBack /> Add Assignment</h5>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="description">Assignment Type </label>
                                <div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input"
                                            type="radio"
                                            id="pdf"
                                            value="pdf"
                                            onClick={() => onAssignmentTypeChange('pdf')}
                                            {...register('assignment_type', { required: true })} />
                                        <label className="form-check-label" htmlFor="pdf">Upload PDF</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="google_form"
                                            value="google_form"
                                            onClick={() => onAssignmentTypeChange('google_form')}
                                            {...register('assignment_type', { required: true })} />
                                        <label className="form-check-label" htmlFor="google_form">Google Form Link</label>
                                    </div>
                                </div>
                                {(errors.assignment_type && errors.assignment_type.type === 'required') && <p className="text-danger mb-0 text-left">Select Assignment Type</p>}
                            </div>
                            {
                                assignmentType === 'pdf' && <div className="form-group">
                                    <label htmlFor="attachment">Upload PDF</label>
                                    <input
                                        type="file"
                                        id="attachment"
                                        className="form-control"
                                        accept='.pdf'
                                        {...register('attachment', { required: true })}
                                    />
                                    {(errors.attachment && errors.attachment.type === 'required') && <p className="text-danger mb-0 text-left">Select file to upload</p>}
                                </div>
                            }
                            {
                                assignmentType === 'google_form' && <div className="form-group">
                                    <label htmlFor="attachment_text">Enter Google form Link</label>
                                    <input
                                        type="text"
                                        id="attachment_text"
                                        className="form-control"
                                        placeholder="Enter Google Form link"
                                        {...register('attachment_text', { required: true })}
                                    />
                                    {(errors.attachment_text && errors.attachment_text.type === 'required') && <p className="text-danger mb-0 text-left">Enter Google Form link</p>}
                                </div>
                            }
                            <div className="form-group">
                                <label htmlFor="subject">Select Subject and class</label>
                                <select
                                    className="form-control"
                                    id="class_subject"
                                    {...register('class_subject', { required: true })}
                                >
                                    <option value=''>--- Select Standard and class ---</option>
                                    {subjects.map((standard: any) => {
                                        return <option key={v4()} value={`${standard.standard}|${standard.division}|${standard.subject}`}>{standard.standard} - {standard.division} ( {standard.subject} )</option>
                                    })}
                                </select>
                                {(errors.class_subject && errors.class_subject.type === 'required') && <p className="text-danger mb-0 text-left">Select Standard and subject</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Chapter and topic</label>
                                <input
                                    type="description"
                                    id="description"
                                    className="form-control"
                                    placeholder="Enter assignment sort info"
                                    {...register('description', { required: true, maxLength: 30 })}
                                />
                                {(errors.description && errors.description.type === 'required') && <p className="text-danger mb-0 text-left">Enter assignment sort info</p>}
                                {(errors.description && errors.description.type === "maxLength") && <p className="text-danger mb-0 text-left">Max 30 characters are allowed</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="submission_due">Assignment Due date-time</label>
                                <input
                                    className="form-control"
                                    type="datetime-local"
                                    id="submission_due"
                                    {...register('submission_due', { required: true })} />
                                {(errors.submission_due && errors.submission_due.type === 'required') && <p className="text-danger mb-0 text-left">Enter Assignment due date and time</p>}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-block btn-login"
                                disabled={isSubmit}
                            >{isSubmit === true ? 'Processing...' : 'Save'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Container>
}


export default AssignmentAdd;
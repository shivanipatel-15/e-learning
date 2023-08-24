import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useForm } from 'react-hook-form'
import { addExam }  from './../../api/examAction'
import { errorToast }  from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'
import { profile } from './../../api/authAction'
import { v4 } from 'uuid'

interface Props {
    rootStore: RootStore
}

const ExamAdd: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()
    const [examType, setExamType] = useState('')
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
        postData.append('attachment', data.exam_type === 'google_form' ? data.attachment_text : data.attachment[0])
        const subjectAndDivision = data.class_subject
        const arrayOfSubject = subjectAndDivision.split("|")
        postData.append('standard', arrayOfSubject[0])
        postData.append('division', arrayOfSubject[1])
        postData.append('subject', arrayOfSubject[2])
        postData.append('description', data.description)
        postData.append('exam_start', data.exam_start)
        postData.append('exam_end', data.exam_end)
        postData.append('exam_type', data.exam_type)
        postData.append('test_or_exam', data.test_or_exam)
        
        try {
            setIsLoading(true)
            await addExam(postData)
            setIsLoading(false)
            history.push('/exam')
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const onExamTypeChange = (value: string) => {
        setExamType(value)
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row justify-content-center">
            <div className="col-md-8 col-12 my-5">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title"><HistoryBack /> Add Exam</h5>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="description">Exam Type </label>
                                <div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input"
                                            type="radio"
                                            id="pdf"
                                            value="pdf"
                                            onClick={() => onExamTypeChange('pdf')}
                                            {...register('exam_type', { required: true })} />
                                        <label className="form-check-label" htmlFor="pdf">Upload PDF</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input"
                                            type="radio"
                                            id="google_form"
                                            value="google_form"
                                            onClick={(e) => onExamTypeChange('google_form')}
                                            {...register('exam_type', { required: true })} />
                                        <label className="form-check-label" htmlFor="google_form">Google Form Link</label>
                                    </div>
                                </div>
                                {(errors.exam_type && errors.exam_type.type === 'required') && <p className="text-danger mb-0 text-left">Select Exam Type</p>}
                            </div>
                            {
                                examType === 'pdf' && <div className="form-group">
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
                                examType === 'google_form' && <div className="form-group">
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
                                <label htmlFor="description">Exam Notes</label>
                                <textarea 
                                    id="description"
                                    className="form-control"
                                    placeholder="Enter Exam Notes"
                                    {...register('description', { required: true, maxLength: 30 })}
                                ></textarea>
                                {(errors.description && errors.description.type === 'required') && <p className="text-danger mb-0 text-left">Enter exam sort info</p>}
                                {(errors.description && errors.description.type === "maxLength") && <p className="text-danger mb-0 text-left">Max 30 characters are allowed</p> }
                            </div>
                            <div className="form-row">
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="exam_start">Exam Start date-time</label>
                                        <input 
                                            className="form-control"
                                            type="datetime-local" 
                                            id="exam_start" 
                                            {...register('exam_start', { required: true })} />
                                        {(errors.exam_start && errors.exam_start.type === 'required') && <p className="text-danger mb-0 text-left">Enter Exam Start date and time</p>}
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="form-group">
                                        <label htmlFor="exam_end">Exam End date-time</label>
                                        <input 
                                            className="form-control"
                                            type="datetime-local" 
                                            id="exam_end" 
                                            {...register('exam_end', { required: true })} />
                                        {(errors.exam_end && errors.exam_end.type === 'required') && <p className="text-danger mb-0 text-left">Enter Exam End date and time</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="test_or_exam">Exam/test </label>
                                <div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input"
                                            type="radio"
                                            id="test"
                                            value="test"
                                            {...register('test_or_exam', { required: true })} />
                                        <label className="form-check-label" htmlFor="test">Test</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input"
                                            type="radio"
                                            id="exam"
                                            value="exam"
                                            {...register('test_or_exam', { required: true })} />
                                        <label className="form-check-label" htmlFor="exam">Exam</label>
                                    </div>
                                </div>
                                {(errors.test_or_exam && errors.test_or_exam.type === 'required') && <p className="text-danger mb-0 text-left">Select Is test or exam</p>}
                            </div>
                            
                            <button type="submit" className="btn btn-primary btn-block btn-login">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Container>
}


export default ExamAdd;
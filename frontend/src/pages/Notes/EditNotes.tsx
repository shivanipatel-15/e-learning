import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useForm } from 'react-hook-form'
import { errorToast } from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'
import { profile } from './../../api/authAction'
import { v4 } from 'uuid'
import { editNotes, detailNotes } from './../../api/notesAction'

interface Props {
    rootStore: RootStore
}

const EditNotes: React.FC<Props> = ({ rootStore }) => {
    const { circular_id } = useParams<any>()
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(false)
    const [subjects, setSubjects] = useState([])
    const [isSubmit, setIsSubmit] = useState(false)
    const [notes, setNotesDetail] = useState<any>({})
    const [s3BucketUrl, setS3BucketUrl] = useState('')
    
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        getLoginUser()
        getCirculars(circular_id)
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
        setIsSubmit(true)
        const postData = new FormData()
        postData.append('attachment', data.attachment[0]);
        const subjectAndDivision = data.class_subject
        const arrayOfSubject = subjectAndDivision.split("|")
        postData.append('standard', arrayOfSubject[0])
        postData.append('division', arrayOfSubject[1])
        postData.append('subject', arrayOfSubject[2])
        postData.append('title', data.title)
        postData.append('circular_type', 'notes')
        try {
            editNotes(postData, circular_id)
            setIsSubmit(false)
            history.push('/notes')
        } catch (error) {
            setIsSubmit(false)
            errorToast('Error! something is wrong')
        }
    }

    const getCirculars = async (circular_id: string) => {
        try {
            setIsLoading(true)
            const response = await detailNotes(circular_id)
            const responseData = response.data
            setNotesDetail(responseData.data.circular)
            setS3BucketUrl(responseData.data.s3_url)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <div className="row justify-content-center">
            <div className="col-md-6 col-12 my-5">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title"><HistoryBack /> Edit Notes</h5>
                        {
                            isLoading === false &&  
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <label htmlFor="title">Chapter and topic</label>
                                    <input
                                        type="title"
                                        id="title"
                                        className="form-control"
                                        placeholder="Enter Notes Title"
                                        {...register('title', { required: true, maxLength: 15 })}
                                        defaultValue={notes.title}
                                    />
                                    {(errors.title && errors.title.type === 'required') && <p className="text-danger mb-0 text-left">Enter Notes Title</p>}
                                    {(errors.title && errors.title.type === "maxLength") && <p className="text-danger mb-0 text-left">Max 15 characters are allowed</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="attachment">Upload PDF</label>
                                    <input
                                        type="file"
                                        id="attachment"
                                        className="form-control"
                                        accept='.pdf'
                                        {...register('attachment')}
                                    />
                                </div>
                                <embed
                                    className="card-img-top timetable-img"
                                    src={`${s3BucketUrl}${notes?.circular_url}`}
                                    type="application/pdf"
                                />
                                <div className="form-group">
                                    <label htmlFor="subject">Select Subject and class</label>
                                    <select
                                        className="form-control"
                                        id="class_subject"
                                        {...register('class_subject', { required: true })}
                                        defaultValue={`${notes?.standard}|${notes?.division}|${notes?.subject}`}
                                    >
                                        <option value=''>--- Select Standard and class ---</option>
                                        {subjects.map((standard: any) => {
                                            return <option key={v4()} value={`${standard.standard}|${standard.division}|${standard.subject}`}>{standard.standard} - {standard.division} ( {standard.subject} )</option>
                                        })}
                                    </select>
                                    {(errors.class_subject && errors.class_subject.type === 'required') && <p className="text-danger mb-0 text-left">Select Standard and subject</p>}
                                </div>
                            
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block btn-login"
                                    disabled={isSubmit}
                                >{isSubmit === true ? 'Processing...' : 'Save'}</button>
                            </form>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    </Container>
}


export default EditNotes;
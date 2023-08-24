import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { getNotes, removeNotes } from './../../api/notesAction'
import { errorToast, successToast } from './../../utility/toast'
import Update from '../../assets/images/edit_color.svg'
import Delete from '../../assets/images/bin_color.svg'
import { Modal } from "react-bootstrap"
import { standard } from './../../utility/standard'
import { division } from './../../utility/division'
import { profile } from './../../api/authAction'
import moment from 'moment'

interface Props {
    rootStore: RootStore
}

const NotesList: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [notesList, setNotesList] = useState([])
    const [s3BucketUrl, setS3BucketUrl] = useState('')
    const { userRole } = rootStore.authStore
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const [pdfUrl, setPdfUrl] = useState('')
    const [filter, setFilter] = useState<any>({
        standard: '',
        division: '',
        date: ''
    })

    const viewPdf = (s3Url: string, path: string) => {
        const url = `${s3Url}${path}`
        setPdfUrl(url)
        setShow(true)
    }

    const getLoginUser = async () => {
        setIsLoading(true)
        try {
            const response = await profile()
            const responseData = response.data
            if (responseData.success === 0) {
                errorToast(responseData.message)
                setIsLoading(false)
            }
            if (responseData.data.user_type === 'student') {
                const data: any = {
                    standard: responseData.data.standard,
                    division: responseData.data.division
                }
                setFilter(data)
                getNotesList(data)
            } else {
                getNotesList(filter)
            }
        } catch (error) {
            errorToast(error)
        }
    }

    useEffect(() => {
        getLoginUser()
    }, [])

    const onChange = (e: any) => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'standard') {
            filter.standard = value
        } else if (name === 'division') {
            filter.division = value
        } else if (name === 'date') {
            filter.date = value
        }
        setFilter(filter)
        getNotesList(filter)
    }

    const getNotesList = async (filter: object) => {
        try {
            setIsLoading(true)
            const response = await getNotes(filter)
            const responseData = response.data
            setNotesList(responseData.data.circular)
            setS3BucketUrl(responseData.data.s3_url)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const remove = async (notes_id: string) => {
        const confirmRemove = window.confirm('Are you sure to do this?')
        if (confirmRemove === false) {
            return
        }

        try {
            const response = await removeNotes(notes_id)
            const responseData = response.data
            if (responseData.data.success === 0) {
                errorToast(responseData.data.message)
                return
            }
            successToast(responseData.message)
            getNotesList(filter)
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        {
            <>
                <div className="row">
                    {
                        (userRole === 'teacher') &&
                        <div className="col-12 d-flex justify-content-end add_btn">
                            <Link to='/notes/add' className="btn btn-primary btn-login mt-3 px-5 mb-0">Add New Notes</Link>
                        </div>
                    }
                </div>
                
                <div className="row">
                    <div className="col-12">
                    {
                        (userRole !== 'student') ?
                        <div className=" card syllabus_card mt-5">
                            <div className="card-body d-flex justify-content-around align-items-center filters">
                                <div className="attendance_filter">
                                    <div className="form-group">
                                        <label htmlFor="standard">Standard</label>
                                        <select className="form-control" id="standard" name="standard" onChange={onChange} value={filter.standard}>
                                            <option value=''> Select Standard </option>
                                            {standard.map((std: any) => {
                                                return <option key={uuidv4()} value={std.id}>{std.text}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="attendance_filter">
                                    <div className="form-group">
                                        <label htmlFor="division">Division</label>
                                        <select
                                            className="form-control"
                                            id="division"
                                            name="division"
                                            onChange={onChange}
                                            value={filter.division}
                                        >
                                            <option value=''> Select Division </option>
                                            {division.map((div: string) => {
                                                return <option key={uuidv4()} value={div}>{div}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="attendance_filter">
                                    <div className="form-group">
                                        <label htmlFor="date">Date</label>
                                        <input 
                                            className="form-control" 
                                            type="date"
                                            name="date" 
                                            id="date" 
                                            onChange={onChange}
                                            value={filter.date} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div> : 
                        <div className=" card syllabus_card mt-5">
                            <div className="card-body d-flex justify-content-around align-items-center filters">
                                <div className="attendance_filter">
                                    <div className="form-group">
                                        <label htmlFor="date">Date</label>
                                        <input 
                                            className="form-control" 
                                            type="date"
                                            name="date" 
                                            id="date" 
                                            onChange={onChange}
                                            value={filter.date} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                        <div className="card select-teacher-card">
                            <div className="card-body select-teacher-body">
                                {
                                    notesList.length > 0 ?
                                        <div className="row">
                                            {notesList.map((data: any) => {
                                                return <div key={uuidv4()} className="col-lg-4 col-md-6 col-12">
                                                    <div className="timetable_div">
                                                        <span className="std_name">
                                                            {data.title} ({data.standard}-{data.division}) <br />
                                                            <small>Uploaded: {moment(data.createdAt).format('DD-MM-YYYY')}</small>
                                                        </span>
                                                        <div className="card timetable_listcard mt-1">
                                                            <embed
                                                                className="card-img-top timetable-img"
                                                                src={`${s3BucketUrl}${data.circular_url}`}
                                                                type="application/pdf"
                                                            />
                                                        </div>

                                                        <div className="timetable_listaction d-flex justify-content-around">
                                                            <a className="view_timetable_div"
                                                                onClick={() => viewPdf(s3BucketUrl, data.circular_url)}>View</a>
                                                            {
                                                                (userRole === 'teacher') &&<>    
                                                                    <div className="update_timetable_div" style={{ cursor: 'pointer' }}>
                                                                        <Link  to={`/notes/edit/${data._id}`}><img src={Update} className="update_img" alt="Update Image" />Update</Link>
                                                                    </div>
                                                                    <div className="delete_timetable_div" onClick={() => remove(data._id)} style={{ cursor: 'pointer' }}>
                                                                        <img src={Delete} className="delete_img" alt="Delete Image" />Delete
                                                                    </div>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            })}
                                        </div> : <div className='text-center'>No Data found</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>

        }
        <Modal size="xl" show={show} onHide={handleClose} >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <iframe
                    className="card-img-top timetable-img" 
                    src={`https://docs.google.com/viewer?url=${pdfUrl}&embedded=true`}
                ></iframe>
            </Modal.Body>
        </Modal>
    </Container>

}

export default observer(NotesList)
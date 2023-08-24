import Container from '../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { getSyllabus, removeSyllabus } from '../../api/syllabusAction'
import { errorToast, successToast } from '../../utility/toast'
import Update from '../../assets/images/edit_color.svg'
import Delete from '../../assets/images/bin_color.svg'
import { Button, Modal } from "react-bootstrap"
import { profile } from './../../api/authAction'
import { standard } from './../../utility/standard'
import { division } from './../../utility/division'

interface Props {
    rootStore: RootStore
}

interface Filter {
    standard: string
    division: string
}

const SyllabusList: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [circularList, setCircularList] = useState([])
    const [s3BucketUrl, setS3BucketUrl] = useState('')
    const { userRole, userLoginData } = rootStore.authStore
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const [pdfUrl, setPdfUrl] = useState('')
    const [filter, setFilter] = useState<Filter>({
        standard: '',
        division: ''
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
                getSyllabuses(data)
            } else {
                getSyllabuses(filter)
            }
            setIsLoading(false)
        } catch (error) {
            errorToast(error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getLoginUser()
    }, [])

    const getSyllabuses = async (filter: any) => {
        try {
            setIsLoading(true)
            const response = await getSyllabus(filter)
            const responseData = response.data
            setCircularList(responseData.data.circular)
            setS3BucketUrl(responseData.data.s3_url)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const onChange = (e: any) => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'standard') {
            filter.standard = value
        } else if (name === 'division') {
            filter.division = value
        }
        setFilter(filter)
        getSyllabuses(filter)
    }

    const remove = async (_id: string) => {
        const confirmRemove = window.confirm('Are you sure to do this?')
        if (confirmRemove === false) {
            return
        }
        const data = { _id }
        try {
            const response = await removeSyllabus(_id)
            const responseData = response.data
            if (responseData.data.success === 0) {
                errorToast(responseData.data.message)
                return
            }
            successToast(responseData.message)
            getSyllabuses(filter)
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        {
            // isLoading === false ? 
            <>
                <div className="row">
                    {
                        (userRole === 'admin') &&
                        <div className=" my-3 col-12 d-flex justify-content-end add_btn">
                            <Link to='/syllabus/add' className="btn btn-primary btn-login mt-3 px-5 mb-0">Add Syllabus</Link>
                        </div>
                    }
                </div>
                <div className="row">
                    <div className="col-12">
                        {
                            (userRole !== 'student') &&
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
                                </div>
                            </div>
                        }
                        <div className="card select-teacher-card">
                            <div className="card-body select-teacher-body">
                                {
                                    circularList.length === 0 ?
                                        <div className='text-center'>No record found</div>
                                        :
                                        <div className="row">
                                            {circularList.map((data: any) => {
                                                return <div key={uuidv4()} className="col-md-6 col-12">
                                                    <div className="timetable_div">
                                                        <span className="std_name">{data.standard + "-" + data.division + "(" + data.board + ")"}</span>

                                                        <div className="card timetable_listcard">
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
                                                                (userRole === 'admin') && <>
                                                                    <div className="update_timetable_div" style={{ cursor: 'pointer' }}>
                                                                        <Link to={`/syllabus/edit/${data._id}`}><img src={Update} className="update_img" alt="Update Image" />Update</Link>
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
                                        </div>
                                    //  : <div className='text-center'>No Data found</div>
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

export default observer(SyllabusList);
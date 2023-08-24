import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import binIcon from './../../assets/images/bin_color.svg'
import { getCalenderList, removeCalender } from './../../api/calenderAction'
import { errorToast, successToast } from './../../utility/toast'
import UploadTimeTable from './../../components/TimeTable/UploadTimeTable'
import Update from '../../assets/images/edit_color.svg'
import Delete from '../../assets/images/bin_color.svg'
import { Button, Modal } from "react-bootstrap"

interface Props {
    rootStore: RootStore
}

const CalenderList: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [calenderList, setCalenderList] = useState([])
    const [s3BucketUrl, setS3BucketUrl] = useState('')
    const { userRole } = rootStore.authStore
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const [pdfUrl, setPdfUrl] = useState('')

    const viewPdf = (s3Url: string, path: string) => {
        const url = `${s3Url}${path}`
        setPdfUrl(url)
        setShow(true)
    }

    useEffect(() => {
        getCalenders()
    }, [])

    const getCalenders = async () => {
        try {
            setIsLoading(true)
            const response = await getCalenderList()
            const responseData = response.data
            setCalenderList(responseData.data.circular)
            setS3BucketUrl(responseData.data.s3_url)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }

    const remove = async (calender_id: string) => {
        const confirmRemove = window.confirm('Are you sure to do this?')
        if (confirmRemove === false) {
            return
        }

        try {
            const response = await removeCalender(calender_id)
            const responseData = response.data
            if (responseData.data.success === 0) {
                errorToast(responseData.data.message)
                return
            }
            successToast(responseData.message)
            getCalenders()
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        {
            <div className="row">
                {
                    (userRole === 'admin' || userRole === 'vice_principal') &&
                    <div className="col-12 d-flex justify-content-end add_btn">
                        <Link to='/calender/add' className="btn btn-primary btn-login mt-3 px-5 mb-0">Add Calender</Link>
                    </div>
                }

                <div className="col-12">
                    <div className="card select-teacher-card">
                        <div className="card-body select-teacher-body">
                            {
                                calenderList.length > 0 ?
                                    <div className="row">
                                        {calenderList.map((data: any) => {
                                            return <div key={uuidv4()} className="col-md-6 col-12">
                                                <div className="timetable_div">
                                                    <div className="card timetable_listcard">
                                                        <embed
                                                            className="card-img-top timetable-img"
                                                            src={`${s3BucketUrl}${data.circular_url}`}
                                                            type="application/pdf"
                                                        />
                                                    </div>
                                                    <div className="timetable_listaction d-flex justify-content-around">
                                                        <a className="update_timetable_div" onClick={() => viewPdf(s3BucketUrl, data.circular_url)}>View</a>
                                                        { 
                                                             (userRole === 'admin' || userRole === 'vice_principal') &&<>
                                                            <div className="update_timetable_div" style={{ cursor: 'pointer' }}>
                                                                <Link to={`/calender/edit/${data._id}`}><img src={Update} className="update_img" alt="Update Image" />Update</Link>
                                                            </div>
                                                            <div className="delete_timetable_div" onClick={() => remove(data._id)} style={{ cursor: 'pointer' }}>
                                                                <img src={binIcon} className="delete_img" alt="Delete Image" />Delete
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
        }
        <Modal size="xl" show={show} onHide={handleClose} >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <iframe
                    className="card-img-top timetable-img" 
                    src={`https://docs.google.com/viewer?url=${pdfUrl}&embedded=true`}
                ></iframe>
            </Modal.Body>
            {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer> */}
        </Modal>
    </Container >
}


export default observer(CalenderList);
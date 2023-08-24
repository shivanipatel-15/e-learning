import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Update from '../../assets/images/edit_color.svg'
import Delete from '../../assets/images/bin_color.svg'
import { removeTimeTable } from '../../api/timetableAction'
import { errorToast, successToast } from '../../utility/toast'
import { Button, Modal } from "react-bootstrap"

interface Props {
    name?: any
    avatar: string,
    id?: string,
    allowRemove?: boolean
}

const UploadTimeTable: React.FC<Props> = (props) => {

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const [pdfUrl, setPdfUrl] = useState('')

    const viewPdf = (avatar: string) => {
    setPdfUrl(avatar)
    setShow(true)
}

const removeTimetable = async (timetable_id: any) => {
    const confirm = window.confirm('Are you sure to do this?')
    if (confirm === false) {
        return false
    }
    try {
        const response = await removeTimeTable(timetable_id)
        const responseData = response.data
        if (responseData.success === 0) {
            errorToast(responseData.message)
        }
        successToast(responseData.message)
    } catch (error) {
        errorToast('Error! something is wrong')
    }
}

return (
    <div className="timetable_div">
        <span className="std_name">{props.name}</span>
        <div className="card timetable_listcard">
            <embed
                className="card-img-top timetable-img"
                src={props.avatar}
                type="application/pdf"
            />
        </div>

        <div className="timetable_listaction d-flex justify-content-around">
            <a className="update_timetable_div" onClick={() => viewPdf(props.avatar)} target='_blank'>View</a>
            {props.allowRemove !== false && <>
                <div className="update_timetable_div" style={{ cursor: 'pointer' }}>
                    <Link to={`/timetable/edit/${props.id}`}><img src={Update} className="update_img" alt="Update Image" />Update</Link>
                </div>
                <div className="delete_timetable_div" onClick={() => removeTimetable(props.id)} style={{ cursor: 'pointer' }}>
                    <img src={Delete} className="delete_img" alt="Delete Image" />Delete
                </div>
            </>
            }
        </div>
        <Modal size="lg" show={show} onHide={handleClose} >
            <Modal.Body>
            <iframe
                    className="card-img-top timetable-img" 
                    src={`https://docs.google.com/viewer?url=${pdfUrl}&embedded=true`}
                ></iframe>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

    </div>
)
}

export default UploadTimeTable

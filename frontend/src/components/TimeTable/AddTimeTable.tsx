import React from 'react'
import {Link} from 'react-router-dom'
import Update from '../../assets/images/edit_color.svg'

interface Props {
    name: any
}

const AddTimeTable: React.FC<Props> = (props) => {
    return (
        <div className="timetable_div">
            <span className="std_name">{props.name}</span>
            <div className="card timetable_listcard upload_div" style={{ width: "19rem" }} >
                <label htmlFor="exampleInputEmail1" className="upload_timetable">
                    <input type="file" className="form-control input_upload" id="exampleInputEmail1" />
                    <div className="upload_txt">
                        <div className="upload_timetable_div">
                            <img src={Update} className="upload_img" alt="Update Image"/>
                            <Link to= "/add-timetable" style={{color:'#2d7567'}}>Add Timetable</Link>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    )
}

export default AddTimeTable

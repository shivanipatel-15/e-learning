import Home from './../../assets/images/home.svg'
import Homework from './../../assets/images/homweork.svg'
import AcademicCalendar from './../../assets/images/academic_calendar.svg'
import Noticeboard from './../../assets/images/noticeboard.svg'
import StudentNav from './../../assets/images/student_nav.svg'
import { NavLink } from 'react-router-dom'
import RootStore from '../../store/Root'

interface Props {
    rootStore: RootStore,
}

const Management: React.FC<Props> = ({ rootStore }) => {
    return <ul className="nav sidebar-nav">
                <li>
                    <NavLink activeClassName="active" to="/dashboard" className="nav-link">
                        <img src={Home} alt="Home" /> Home
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/teachers" className="nav-link">
                        <img src={StudentNav} alt="Teachers" /> Teachers
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/vice_principal" className="nav-link">
                        <img src={StudentNav} alt="Vice Principal" /> Vice Principal
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/student" className="nav-link">
                        <img src={StudentNav} alt="Student" /> Student
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/forgot-password-request-list" className="nav-link">
                        <img src={Noticeboard} alt="Exams" /> Forgot Password Request 
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/calender" className="nav-link">
                        <img src={AcademicCalendar} alt="Calender" /> Academic Calender
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/syllabus" className="nav-link">
                        <img src={Homework} alt="Calender" /> Syllabus
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/meetings" className="nav-link">
                    <img src={Noticeboard} alt="Table" /> Meetings
                    </NavLink>
                </li>
            </ul>
}

export default Management

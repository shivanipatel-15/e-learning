import Home from './../../assets/images/home.svg'
import Homework from './../../assets/images/homweork.svg'
import AcademicCalendar from './../../assets/images/academic_calendar.svg'
import Exams from './../../assets/images/exams.svg'
import Noticeboard from './../../assets/images/noticeboard.svg'
import StudentNav from './../../assets/images/student_nav.svg'
import { NavLink } from 'react-router-dom'
import RootStore from '../../store/Root'

interface Props {
    rootStore: RootStore,
}

const Principal: React.FC<Props> = ({ rootStore }) => {
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
                    <NavLink activeClassName="active" to="/management" className="nav-link">
                        <img src={StudentNav} alt="Management" /> Management
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/student" className="nav-link">
                        <img src={StudentNav} alt="Student" /> Student
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/exam" className="nav-link">
                        <img src={Exams} alt="Exams" /> Exams
                    </NavLink>
                </li>
                <li>
                <NavLink activeClassName="active" to="/assignment/list" className="nav-link">
                        <img src={Homework} alt="Assignment" /> Assignment
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

export default Principal

import Home from './../../assets/images/home.svg'
import Homework from './../../assets/images/homweork.svg'
import AcademicCalendar from './../../assets/images/academic_calendar.svg'
import Exams from './../../assets/images/exams.svg'
import LiveClass from './../../assets/images/live_class.svg'
import { NavLink } from 'react-router-dom'
import RootStore from '../../store/Root'

interface Props {
    rootStore: RootStore,
}

const Student: React.FC<Props> = ({ rootStore }) => {
    return <ul className="nav sidebar-nav">
        <li>
            <NavLink activeClassName="active" to="/dashboard" className="nav-link">
                <img src={Home} alt="Home" /> Home
            </NavLink>
        </li>
        <li>
            <NavLink activeClassName="active" to="/assignment/list" className="nav-link">
                <img src={Homework} alt="Homework" /> Assignment
            </NavLink>
        </li>
        <li>
            <NavLink activeClassName="active" to="/live-class" className="nav-link">
                <img src={LiveClass} alt="Class" /> Live Class
            </NavLink>
        </li>
        <li>
            <NavLink activeClassName="active" to="/exam" className="nav-link">
                <img src={Exams} alt="Exams" /> Exams
            </NavLink>
        </li>
        <li>
            <NavLink to="/calender" className="nav-link">
                <img src={AcademicCalendar} alt="Calender" /> Academic Calender
            </NavLink>
        </li>
        <li>
            <NavLink activeClassName="active" to="/notes" className="nav-link">
                <img src={Homework} alt="Notes" /> Notes
            </NavLink>
        </li>
        <li>
            <NavLink to="/syllabus" className="nav-link">
                <img src={Homework} alt="Calender" /> Syllabus
            </NavLink>
        </li>
    </ul>
}

export default Student

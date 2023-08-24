import Home from './../../assets/images/home.svg'
import AcademicCalendar from './../../assets/images/academic_calendar.svg'
import StudentNav from './../../assets/images/student_nav.svg'
import TimeTable from './../../assets/images/time_table.svg'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import RootStore from '../../store/Root'
import Noticeboard from '../../assets/images/noticeboard.svg'
import Homework from './../../assets/images/homweork.svg'

interface Props {
    rootStore: RootStore,
}

const Management: React.FC<Props> = ({ rootStore }) => {
    const [toggleMenu, setToggleMenu] = useState('')
    const updateToggleMenu = (menu: string) => {
        const setMenu = toggleMenu === menu ? '' : menu
        setToggleMenu(setMenu)
    }
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
            <NavLink activeClassName="active" to="/timetable" className="nav-link">
            <img src={TimeTable} alt="Table" /> Timetable
            </NavLink>
        </li>
        <li>
            <NavLink to="/calender" className="nav-link">
                <img src={AcademicCalendar} alt="Calender" /> Academic Calender
            </NavLink>
        </li>
        <li>
            <NavLink to="/circular" className="nav-link">
                <img src={Noticeboard} alt="Calender" /> Circular
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

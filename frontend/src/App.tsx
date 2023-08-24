import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import RootStore from './store/Root'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import LiveClass from './pages/LiveClass/LiveClass'
import AddUsers from './pages/AddUsers/AddUsers'
import AssignmentList from './pages/Assignments/AssignmentList'
import AssignmentAdd from './pages/Assignments/AssignmentAdd'
import AssignmentDetail from './pages/Assignments/AssignmentDetail'
import AssignmentEdit from './pages/Assignments/AssignmentEdit'
import ExamList from './pages/Exam/ExamList'
import ExamAdd from './pages/Exam/ExamAdd'
import ExamDetail from './pages/Exam/ExamDetail'
import Attendance from './pages/Attendance/Attendance'
import ExamEdit from './pages/Exam/ExamEdit'
import TeacherTimeTable from './pages/TimeTable/SelectTeacher'
import StdTimeTable from './pages/TimeTable/SelectStd'
import TimeTableList from './pages/TimeTable/TimeTableList'
import AddTimeTablePage from './pages/TimeTable/AddTimeTablePage'
import TeachersList from './pages/Teachers/TeachersList'
import TeacherDetail from './pages/Teachers/TeacherDetail'
import ManagementList from './pages/Management/ManagementList'
import ManagementDetail from './pages/Management/ManagementDetail'
import StudentList from './pages/Student/StudentList'
import StudentDetail from './pages/Student/StudentDetail'
import Profile from './pages/Profile/Profile'
import ChangePassword from './pages/Password/ChangePassword'
import ForgotPasswordRequest from './pages/Password/ForgotPasswordRequest'
import ForgotPasswordRequestList from './pages/Password/ForgotPasswordRequestList'
import EditUsers from './pages/EditUsers/EditUsers'
import InspectClass from './pages/LiveClass/InspectClass'
import EditTimeTable from './pages/TimeTable/EditTimeTable'
import CircularList from './pages/Circular/CircularList'
import AddCalender from './pages/Calender/AddCalender'
import CalenderList from './pages/Calender/CalenderList'
import EditCalender from './pages/Calender/EditCalender'
import AddCircular from './pages/Circular/AddCircular'
import EditCircular from './pages/Circular/EditCircular'
import AssignSubjects from './pages/Teachers/AssignSubjects'
import StudentImport from './pages/Student/StudentImport'
import VicePrincipalList from './pages/VicePrincipal/VicePrincipalList'
import VicePrincipalDetail from './pages/VicePrincipal/VicePrincipalDetail'
import TeacherImport from './pages/Teachers/TeacherImport'
import AddSyllabus from './pages/Syllabus/AddSyllabus'
import EditSyllabus from './pages/Syllabus/EditSyllabus'
import ListSyllabus from './pages/Syllabus/ListSyllabus'
import NotesList from './pages/Notes/NotesList'
import AddNotes from './pages/Notes/AddNotes'
import EditNotes from './pages/Notes/EditNotes'
import CreateMeeting from './pages/Meeting/CreateMeeting'
import ListMeeting from './pages/Meeting/ListMeeting'
import TimetableList from './pages/TimeTable/TimeTableList'
import TeacherSubjectImport from './pages/Teachers/TeacherSubjectImport'

const rootStore = new RootStore()

function App() {
    return <Router>
        <Switch>
            <Route
                exact
                path='/'
                render={(...props) => <Login {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/dashboard'
                render={(...props) => <Dashboard {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/live-class'
                render={(...props) => <LiveClass {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/add/:user_type'
                render={(...props) => <AddUsers {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/assignment/list'
                render={(...props) => <AssignmentList {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/assignment/add'
                render={(...props) => <AssignmentAdd {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/assignment/detail/:assignment_id'
                render={(...props) => <AssignmentDetail {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/assignment/edit/:assignment_id'
                render={(...props) => <AssignmentEdit {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/exam'
                render={(...props) => <ExamList {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/exam/add'
                render={(...props) => <ExamAdd {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/exam/detail/:exam_id'
                render={(...props) => <ExamDetail {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/exam/edit/:exam_id'
                render={(...props) => <ExamEdit {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/attendance'
                render={(...props) => <Attendance {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/timetable/teacher'
                render={(...props) => <TeacherTimeTable {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/timetable/student'
                render={(...props) => <StdTimeTable {...props} rootStore={rootStore} />} />
            {/* <Route
                exact
                path='/time-table-list'
                render={(...props) => <TimeTableList {...props} rootStore={rootStore} />} /> */}
            <Route
                exact
                path='/timetable/add'
                render={(...props) => <AddTimeTablePage {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/teachers'
                render={(...props) => <TeachersList {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/teacher/detail/:teacher_id'
                render={(...props) => <TeacherDetail {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/management'
                render={(...props) => <ManagementList {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/management/detail/:management_id'
                render={(...props) => <ManagementDetail {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/student'
                render={(...props) => <StudentList {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/student/detail/:student_id'
                render={(...props) => <StudentDetail {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/profile'
                render={(...props) => <Profile {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/change-password'
                render={(...props) => <ChangePassword {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/forgot-password-request'
                render={(...props) => <ForgotPasswordRequest {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/forgot-password-request-list'
                render={(...props) => <ForgotPasswordRequestList {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/edit-profile/:user_type/:user_id'
                render={(...props) => <EditUsers {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/inspectClass/:class_name'
                render={(...props) => <InspectClass {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/timetable/edit/:timetable_id'
                render={(...props) => <EditTimeTable {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/circular'
                render={(...props) => <CircularList {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/calender'
                render={(...props) => <CalenderList {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/calender/add'
                render={(...props) => <AddCalender {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/calender/edit/:calender_id'
                render={(...props) => <EditCalender {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/circular/add'
                render={(...props) => <AddCircular {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/circular/edit/:circular_id'
                render={(...props) => <EditCircular {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/teacher/subject/:teacher_id'
                render={(...props) => <AssignSubjects {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/student/import'
                render={(...props) => <StudentImport {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/vice_principal'
                render={(...props) => <VicePrincipalList {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/vice_principal/detail/:vice_principal_id'
                render={(...props) => <VicePrincipalDetail {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/teacher/import'
                render={(...props) => <TeacherImport {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/syllabus/add'
                render={(...props) => <AddSyllabus {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/syllabus/edit/:_id'
                render={(...props) => <EditSyllabus {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/syllabus'
                render={(...props) => <ListSyllabus {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/notes'
                render={(...props) => <NotesList {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/notes/add'
                render={(...props) => <AddNotes {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/notes/edit/:circular_id'
                render={(...props) => <EditNotes {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/meeting/create'
                render={(...props) => <CreateMeeting {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/meetings'
                render={(...props) => <ListMeeting {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/timetable'
                render={(...props) => <TimeTableList {...props} rootStore={rootStore} />} />
            <Route
                exact
                path='/teacher/import-subject'
                render={(...props) => <TeacherSubjectImport {...props} rootStore={rootStore} />} />
        </Switch>
    </Router>
}

export default App;

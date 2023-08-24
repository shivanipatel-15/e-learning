import 'mobx-react-lite/batchingForReactDom'
import AuthStore from './Auth'
import AssignmentStore from './Assignment'
import AttendanceStore from './Attendance'

class RootStore {
    public authStore: AuthStore
    public assignmentStore: AssignmentStore
    public attendanceStore: AttendanceStore
    
    constructor() {
        this.authStore = new AuthStore(this)
        this.assignmentStore = new AssignmentStore(this)
        this.attendanceStore =  new AttendanceStore(this)
    }
}

export default RootStore
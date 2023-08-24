import { action, observable } from 'mobx'
import RootStore from './Root'
import { getStudentList }  from './../api/attendanceAction'
import { errorToast } from './../utility/toast'

interface StudentList {
    first_name: string
    last_name: string
    student_id: string
    attendance: {
        status?: string
        _id?: string
    }
}

interface Filter {
    standard: string
    division: string
    subject: string
    date: any
    time: string
}

class AttendanceStore {
    public rootStore: RootStore
    @observable public isLoading: boolean
    @observable public studentList: Array<StudentList>
    @observable public page: number
    @observable public errorMessage: string
    @observable public isError: boolean
    @observable public isSubmit: boolean
    @observable public filter: Filter
    
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        this.isLoading = false
        this.errorMessage = ''
        this.isError = false
        this.studentList = []
        this.page = 1
        this.isSubmit = false
        this.filter = {
            standard: '',
            division: '',
            subject: '',
            date: new Date(),
            time: '00:00'
        }
    }

    @action.bound
    getAttendanceList = async () => {
        try {
            this.isLoading = true
            const response = await getStudentList(this.filter)
            console.log(response)
            if (response.data.success === 0) {
                this.isError = true
                this.isLoading = false
                errorToast(response.data.message)
                this.errorMessage = response.data.message
                return
            }
            this.studentList = response.data.data
            this.isError = false
            this.isLoading = false
            return
        } catch(error){
            console.log(error)
            return
        }
        
    }
}

export default AttendanceStore
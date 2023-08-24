import { action, observable } from 'mobx'
import RootStore from './Root'
import { getAssignment, addAssignment }  from './../api/assignmentAction'
import { errorToast } from './../utility/toast'

interface Assignment {
    subject: string
    description: string
    standard: string
    division: string
    submission_due: string
    attachment: string
    attachment_type: string
    createdAt: Date
}

class AssignmentStore {
    public rootStore: RootStore
    @observable public isLoading: boolean
    @observable public assignmentList: Array<Assignment>
    @observable public page: number
    @observable public errorMessage: string
    @observable public isError: boolean
    @observable public isSubmit: boolean
    
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        this.isLoading = false
        this.errorMessage = ''
        this.isError = false
        this.assignmentList = []
        this.page = 1
        this.isSubmit = false
    }

    @action.bound
    getAssignmentList = (page: number) => {
        this.isLoading = true
        getAssignment(page).then((response) => {
            if (response.data.success === 0) {
                this.isError = true
                this.isLoading = false
                errorToast(response.data.message)
                this.errorMessage = response.data.message
                return
            }
            this.assignmentList = response.data.data
            this.isError = false
            this.isLoading = false
            return
        })
    }

    @action.bound
    addNewAssignment = (data: object) => {
        this.isSubmit = false
        addAssignment(data).then((response) => {
            if (response.data.success === 0) {
                this.isError = true
                this.isSubmit = true
                this.errorMessage = response.data.message
                errorToast(response.data.message)
                return
            }
            this.isError = false
            this.isSubmit = true
            return
        })
    }
}

export default AssignmentStore
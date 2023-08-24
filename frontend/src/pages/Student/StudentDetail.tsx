import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useParams } from 'react-router-dom'
import { detailUser } from './../../api/userAction'
import { errorToast } from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'
import moment  from 'moment'

interface Props {
    rootStore: RootStore
}

interface Student {
    _id: string
    student_id: string
    status: string,
    first_name: string
    last_name: string
    email: string
    contact_no: string
    user_type: string
    gender: string
    standard: string
    division: string
    birth_date: string
    sts_number: string
    admission_number: string
    guardian1_contact: string
    guardian2_contact: string
    roll_number: string
}

const StudentDetail: React.FC<Props> = ({ rootStore }) => {
    const params: any = useParams()
    const { student_id } = params
    const [isLoading, setIsLoading] = useState(false)
    const [student, setStudentDetail] = useState<Student | undefined>(undefined)
    
    useEffect(() => {
        getUserDetail(student_id)
    }, [])

    const getUserDetail = async (student_id: string) => {
        try {
            setIsLoading(true)
            const response = await detailUser(student_id)
            const responseData = response.data
            setStudentDetail(responseData.data)
            setIsLoading(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsLoading(false)
        }
    }
    
    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row">
            <div className="my-2">
                <HistoryBack text="Back" />
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title mb-0">Student Detail</h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <strong>Name: </strong> {student?.first_name} {student?.last_name}
                        </li>
                        <li className="list-group-item">
                            <strong>Email: </strong> {student?.email}
                        </li>
                        <li className="list-group-item">
                            <strong>Std-div: </strong> {student?.standard} - {student?.division}
                        </li>
                        <li className="list-group-item">
                            <strong>Gender: </strong> {student?.gender}
                        </li>
                        <li className="list-group-item">
                            <strong>STS number: </strong> {student?.sts_number}
                        </li>
                        <li className="list-group-item">
                            <strong>Roll Number: </strong> {student?.roll_number}
                        </li>
                        <li className="list-group-item">
                            <strong>Admission number: </strong> {student?.admission_number}
                        </li>
                        <li className="list-group-item">
                            <strong>Guardian1 Contact: </strong> {student?.guardian1_contact}
                        </li>
                        <li className="list-group-item">
                            <strong>Guardian2 Contact: </strong> {student?.guardian2_contact}
                        </li>
                        <li className="list-group-item">
                            <strong>Birth Date: </strong> {moment(student?.birth_date).format('DD-MM-YYYY')}
                        </li>
                        <li className="list-group-item">
                            <strong>Status: </strong> {student?.status}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </Container>
}


export default observer(StudentDetail);
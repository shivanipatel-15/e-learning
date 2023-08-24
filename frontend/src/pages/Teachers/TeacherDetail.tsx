import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useParams } from 'react-router-dom'
import { detailUser } from './../../api/userAction'
import { errorToast } from './../../utility/toast'
import HistoryBack from './../../components/Widget/HistoryBack'

interface Props {
    rootStore: RootStore
}

interface Teacher {
    _id: string
    status: string,
    first_name: string
    last_name: string
    email: string
    contact_no: string
    user_type: string
}

const TeacherDetail: React.FC<Props> = ({ rootStore }) => {
    const params: any = useParams()
    const { teacher_id } = params
    const [isLoading, setIsLoading] = useState(false)
    const [teacher, setTeacherDetail] = useState<Teacher | undefined>(undefined)
    
    useEffect(() => {
        getUserDetail(teacher_id)
    }, [])

    const getUserDetail = async (teacher_id: string) => {
        try {
            setIsLoading(true)
            const response = await detailUser(teacher_id)
            const responseData = response.data
            setTeacherDetail(responseData.data)
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
                        <h5 className="card-title mb-0">Teacher Detail</h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <strong>Name: </strong> {teacher?.first_name} {teacher?.last_name}
                        </li>
                        <li className="list-group-item">
                            <strong>Email: </strong> {teacher?.email}
                        </li>
                        <li className="list-group-item">
                            <strong>Contact No: </strong> {teacher?.contact_no}
                        </li>
                        <li className="list-group-item">
                            <strong>Status: </strong> {teacher?.status}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </Container>
}


export default observer(TeacherDetail);
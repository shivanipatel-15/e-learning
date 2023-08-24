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

interface Management {
    _id: string
    status: string,
    first_name: string
    last_name: string
    email: string
    contact_no: string
    user_type: string
}

const ManagementDetail: React.FC<Props> = ({ rootStore }) => {
    const params: any = useParams()
    const { management_id } = params
    const [isLoading, setIsLoading] = useState(false)
    const [management, setManagementDetail] = useState<Management | undefined>(undefined)
    
    useEffect(() => {
        getUserDetail(management_id)
    }, [])

    const getUserDetail = async (management_id: string) => {
        try {
            setIsLoading(true)
            const response = await detailUser(management_id)
            const responseData = response.data
            setManagementDetail(responseData.data)
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
                        <h5 className="card-title mb-0">Management Detail</h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <strong>Name: </strong> {management?.first_name} {management?.last_name}
                        </li>
                        <li className="list-group-item">
                            <strong>Email: </strong> {management?.email}
                        </li>
                        <li className="list-group-item">
                            <strong>Contact No: </strong> {management?.contact_no}
                        </li>
                        <li className="list-group-item">
                            <strong>Status: </strong> {management?.status}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </Container>
}


export default observer(ManagementDetail);
import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { observer } from 'mobx-react'
import { forgotPasswordRequestList, forgotPasswordRequestComplete } from './../../api/userAction'
import { errorToast, successToast } from './../../utility/toast'
import { Link } from 'react-router-dom'

const limit = 10

interface Props {
    rootStore: RootStore
}

const ForgotPasswordRequestList: React.FC<Props> = ({ rootStore }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [requestList, setRequestList] = useState<any>([])
    const [isMoreRecord, setIsMoreRecord] = useState(true)
    const [page, setPage] = useState(1)

    useEffect(() => {
        getRequests({ page })
    }, [])

    const getRequests = async (data: any) => {
        try {
            const response = await forgotPasswordRequestList(data)
            const responseData = response.data
            const allUsers = page === 1 ? responseData.data : [...requestList, ...responseData.data]
            setRequestList(allUsers)
            setIsMoreRecord((limit*page === responseData.data.length) ? true : false)
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    
    const loadMore = (page: number) => {
        setPage(page+1)
        getRequests({page})
    }

    const completeRequest = async (request_id: any) => {
        try {
            const data = { request_id }
            const response = await forgotPasswordRequestComplete(data)
            const responseData =  response.data
            if (responseData.success === 0) {
                errorToast(responseData.message)
                return
            }
            setIsLoading(false)
            successToast(responseData.message)
            getRequests({ page })
        }catch(error){
            errorToast('Error! something is wrong')
        }
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={isLoading}>
        <div className="row">
            <div className="my-3 col-12">
                <h4>Forgot Password Requests</h4>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="table-responsive">
                        <table className="table assignment_table">
                            <thead>
                                <tr>
                                    <th>User type</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Contact No</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    requestList.length === 0 ?
                                        <tr><td colSpan={5} className="text-center">No record found</td></tr>
                                    :
                                    requestList.map((data: any) => {
                                        return <tr key={uuidv4()}>
                                            <td>{data.user_type}</td>
                                            <td>
                                                {
                                                    data.user_id ?
                                                    <Link 
                                                        to={`/edit-profile/${data.user_type}/${data.user_id}`} 
                                                        className='mr-2'>
                                                    {data.username}
                                                    </Link> : data.username
                                                }
                                                </td>
                                            <td>{data.email}</td>
                                            <td>{data.contact_no}</td>
                                            <td>{data.status}</td>
                                            <td>
                                                <button className="btn btn-primary btn-sm" onClick={() => completeRequest(data._id)}>
                                                    Mark Complete
                                                </button>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    isMoreRecord === true && 
                    <div className="col-12 d-flex justify-content-center">
                        <button 
                            className="btn btn-primary btn-login mt-3 px-5" 
                            onClick={() => loadMore(page)}
                        >Load More</button>
                    </div>
                }
            </div>
        </div>
    </Container>
}


export default observer(ForgotPasswordRequestList);
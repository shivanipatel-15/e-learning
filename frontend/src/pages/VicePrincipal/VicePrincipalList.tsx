import Container from '../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { listUser } from '../../api/userAction'
import { errorToast } from '../../utility/toast'
import editIcon from './../../assets/images/edit_color.svg'

const limit = 10

interface Props {
    rootStore: RootStore
}

interface VicePrincipal {
    _id: string
    status: string,
    first_name: string
    last_name: string
    username: string
    email: string
    contact_no: string
    user_type: string
}

interface Filter {
    first_name: string
    last_name: string
    email: string
    status: string
    user_type: string
    page: number
}

const VicePrincipalList: React.FC<Props> = ({ rootStore }) => {
    const [userList, setUsersList] = useState<any>([])
    const [isMoreRecord, setIsMoreRecord] = useState(true)
    const [filter, setFilter] = useState<Filter>({
        first_name: '',
        last_name: '',
        email: '',
        status: '',
        user_type: 'vice_principal',
        page: 1
    })
    
    const getUsers = async (filter: Filter) => {
        try {
            const response = await listUser(filter)
            const responseData = response.data
            const allUsers = filter.page === 1 ? responseData.data : [...userList, ...responseData.data]
            setUsersList(allUsers)
            setIsMoreRecord((limit === responseData.data.length) ? true : false)
        } catch (error) {
            errorToast('Error! something is wrong')
        }
    }

    useEffect(() => {
        getUsers(filter)
    }, [filter])

    const onChange = (e: any) => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'first_name') {
            filter.first_name = value
        } else if (name === 'last_name') {
            filter.last_name = value
        } else if (name === 'status') {
            filter.status = value
        } else if (name === 'email') {
            filter.email = value
        }
        filter.page = 1
        setFilter(filter)
        getUsers(filter)
    }
    const { userRole } = rootStore.authStore
    const loadMore = (page: number) => {
        filter.page = page + 1
        getUsers(filter)
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <div className="row">
            <div className="my-3 col-12">
                <h4>Vice Principal</h4>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body d-flex justify-content-around align-items-center filters">
                        <div className="attendance_filter">
                            <div className="form-group">
                                <label htmlFor="first_name">First Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    placeholder="First Name"
                                    value={filter.first_name}
                                    onChange={onChange} 
                                />
                            </div>
                        </div>
                        <div className="attendance_filter">
                            <div className="form-group">
                                <label htmlFor="last_name">Last Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Last Name"
                                    value={filter.last_name}
                                    onChange={onChange} 
                                />
                            </div>
                        </div>
                        <div className="attendance_filter">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    value={filter.email}
                                    onChange={onChange} 
                                />
                            </div>
                        </div>
                        <div className="attendance_filter">
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    className="form-control"
                                    id="status"
                                    name="status"
                                    onChange={onChange}
                                >
                                    <option value=''> Select Status </option>
                                    <option value="active">Active</option>
                                    <option value="blocked">Blocked</option>
                                    <option value="deleted">Deleted</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card mt-4">
                    <div className="table-responsive">
                        <table className="table assignment_table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Contact No</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    userList.length === 0 ?
                                        <tr><td colSpan={5} className="text-center">No record found</td></tr>
                                    :
                                    userList.map((data: VicePrincipal) => {
                                        return <tr key={uuidv4()}>
                                            <td>{data.first_name} {data.last_name}</td>
                                            <td>{data.username}</td>
                                            <td>{data.email}</td>
                                            <td>{data.contact_no}</td>
                                            <td>{data.status}</td>
                                            <td>
                                                { userRole === 'admin' && 
                                                <Link to={`/edit-profile/vice_principal/${data._id}`} className='mr-2 action_info'>
                                                    <img src={editIcon} alt="Edit icon" />
                                                </Link> }
                                                <Link to={`/vice_principal/detail/${data._id}`}>
                                                    View Profile
                                                </Link>
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
                            onClick={() => loadMore(filter.page)}
                        >Load More</button>
                    </div>
                }
            </div>
        </div>
    </Container>
}


export default observer(VicePrincipalList);
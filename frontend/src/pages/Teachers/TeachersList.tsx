import Container from './../../components/Layout/Container'
import RootStore from '../../store/Root'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { listUser, userChangeStatus } from './../../api/userAction'
import { errorToast, successToast } from './../../utility/toast'
import { Dropdown, DropdownButton } from 'react-bootstrap'

const limit = 10

interface Props {
    rootStore: RootStore
}

interface Teacher {
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

const TeachersList: React.FC<Props> = ({ rootStore }) => {
    const [isSearch, setIsSearch] = useState(false)
    const [userList, setUsersList] = useState<any>([])
    const [isMoreRecord, setIsMoreRecord] = useState(true)
    const [filter, setFilter] = useState<Filter>({
        first_name: '',
        last_name: '',
        email: '',
        status: '',
        user_type: 'teacher',
        page: 1
    })
    const { userRole } = rootStore.authStore
    useEffect(() => {
        getUsers(filter)
    }, [])

    const getUsers = async (filter: Filter) => {
        try {
            setIsSearch(true)
            const response = await listUser(filter)
            const responseData = response.data
            const allUsers = filter.page === 1 ? responseData.data : [...userList, ...responseData.data]
            setUsersList(allUsers)
            setIsSearch(false)
            setIsMoreRecord((limit === responseData.data.length) ? true : false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsSearch(false)
        }
    }

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

    const loadMore = (page: number) => {
        filter.page = page + 1
        getUsers(filter)
    }

    const changeUserStatus = async (user_id: string, status: string) => {
        const data = { user_id, status }
        try {
            setIsSearch(true)
            const response = await userChangeStatus(data)
            if(response.data.success === 0) {
                errorToast(response.data.message)
                return
            }
            successToast(response.data.message)
            const findUserIndex = userList.findIndex((user: any) => user._id === user_id)
            userList[findUserIndex].status = status
            setUsersList(userList)
            setIsSearch(false)
        } catch (error) {
            errorToast('Error! something is wrong')
            setIsSearch(false)
        }
    }

    return <Container rootStore={rootStore} redirectIfNotLoggedIn={true} isLoading={false}>
        <div className="row">
            <div className="my-3 col-12 d-flex justify-content-between">
                <h4>Teachers</h4>
                <div className='actions'>
                    {userRole === 'admin' &&
                        <>
                            <Link to={`/teacher/import`} className="btn btn-primary btn-login mt-0 px-5 mx-1">Import Teachers</Link>
                            <Link to={`/teacher/import-subject`} className="btn btn-primary btn-login mt-0 px-5">Import Subject</Link>
                        </>
                    }
                </div>
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
                                    <option value="archive">Archived</option>
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
                                    (isSearch === false && userList.length === 0) ?
                                        <tr><td colSpan={5} className="text-center">No record found</td></tr>
                                        :
                                        userList.map((data: Teacher) => {
                                            return <tr key={uuidv4()}>
                                                <td>{data.first_name} {data.last_name}</td>
                                                <td>{data.username}</td>
                                                <td>{data.email}</td>
                                                <td>{data.contact_no}</td>
                                                <td>{data.status}</td>
                                                <td>
                                                    <DropdownButton id="dropdown-basic-button" title="..." className="btn_title">
                                                        {userRole === 'admin' && <>
                                                            <Dropdown.Item as="button">
                                                                <Link to={`/edit-profile/teacher/${data._id}`} className='mr-2 action_info'>
                                                                    Edit Profile
                                                                </Link>
                                                        </Dropdown.Item>
                                                        </>
                                                        }
                                                        <Dropdown.Item as="button">
                                                            <Link to={`/teacher/detail/${data._id}`}>
                                                                View Profile
                                                            </Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item as="button">
                                                            <Link to={`/teacher/subject/${data._id}`}>
                                                                Assign Subject
                                                            </Link>
                                                        </Dropdown.Item>
                                                        { data.status === 'archive' ? <Dropdown.Item as="button" onClick={() => changeUserStatus(data._id, 'active')}>Make Active</Dropdown.Item> : <Dropdown.Item as="button" onClick={() => changeUserStatus(data._id, 'archive')}>Archive</Dropdown.Item> }
                                                    </DropdownButton>
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


export default observer(TeachersList);
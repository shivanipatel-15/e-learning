import { observer } from 'mobx-react'
import Search from './../assets/images/search.svg'
import Person from './../assets/images/person.png'
import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import RootStore from '../store/Root'

interface Props {
    rootStore: RootStore,
}

const Header: React.FC<Props> = ({ rootStore }) => {
    const [showMenu, setShowMenu] = useState(false)
    const { userLoginData } = rootStore.authStore
    const history = useHistory()

    const doLogout = () => {
        rootStore.authStore.logout()
        history.push('/')
    }

    return <>
        <header className="header">
            <div className="header_search">
                <input className="input-search" type="text" name="search" placeholder="search" />
                <button className="btn-search">
                    <img src={Search} alt="Search Btn" />
                </button>
            </div>
            <div className="header_tools">
                {/* <div className="notification">
                    <img src={Notification} alt="Notification" />
                </div> */}
                <div className="header_menu" onClick={() => setShowMenu(!showMenu)}>
                    <img src={Person} alt="Login user name" height='50' width='50' />
                    <div className="user_info">
                        <h3 className="person_name">{userLoginData.first_name} {userLoginData.last_name}</h3>
                        <p className="person_role">{userLoginData.user_type}</p>
                    </div>
                    <div className={'profile_submenu' + (showMenu === true ? '' : ' d-none')}>
                        <ul>
                            { userLoginData.user_type !== 'student' && <li><Link to='/profile' className="menu_link">Profile</Link></li> }
                            <li><Link to='/change-password' className="menu_link">Change Password</Link></li>
                            <li><button className="btn btn-link btn-block menu_link" onClick={doLogout}>Logout</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    </>
}


export default observer(Header);
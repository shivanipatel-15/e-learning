import Logo from './../assets/images/logo.svg'
import { useState } from 'react'
import RootStore from '../store/Root'
import * as FaIcons from 'react-icons/fa'
import * as GrIcons from 'react-icons/gr'
import Admin from './Navigation/Admin'
import Principal from './Navigation/Principal'
import Management from './Navigation/Management'
import Student from './Navigation/Student'
import Teacher from './Navigation/Teacher'
import VicePrincipal from './Navigation/VicePrincipal'
interface Props {
    rootStore: RootStore,
}

const SideMenu: React.FC<Props> = ({ rootStore }) => {
    const [toggleMenu, setToggleMenu] = useState('')
    const { userRole } = rootStore.authStore
    const updateToggleMenu = (menu: string) => {
        const setMenu = toggleMenu === menu ? '' : menu
        setToggleMenu(setMenu)
    }
    const [sidebar, setSidebar] = useState(false)
    const sidebarClose = () => setSidebar(false);
    return <>
        <div className="navbar_menu">
            <button className="menu_bar">
                <FaIcons.FaBars style={{ fontSize: "30px", marginTop: "10px" }} onClick={() => setSidebar(!sidebar)} />
            </button>
        </div>
        <nav className={"fixed-top custom-scroll" + (sidebar === true ? '' : ' sidebar_display')} >
            <button className="close_btn">
                <GrIcons.GrClose style={{ fontSize: "20px" }} onClick={sidebarClose} />
            </button>
            <div className="site_logo">
                <img src={Logo} alt="LOGO" />
            </div>
            { userRole === 'admin' && <Admin rootStore={rootStore} /> }
            { userRole === 'principal' && <Principal rootStore={rootStore} /> }
            { userRole === 'vice_principal' && <VicePrincipal rootStore={rootStore} /> }
            { userRole === 'management' && <Management rootStore={rootStore} /> }
            { userRole === 'teacher' && <Teacher rootStore={rootStore} /> }
            { userRole === 'student' && <Student rootStore={rootStore} /> }
    </nav>
    </>
}

export default SideMenu
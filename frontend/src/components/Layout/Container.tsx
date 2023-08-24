import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import Header from './../Header'
import SideMenu from './../SideMenu'
import Spinner from './../Spinner'
import RootStore from '../../store/Root'
import { Redirect } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { profile } from './../../api/authAction'

interface Props {
    rootStore: RootStore,
    redirectIfNotLoggedIn?: boolean,
    isLoading: boolean
}

const Container: React.FC<Props> = (props) => {
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const rootStore = props.rootStore
    
    const getUserInfo = async () => {
        if(isDataLoaded === false) {
            const userInfo = await profile()
            props.rootStore.authStore.setUserProfileInfo(userInfo.data.data)
            setIsDataLoaded(true)
        }
    }

    useEffect(() => {
        getUserInfo()
    })

    if (props.redirectIfNotLoggedIn === true) {
        if (rootStore.authStore.isUserLoggedIn === false) {
            return <Redirect to="/" />
        }
    }

    return (isDataLoaded === true) ?
            <>
                <ToastContainer />
                <Spinner loading={props.isLoading} />
                <div className="page_layout">
                    <SideMenu rootStore={props.rootStore} />
                    <div className="container">
                        <Header rootStore={props.rootStore} />
                        {props.children}
                        <div className='footer text-center pt-2'>
                            <p>Powered by <a className="copyright-link" rel="noreferrer" href="https://intranotion.com/" target="_blank">Intranotion</a></p>
                        </div>
                    </div>
                </div> </> : <Spinner loading={!isDataLoaded} />
}

export default observer(Container)
import React from 'react'
import Spinner from './../Spinner'
import RootStore from '../../store/Root'
import { Redirect } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    rootStore: RootStore,
    redirectIfNotLoggedIn?: boolean,
    isLoading: boolean
}

const DefaultLayout: React.FC<Props> = (props) => {
    const rootStore = props.rootStore
    if (props.redirectIfNotLoggedIn === true) {
        if (rootStore.authStore.isUserLoggedIn === true) {
            return <Redirect to="/dashboard" />
        }
    }

    return <>
        <ToastContainer />
        <Spinner loading={props.isLoading} />
        {props.children}
    </>
}

export default DefaultLayout
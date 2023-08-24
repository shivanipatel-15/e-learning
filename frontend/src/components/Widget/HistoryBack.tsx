import { useHistory } from "react-router-dom"
import imageIcon from './../../assets/images/left-arrow.png'
import { FC } from 'react'

interface Props {
    text?: string
}

const HistoryBack:  FC<Props> = ({ text }) => {
    let history = useHistory()
    return <>
        <button className='btn btn-link text-dark' title="Back" onClick={() => history.goBack()}>
            <img src={imageIcon} alt="Back" height='20' width='20' /> {text || ''}
        </button>
    </>
}

export default HistoryBack
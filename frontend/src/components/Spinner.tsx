import { FC } from 'react'

interface Props {
    loading: boolean
}

const Spinner:  FC<Props> = ({ loading }) => {
    return loading === true ? <div className="spinner-area">
        <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div> : null
}

export default Spinner
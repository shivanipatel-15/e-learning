import { FC } from 'react'
import { Link } from 'react-router-dom'
import AddIcon from './AddIcon'

interface Props {
    title: string,
    count?: number,
    color: string,
    to?: string
}

const CountCard:  FC<Props> = ({ title, count, color, to }) => {
    return <div className="card count-card" style={{ borderLeftColor: color }}>
        <div className="card-body">
            <div className="card-action">
                {
                    to ? <Link to={to}><AddIcon color={color} /></Link> : <AddIcon color={color} />
                }
            </div>
            <div className="card-data">
                <p>{title}</p>
                { count != null && <h4>{count}</h4> }
            </div>
        </div>
    </div>
}

export default CountCard
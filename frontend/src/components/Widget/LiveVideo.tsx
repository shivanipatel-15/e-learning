import { FC } from 'react'
import micOn from './../../assets/images/mic_on.svg'
import micOff from './../../assets/images/mic_off.svg'

interface Props {
    url: string,
    name: string,
    isMute: boolean
}

const LiveVideo: FC<Props> = ({ url, name, isMute }) => {
    return <div className="card video_card">
        <img className="card-img-top" src={url} alt={name} />
        <div className="person_name">{name}</div>
        <div className="mute_icon">
            <img className="card-img-top" src={isMute === true ? micOff : micOn} alt="Mic" />
        </div>
    </div>
}

export default LiveVideo
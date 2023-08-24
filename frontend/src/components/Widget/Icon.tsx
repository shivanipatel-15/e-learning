import { FC } from 'react'

interface Props {
    src: string,
    height?: number,
    width?: number
}

const Icon:  FC<Props> = ({ src, height = 25, width = 25 }) => {
    return <div className="d-flex video_icon" style={{ height: height, width: width }}>
            <img src={src} alt="icon" />
        </div>
}

export default Icon
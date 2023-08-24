import { FC } from 'react'

interface Props {
    color: string
}

const EditIcon:  FC<Props> = ({ color }) => {
    return <>
        <svg xmlns="http://www.w3.org/2000/svg" width="18.676" height="18.656" viewBox="0 0 18.676 18.656">
            <g id="Edit_pencil" data-name="Edit pencil" transform="translate(0 -0.247)">
                <path id="Path_19703" data-name="Path 19703" d="M11.533,82.473,1.257,92.749a.41.41,0,0,0-.107.188L.011,97.509a.4.4,0,0,0,.392.5A.4.4,0,0,0,.5,98L5.073,96.86a.4.4,0,0,0,.188-.107L15.538,86.477Zm0,0" transform="translate(0 -79.108)" fill={color} />
                <path id="Path_19704" data-name="Path 19704" d="M339.734,1.963,338.59.82a2.071,2.071,0,0,0-2.861,0l-1.4,1.4,4,4,1.4-1.4a2.023,2.023,0,0,0,0-2.861Zm0,0" transform="translate(-321.65 0)" fill={color} />
            </g>
        </svg>

        <span className="card-text" style={{ color: color }}> Edit</span>
    </>
}

export default EditIcon
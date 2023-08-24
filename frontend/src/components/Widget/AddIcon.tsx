import { FC } from 'react'

interface Props {
    color: string
}

const AddIcon:  FC<Props> = ({ color }) => {
    return <>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28">
            <g id="Add_" data-name="Add +" transform="translate(-855 -308)">
                <g id="Group_19147" data-name="Group 19147" transform="translate(-51)">
                <g id="Ellipse_20" data-name="Ellipse 20" transform="translate(906 308)" fill="#fff" stroke={color} strokeWidth="1">
                    <circle cx="14" cy="14" r="14" stroke="none"/>
                    <circle cx="14" cy="14" r="13.5" fill="none"/>
                </g>
                <text id="_" data-name="+" transform="translate(913 329)" fill={color} fontSize="20" fontFamily="Poppins-Regular, Poppins"><tspan x="0" y="0">+</tspan></text>
                </g>
            </g>
        </svg>
        <span className="card-text" style={{ color: color }}> Add</span>
    </>
}

export default AddIcon
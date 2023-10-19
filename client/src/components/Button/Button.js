import React from 'react'
import '../../assets/button.css';
const Button = (props) => {
const {text, onClick} = props;
    return(
            <button className='btn' onClick={(e) => onClick(e)}>{text}</button>
    )
}
export default Button;
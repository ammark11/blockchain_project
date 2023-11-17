import React from 'react'
import '../../assets/header.css';
import Logo from '../../assets/Cryptocurrency.png'
import AmericanFlag from '../../assets/united-states-of-america.png'
import Arrow from '../../assets/down-arrow.png'
import { Link } from 'react-router-dom';

const MainHeader =() => {
    return(
       <div className='header'>
           <div className='header__logo'>
               <img src={Logo} />
               <p>NeoChain</p>
           </div>
           <div className='header__links'>
               <ul>
                <li><a href="#">HOW IT WORKS</a></li>
                <Link to="/lists">CRYPTOS</Link>
                <Link to="/register-node">Register Node</Link>
                <Link to="/nodes-dashboard">Nodes Dashboard</Link>
                {/* <li><a href='#'>CRYPTOS</a></li> */}
               </ul>
           </div>
           <div className='header__language'>
               <div className='header__language__container'>
                   <img src={AmericanFlag} width={20} height={20}/>
                   <img src={Arrow} width={20} height={20} />
               </div>
           </div>
       </div>
    )
}
export default MainHeader;
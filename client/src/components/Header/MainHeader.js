import React, { useState, useEffect } from 'react'
import '../../assets/header.css';
import Logo from '../../assets/Cryptocurrency.png'
import AmericanFlag from '../../assets/united-states-of-america.png'
import Arrow from '../../assets/down-arrow.png'
import { Link } from 'react-router-dom';
import LoginModal from '../LoginModal';
import { isAuthenticated, logout } from '../../utils/auth';

const MainHeader =() => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(isAuthenticated());
    }, []);

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
    };

    return(
        <>
            <div className='header'>
                <div className='header__logo'>
                    <img src={Logo} alt="Logo" />
                    <p>NeoChain</p>
                </div>
                <div className='header__links'>
                    <ul>
                        <Link to="/lists">CRYPTOS</Link>
                        <Link to="/register-node">Register Node</Link>
                        <Link to="/nodes-dashboard">Nodes Dashboard</Link>
                    </ul>
                </div>
                <div className='header__auth'>
                    {isLoggedIn ? (
                        <button 
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            Logout
                        </button>
                    ) : (
                        <button 
                            onClick={() => setShowLoginModal(true)}
                            className="login-button"
                        >
                            Login
                        </button>
                    )}
                </div>
                <div className='header__language'>
                    <div className='header__language__container'>
                        <img src={AmericanFlag} width={20} height={20} alt="Language" />
                        <img src={Arrow} width={20} height={20} alt="Arrow" />
                    </div>
                </div>
            </div>

            <LoginModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)} 
            />
        </>
    );
}

export default MainHeader;
import React from 'react';
import "../../assets/header.css";
import Logo from "../../assets/Cryptocurrency.png";
import AmericanFlag from "../../assets/united-states-of-america.png";
import Arrow from "../../assets/down-arrow.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="header__logo">
        <img src={Logo} alt="Logo" />
        <p>CipherGuard</p>
      </div>
      <div className="header__links">
        <ul>
          <li><Link to="/">MAIN PAGE</Link></li>
          <li><Link to="/generator">RSA KEY GENERATOR</Link></li>
          <li><Link to="/lists">INSERT</Link></li>
          <li><Link to="/register-node">Register Node</Link></li>
          <li><Link to="/nodes-dashboard">Nodes Dashboard</Link></li>
          <li><Link to="/update-transaction">Update Transaction</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </div>
      <div className="header__language">
        <div className="header__language__container">
          <img src={AmericanFlag} width={20} height={20} alt="Flag" />
          <img src={Arrow} width={20} height={20} alt="Arrow" />
        </div>
      </div>
    </div>
  );
};

export default Header;

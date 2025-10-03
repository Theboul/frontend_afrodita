import React from "react";
import "./Styles/Header.css";
import { MdPersonOutline } from "react-icons/md";

type HeaderProps = {
  logoSrc?: string;
  onMenuClick: () => void; // nueva prop
};

const Header: React.FC<HeaderProps> = ({ logoSrc = "../../../public/assets/1.png", onMenuClick }) => {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick}>
        &#9776;
      </button>
      <div className="logo-container">
        <img src={logoSrc} alt="Logo" className="logo" />
      </div>
      <div className="header-icons">
        <button className="user-btn">
          <MdPersonOutline />
        </button>
      </div>
    </header>
    
  );
};

  export default Header;

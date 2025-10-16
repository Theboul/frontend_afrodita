import React from "react";
import "./Styles/Header.css";
import { MdPersonOutline } from "react-icons/md";

type HeaderProps = {
  logoSrc?: string;
};

const Header: React.FC<HeaderProps> = ({ logoSrc = "../../../public/assets/1.png" }) => {
  return (
    <header className="header">
      {/* Botón menú hamburguesa */}
      <button className="menu-btn">&#9776;</button>

      {/* Logo central */}
      <div className="logo-container">
        <img src={logoSrc} alt="Logo" className="logo" />
      </div>

      {/* Contenedor de íconos (usuario, carrito, etc.) */}
      <div className="header-icons">
        <button className="user-btn">
          <MdPersonOutline />
        </button>
      </div>
    </header>
  );
};

export default Header;
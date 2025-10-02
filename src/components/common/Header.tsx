import React from "react";
import "./Styles/Header.css";
import { MdPersonOutline } from "react-icons/md"; // Icono usuario minimalista
type HeaderProps = {
  logoSrc?: string; // opcional: ruta del logo
};


const Header: React.FC<HeaderProps> = ({ logoSrc = "../public/assets/1.png" }) => {
  return (
    <header className="header">
      {/* Botón menú hamburguesa */}
      <button className="menu-btn">&#9776;</button>

      {/* Logo central */}
      <div className="logo-container">
        <img src={logoSrc} alt="Logo" className="logo" />
      </div>

      {/* Icono usuario */}
     
      <button className="user-btn">
        <MdPersonOutline size={30} /> {/* Tamaño ajustable */}
      </button>
    </header>
  );
};

export default Header;

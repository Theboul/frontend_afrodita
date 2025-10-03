type SidebarProps = {
  isOpen: boolean;

};

import React from "react";
import { MdDashboard, MdInventory, MdPeople, MdPerson, MdSettings } from "react-icons/md";
import "./Styles/sidebar.css";

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <li>
          <MdDashboard className="icon" />
          <span>Dashboard</span>
        </li>
        <li>
          <MdInventory className="icon" />
          <span>Gestión de Inventario</span>
        </li>
        <li>
          <MdPeople className="icon" />
          <span>Gestión de Vendedores</span>
        </li>
        <li>
          <MdPerson className="icon" />
          <span>Gestión de Clientes</span>
        </li>
        <li>
          <MdSettings className="icon" />
          <span>Configuración</span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;


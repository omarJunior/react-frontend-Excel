import React from 'react'
import logo from './logo.jpeg';
import './Header.css';
import { NavLink  }  from 'react-router-dom';

export const Header = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <NavLink activeClassName="selected" className="navbar-brand" to="/content"><img src={logo} alt="Icono de la web" title="Logo png"/></NavLink>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink activeClassName="selected" className="navbar-brand" to="/clientes">Clientes</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink activeClassName="selected" className="navbar-brand" to="/helados">Helados</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink activeClassName="selected" className="navbar-brand" to="/calificaciones">Calificaciones</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink activeClassName="selected" className="navbar-brand" to="/productos">Productos</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink activeClassName="selected" className="navbar-brand" to="/vehiculos">Vehiculos</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink activeClassName="selected" className="navbar-brand" to="/articulos">Articulos</NavLink>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

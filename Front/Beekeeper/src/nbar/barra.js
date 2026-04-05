import React, { useState } from 'react';
import "./barra.css"

export default function BarraNavegacion(props){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // NUEVO: Estado para saber qué submenú exacto está abierto
    const [openDropdown, setOpenDropdown] = useState("");

    const closeSesion = () =>{
        props.setUsr(null)
        props.setViewState("Login")
    }

    const handleNavigation = (view) => {
        props.setViewState(view);
        setIsMenuOpen(false); // Cierra el menú principal en móvil
        setOpenDropdown("");  // Cierra cualquier submenú abierto
    }

    // NUEVO: Función para alternar los submenús al hacer clic
    const toggleDropdown = (menuName) => {
        if (openDropdown === menuName) {
            setOpenDropdown(""); // Si ya estaba abierto, lo cierra
        } else {
            setOpenDropdown(menuName); // Si era otro, lo abre
        }
    }

    const createView = () => {
        return (
            <nav className="navbar-horizontal">
                <div className="nav-container">
                    <div className="nav-logo">
                        <div className="logo-icon">⬢</div>
                        <span>BEEKEEPER</span>
                    </div>
                    
                    <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? '✖' : '☰'}
                    </button>

                    <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                        
                        <li className="dropdown">
                            <button className="dropbtn active" onClick={() => toggleDropdown("colmenas")}>
                                Mis Colmenas {openDropdown === "colmenas" ? '▲' : '▼'}
                            </button>
                            {/* Se agrega la clase 'show' solo si este menú está activo */}
                            <div className={`dropdown-content active ${openDropdown === "colmenas" ? "show" : ""}`}>
                                <div onClick={() => handleNavigation("VerMisColmenas")}>Ver mis Colmenas</div>
                                <div onClick={() => handleNavigation("CrearNuevaColmenas")}>Crear Nueva Colmena</div>
                            </div>
                        </li>

                        <li className="dropdown">
                            <button className="dropbtn active" onClick={() => toggleDropdown("apiarios")}>
                                Mis Apiarios {openDropdown === "apiarios" ? '▲' : '▼'}
                            </button>
                            <div className={`dropdown-content active ${openDropdown === "apiarios" ? "show" : ""}`}>
                                <div onClick={() => handleNavigation("VerMisApiarios")}>Ver todos los Apiarios</div>
                                <div onClick={() => handleNavigation("CrearApiaro")}>Crear Nuevo Apiario</div>
                            </div>
                        </li>
                        
                        <li className="dropdown">
                            <button className="dropbtn active" onClick={() => toggleDropdown("perfil")}>
                                Perfil {openDropdown === "perfil" ? '▲' : '▼'}
                            </button>
                            <div className={`dropdown-content active ${openDropdown === "perfil" ? "show" : ""}`}>
                                <div onClick={() => handleNavigation("MiPerfil")}>Mi Perfil</div>
                                <div onClick={() => handleNavigation("ActualizarDatos")}>Actualizar datos</div>
                            </div>
                        </li>

                        {/* NUEVO: Botón de Cerrar Sesión (Solo visible en móviles) */}
                        <li className="mobile-only-logout">
                            <button className="dropbtn btn-logout" onClick={() => closeSesion()}>
                                Cerrar Sesión ➔
                            </button>
                        </li>
                    </ul>

                    {/* El panel de usuario tradicional (Se oculta en móviles) */}
                    <div className="nav-user">
                        <div className="user-avatar">CM</div>
                        <div className="user-info">
                            <p className="user-name">Carlos M.</p>
                            <a href="#" className="logout-link" onClick={() => closeSesion()}>
                                Cerrar Sesión
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <section>
            {createView()}
        </section>
    );
}
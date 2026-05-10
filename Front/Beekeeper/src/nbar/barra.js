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
        // If the view is "ReporteCompleto", trigger the download function
        // instead of changing the main application view.
        if (view === "ReporteCompleto") {
            if (props.onDownloadReport) {
                props.onDownloadReport();
            }
            setIsMenuOpen(false); // Close the main menu on mobile
            setOpenDropdown("");  // Close any open submenu
            return; // Prevent further navigation logic
        }
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
                    <div className="nav-logo" onClick={() => handleNavigation("Home")}>
                        <div className="logo-icon">⬢</div>
                        <span>BEEKEEPER</span>
                    </div>
                    
                    <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? '✖' : '☰'}
                    </button>

                    <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                         <li className="dropdown">
                            <button className="dropbtn active" onClick={() => toggleDropdown("Mantenimiento")}>
                                Produccion Mantenimiento {openDropdown === "Mantenimiento" ? '▲' : '▼'}
                            </button>
                            {/* Se agrega la clase 'show' solo si este menú está activo */}
                            <div className={`dropdown-content active ${openDropdown === "Mantenimiento" ? "show" : ""}`}>
                                <div onClick={() => handleNavigation("AlimentarColmena")}>Registrar Alimentación</div>
                                <div onClick={() => handleNavigation("RegistrarProduccion")}>Registrar Producción</div>
                                <div onClick={() => handleNavigation("VerAlimentacion")}>Historial Alimentación</div>
                                <div onClick={() => handleNavigation("VerCosechas")}>Historial Producción</div>

                            </div>
                        </li>
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
                            <button className="dropbtn active" onClick={() => toggleDropdown("analisis")}>
                                Estadísticas {openDropdown === "analisis" ? '▲' : '▼'}
                            </button>
                            <div className={`dropdown-content active ${openDropdown === "analisis" ? "show" : ""}`}>
                                <div onClick={() => handleNavigation("Estadisticas")}>Dashboard Global & ROI</div>
                                <div onClick={() => handleNavigation("AnalisisApiarios")}>Rendimiento por Apiario</div>
                                <div onClick={() => handleNavigation("EficienciaApiarios")}>Eficiencia por Colmena</div>
                                <div onClick={() => handleNavigation("RendimientoAltura")}>Rendimiento por Altura</div>
                                <div onClick={() => handleNavigation("ReporteCompleto")} style={{fontWeight: '900', color: '#b45309', borderTop: '2px solid var(--dark-brown)', marginTop: '5px', paddingTop: '5px'}}>📥 Descargar Métricas</div>
                            </div>
                        </li>

                        {/* Opciones de perfil solo para móviles (dentro del menú hamburguesa) */}
                        <li className="mobile-only-profile">
                            <div onClick={() => handleNavigation("MiPerfil")}>Mi Perfil</div>
                            <div onClick={() => handleNavigation("ActualizarDatos")}>Actualizar Perfil</div>
                        </li>
                        {/* NUEVO: Botón de Cerrar Sesión (Solo visible en móviles) */}
                        <li className="mobile-only-logout">
                            <button className="dropbtn btn-logout" onClick={() => closeSesion()}>
                                Cerrar Sesión ➔
                            </button>
                        </li>
                    </ul>

                    {/* Panel de usuario como Dropdown (Solo visible en computadoras) */}
                    <div className="nav-user dropdown">
                        <div className="user-avatar-info" onClick={() => toggleDropdown("userMenu")}>
                            <div className="user-avatar">{props.usr?.nombre?.[0]}{props.usr?.apellido?.[0]}</div>
                            <div className="user-info">
                                <p className="user-name">{(props.usr?.nombre || "Usuario") + " " + (props.usr?.apellido || "")} {openDropdown === "userMenu" ? '▲' : '▼'}</p>
                            </div>
                        </div>
                        <div className={`dropdown-content user-dropdown-right ${openDropdown === "userMenu" ? "show" : ""}`}>
                            <div onClick={() => handleNavigation("MiPerfil")}>Mi Perfil</div>
                            <div onClick={() => handleNavigation("ActualizarDatos")}>Actualizar Perfil</div>
                            <div onClick={() => closeSesion()} className="logout-item">Cerrar Sesión</div>
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
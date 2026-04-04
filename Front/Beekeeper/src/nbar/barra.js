import React, { useState, useEffect } from 'react';
import "./barra.css"

export default function BarraNavegacion(props){


    const closeSesion = () =>{
        props.setUsr(null)
        props.setViewState("Login")
    }
    const createView = () => {
        return (
            <nav className="navbar-horizontal">
                <div className="nav-container">
                    <div className="nav-logo">
                        <div className="logo-icon">⬢</div>
                        <span>BEEKEEPER</span>
                    </div>
                    
                    <ul className="nav-links">
                        {/* Item con Dropdown */}
                        <li className="dropdown">
                            <button className="dropbtn active">
                                Mis Colmenas
                            </button>
                            <div className="dropdown-content active">
                                <div onClick={() => props.setViewState("VerMisColmenas")}>
                                  Ver mis Colmenas 
                                </div>
                                <div onClick={() => props.setViewState("CrearNuevaColmenas")}>
                                  Crear Nueva Colmena
                                </div>
                               
                            </div>
                        </li>

                        <li className="dropdown">
                            <button className="dropbtn active">
                                Mis Apiarios
                            </button>
                              <div className="dropdown-content active">
                                <div onClick={() => props.setViewState("VerMisApiarios")}>
                                    Ver todos los Apiarios
                                </div>
                                <div onClick={() => props.setViewState("CrearApiaro")}>
                                    Crear Nuevo Apiario
                                </div>
                            </div>
                            </li>
                         <li className="dropdown">
                            <button className="dropbtn active">
                                Perfil
                            </button>
                             <div className="dropdown-content active">
                                <div onClick={() => props.setViewState("MiPerfil")}>
                                    Mi Perfil
                                </div>
                                <div onClick={() => props.setViewState("ActualizarDatos")}>
                                    Actualizar datos
                                </div>
                            </div>
                            </li>
                    </ul>

                    <div className="nav-user">
                        <div className="user-avatar">CM</div>
                        <div className="user-info">
                            <p className="user-name">Carlos M.</p>
                            <a href="#" className="logout-link" onClick={() =>  closeSesion()}>
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
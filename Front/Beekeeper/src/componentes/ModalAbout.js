import React from 'react';
import './css/ModalAbout.css'; // Importamos el archivo de estilos separados
import logo from '../favicon.ico';
import AboutVersion from './AboutVersion';

const ModalAbout = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Si no está abierto, no renderiza el HTML

    return (
        <div className="about-overlay">
            <div className="about-modal">
                {/* Botón de cerrar */}
                <button className="about-close-btn" onClick={onClose}>✖</button>

                {/* Contenido del Modal */}
                <div className="about-content">
                    <div className="about-logo-container">
                        <img src={logo} alt="Logo Beekeeper" className="about-logo-icon" />
                    </div>
                    <h2 className="about-title">BEEKEEPER</h2>
                    
                    <hr className="about-divider" />

                    <p className="about-description">
                        Sistema de gestión apícola integral diseñado para el registro, control de producción y análisis de activos.
                    </p>

                    <div className="about-credits-box">
                        <p className="about-credits-title">DESARROLLADO POR:</p>
                        <p className="about-team-name">Equipo 1</p>
                        <p className="about-university">
                            Proyecto académico - Ingeniería de Software<br />
                            Ingeniería de Sistemas<br />
                            Universidad de Los Andes (ULA)
                        </p>
                    </div>

                    <p className="about-license">
                        Este software se distribuye de forma gratuita y es exclusivamente para <strong>uso no comercial</strong>.
                    </p>

                    <p className="about-copyright">
                        © {new Date().getFullYear()} Beekeeper. Todos los derechos reservados.
                    </p>
                    
                    <AboutVersion />
                </div>
            </div>
        </div>
    );
};

export default ModalAbout;
import React from 'react';
import Modal from '../componentes/modalMSN.js';
import { useLogin } from './hooks/useLogin.js';
import "./css/login.css";

export default function Login(props) {
    const {
        formData,
        isModalOpen,
        setIsModalOpen,
        modalInfo,
        handleChange,
        aceptarLog
    } = useLogin(props);

    // FUNCIÓN DE LLAVE MAESTRA: Intercepta el login para desarrollo
    const manejarLoginEspecial = (e) => {
        e.preventDefault(); 

        // Si los datos son admin/admin, entramos sin consultar al servidor
        if (formData.identificador === 'admin' && formData.clave === 'admin') {
            props.setUsr({ nombre: "Administrador", id: 1 }); 
            props.setViewState("VerMisColmenas"); 
        } else {
            // Si no es la llave, ejecutamos la lógica normal del hook
            aceptarLog(e); 
        }
    };

    const createView = () => {
        return (
            <div className="login-container">
                <div className="left-panel">
                    <div className="pattern-overlay"></div>
                </div>

                <div className="right-panel">
                    <div className="form-wrapper">
                        <h1 className="main-title">Iniciar Sesión</h1>
                        <p className="sub-title">Accede a tu cuenta de apicultor</p>
                        <br />

                        {/* Cambiamos aceptarLog por manejarLoginEspecial */}
                        <form className="login-form" onSubmit={manejarLoginEspecial}>
                            <div className="input-group">
                                <label htmlFor="identificador">Correo o Acrónimo</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-envelope input-icon"></i>
                                    <input 
                                        type="text" 
                                        name="identificador" 
                                        placeholder="Ej: JMLT o jose@correo.com" 
                                        value={formData.identificador}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="clave">Contraseña</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-lock input-icon"></i>
                                    <input 
                                        type="password" 
                                        name="clave" 
                                        placeholder="********" 
                                        value={formData.clave}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="primary-btn">
                                Entrar <i className="fas fa-arrow-right arrow-icon"></i>
                            </button>
                        </form>

                        <div className="footer-links">
                            <p>¿No tienes cuenta? <a href="#" onClick={() => props.setViewState("CrearUsuario")} className="link-bold">Crear Cuenta</a></p>
                        </div>
                    </div>
                </div>

                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    title={modalInfo.titulo}
                    message={modalInfo.mensaje}
                    type="error"
                />
            </div>
        );
    }

    return (
        <section>
            {createView()}
        </section>
    );
}


import React, { useState } from 'react';
import * as WSUsuario from '../webService/WSusuario.js';
import Modal from '../componentes/modalMSN.js';

import "./css/login.css"

export default function Login(props) {
    // 1. Estados para controlar el formulario y el Modal
    const [formData, setFormData] = useState({
        identificador: '',
        clave: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '' });

    // 2. Manejador de cambios (Sincroniza los inputs con el estado)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 3. Función de Login mejorada
    const aceptarLog = async (e) => {
        if (e) e.preventDefault(); // Evita recarga de página si se usa en un form

        try {
            // Enviamos el identificador (acrónimo/correo) y la clave en Base64
            const respuesta = await WSUsuario.ValidarLogin(formData.identificador, btoa(formData.clave));
            
            if (respuesta && respuesta.status === 1) {
                // ÉXITO: Guardamos el usuario y cambiamos la vista
                debugger;
                props.setUsr(respuesta.usuario);
                props.setViewState('ModificarUsuario'); 
            } else {
                // ERROR DE LOGUEO: Mostramos el error en Modal Neobrutalista
                setModalInfo({
                    titulo: "Acceso Denegado",
                    mensaje: respuesta.mensaje || "Credenciales incorrectas. Intenta de nuevo."
                });
                setIsModalOpen(true);
            }
        } catch (err) {
            setModalInfo({
                titulo: "Error de Conexión",
                mensaje: "No se pudo establecer comunicación con el servidor de Beekeeper."
            });
            setIsModalOpen(true);
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
                        <br></br>

                        <form className="login-form" onSubmit={aceptarLog}>
                            <div className="input-group">
                                <label htmlFor="identificador">Correo o Acrónimo</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-envelope input-icon"></i>
                                    <input 
                                        type="text" // Cambiado a text para permitir Acrónimos
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

                {/* Modal para mostrar errores de validación o conexión */}
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


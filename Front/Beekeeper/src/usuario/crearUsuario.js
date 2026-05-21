import React from 'react';
import Modal from '../componentes/modalMSN.js';
import { useCrearUsuario } from './hooks/useCrearUsuario.js';
import "./css/crearUsuario.css";

export default function CrearUsuario(props) {
    const {
        formData,
        handleChange,
        manejarRegistro,
        isModalOpen,
        setIsModalOpen,
        modalInfo,
        error
    } = useCrearUsuario(props.setViewState);


    // ==========================================
    // EVALUACIÓN REACTIVA DE LA CONTRASEÑA
    // Se recalcula automáticamente cada vez que el usuario teclea
    // ==========================================
    const pwd = formData.clave;
    const hasLength = pwd.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[\W_]/.test(pwd);


    const createView = () => {
        return (
            <div className="crearUsuario-container">
                <div className="left-panel">
                    <div className="overlay-content">
                        <div className="bee-icon">
                            <img src="https://cdn-icons-png.flaticon.com/512/517/517563.png" alt="Logo"/>
                        </div>
                        <h2>Gestiona tu colmena</h2>
                        <p>La herramienta definitiva para el apicultor moderno.</p>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="form-container">
                        <h1>Crear Cuenta</h1>
                        <p className="form-desc">Únete para gestionar tus apiarios fácilmente.</p>
                        
                        <form id="auth-form" onSubmit={manejarRegistro} noValidate>
                            <div className="input-row">
                                <div className="input-group">
                                    <label>Acrónimo</label>
                                    <input type="text" name="acronimo" value={formData.acronimo} onChange={handleChange} placeholder="Ej: JMLT" required minLength="4" maxLength="10" />
                                </div>
                                <div className="input-group">
                                    <label>Localidad</label>
                                    <input type="text" name="localidad_asociada" value={formData.localidad_asociada} onChange={handleChange} placeholder="Ej: Mérida" required />
                                </div>
                            </div>
                            <div className="input-row">
                                <div className="input-group">
                                    <label>Nombres</label>
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                </div>
                                <div className="input-group">
                                    <label>Apellidos</label>
                                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-row">
                                <div className="input-group">
                                    <label>Teléfono</label>
                                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
                                </div>
                                <div className="input-group">
                                    <label>Correo Electrónico</label>
                                    <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                                </div>
                            </div>
                            
                            <div className="input-group">
                                <label>Contraseña</label>
                                <input type="password" name="clave" value={formData.clave} onChange={handleChange} required minLength="8" maxLength="20" />
                                
                                {/* REQUISITOS REACTIVOS */}
                                <div className="password-rules">
                                    <span style={{ color: hasLength ? '#15803d' : '#6b7280' }}>
                                        {hasLength ? '✅' : '❌'} Mínimo 8
                                    </span>
                                    <span style={{ color: hasLetter ? '#15803d' : '#6b7280' }}>
                                        {hasLetter ? '✅' : '❌'} 1 Letra
                                    </span>
                                    <span style={{ color: hasNumber ? '#15803d' : '#6b7280' }}>
                                        {hasNumber ? '✅' : '❌'} 1 Número
                                    </span>
                                    <span style={{ color: hasSpecial ? '#15803d' : '#6b7280' }}>
                                        {hasSpecial ? '✅' : '❌'} 1 Especial
                                    </span>
                                </div>
                            </div>
                            
                            <div className="input-group">
                                <label>Repetir Contraseña</label>
                                <input type="password" name="repetirClave" value={formData.repetirClave} onChange={handleChange} required minLength="8" maxLength="20" />
                            </div>
                            <button type="submit" className="primary-btn">Registrarse</button>
                        </form>
                         <div className="form-footer">
                            <p>¿Ya tienes cuenta? <a href="#" onClick={() => props.setViewState("Login")}>Iniciar Sesión</a></p>
                        </div>
                    </div>
                </div>
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={setIsModalOpen} 
                    goView={props.setViewState} 
                    view={modalInfo.titulo === 'Registro Exitoso' ? "Login" : ""}
                    title={modalInfo.titulo}
                    message={modalInfo.mensaje}
                    type={modalInfo.titulo === 'Registro Exitoso' ? "success" : "error"}
                />
            </div>
        );
    }
    return <section>{createView()}</section>;
}
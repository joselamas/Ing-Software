import React, { useState } from 'react';
import { useModificarUsuario } from './hooks/useModificarUsuario.js';
import Modal from '../componentes/modalMSN.js'; 
import "./css/modificarUsuario.css";

export default function ModificarUsuario({setUsr , usr, setViewState }) {
    const { 
        handleSubmit, 
        loading, 
        error, 
        isModalOpen, 
        setIsModalOpen, 
        modalInfo 
    } = useModificarUsuario(usr, setUsr);


    // Estado local solo para la contraseña visual reactiva
    const [pwd, setPwd] = useState("");
    
    // Evaluaciones Reactivas
    const hasLength = pwd.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[\W_]/.test(pwd);


    return (
        <section>
            <div className="main-container">
                <div className="left-panel">
                    <div className="overlay-content">
                        <div className="bee-icon">
                            <img src="https://cdn-icons-png.flaticon.com/512/517/517563.png" alt="Abeja" />
                        </div>
                        <h2>Actualizar perfil</h2>
                        <p>Actualiza tus datos y sigue gestionando tus colmenas con facilidad.</p>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="form-container edit-profile">
                        <div className="header-inline">
                            <h1>Actualizar <span>Perfil</span></h1>
                        </div>

                        {error && <p className="error-msg" style={{color: 'red'}}>{error}</p>}

                        <form id="edit-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Acrónimo</label>
                                <input type="text" value={usr.acronimo}  disabled />
                            </div>
                            
                            <div className="input-group">
                                <label>Nombres</label>
                                <input type="text" value={usr.nombre}  disabled />
                            </div>

                            <div className="input-group">
                                <label>Apellidos</label>
                                <input type="text" value={usr.apellido}  disabled />
                            </div>

                            <div className="input-group">
                                <label>Teléfono</label>
                                <input 
                                    type="tel" 
                                    name="telefono" 
                                    defaultValue={usr.telefono}                                      
                                />
                            </div>

                            <div className="input-group">
                                <label>Correo Electrónico</label>
                                <input type="email" defaultValue={usr.correo}  disabled />
                            </div>

                            <div className="input-group">
                                <label>Localidad</label>
                                <input 
                                    type="text" 
                                    name="localidad" 
                                    defaultValue={usr.localidad_asociada} 
                                    required 
                                />
                            </div>

                            <div className="input-group">
                                <label>Contraseña</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    placeholder="Dejar en blanco para mantener la actual" 
                                    minLength="8" 
                                    maxLength="20" 
                                />
                                {pwd.length > 0 && (
                                    <div style={{ fontSize: '0.75rem', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ color: hasLength ? '#15803d' : '#6b7280', transition: 'color 0.3s ease' }}>
                                            {hasLength ? '✅' : '❌'} Mínimo 8 caracteres
                                        </span>
                                        <span style={{ color: hasLetter ? '#15803d' : '#6b7280', transition: 'color 0.3s ease' }}>
                                            {hasLetter ? '✅' : '❌'} Al menos 1 letra
                                        </span>
                                        <span style={{ color: hasNumber ? '#15803d' : '#6b7280', transition: 'color 0.3s ease' }}>
                                            {hasNumber ? '✅' : '❌'} Al menos 1 número
                                        </span>
                                        <span style={{ color: hasSpecial ? '#15803d' : '#6b7280', transition: 'color 0.3s ease' }}>
                                            {hasSpecial ? '✅' : '❌'} Al menos 1 carácter especial
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="input-group">
                                <label>Repetir Contraseña</label>
                                <input 
                                    type="password" 
                                    name="repeatPassword" 
                                    placeholder="Confirme su nueva contraseña" 
                                    minLength="8" 
                                    maxLength="20" 
                                />
                            </div>

                            <div className="button-group">
                                <button 
                                    type="button" 
                                    className="secondary-btn" 
                                    onClick={() => setViewState("Home")}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="primary-btn" disabled={loading}>
                                    {loading ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                goView={setViewState} 
                view={modalInfo.tipo === 'success' ? "Home" : ""}
                title={modalInfo.titulo}
                message={modalInfo.mensaje}
                type={modalInfo.tipo}
            />
        </section>
    );
}
import React from 'react';
import { useModificarApiario } from './hooks/useModificarApiario';
import '../usuario/css/modificarUsuario.css'; // Estilos comunes
import './css/modificarApiario.css'; // Estilos específicos
import apitherapy from '../imagenes/apitherapy.png';
import ModalMSN from '../componentes/modalMSN';

const ModificarApiario = ({ apiario, setViewState, usr }) => {
    const { formData, handleChange, manejarEdicion, loading, error, isModalOpen, setIsModalOpen, modalInfo } = useModificarApiario(apiario, setViewState, usr);

    console.log("APIARIO INICIAL:", apiario);
    return (
        <div className="login-container edit-apiario-layout">
            <div className="left-panel">
                <div className="pattern-overlay"></div>
                <div className="overlay-content">
                    <div className="bee-icon">
                    <div className="hex-icon">⬢</div>
                    </div>
                    <h2>Actualizar Apiario</h2>
                    <p>Mantén la información de tus apiarios al día para una mejor gestión.</p>
                </div>
            </div>

            <div className="right-panel form-content-panel"> {/* Añadimos una clase para posibles estilos específicos del panel derecho */}
                <div className="form-wrapper-edit">
                    <div className="header-inline" style={{marginTop:'100px'}}>
                        <h1>EDITAR <span>APIARIO</span></h1>
                    </div>

                <form onSubmit={manejarEdicion}>
                    {/* Campos de Solo Lectura (Identidad y Ubicación) */}
                    <div className="readonly-section">
                        <div className="input-group disabled">
                            <label>Nombre de Referencia</label>
                            <p className="static-info">{apiario.nombre_referencia}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="input-group disabled" style={{ flex: 1 }}>
                                <label>Altitud (MSNM)</label>
                                <p className="static-info">{apiario.msnm} m</p>
                            </div>
                            <div className="input-group disabled" style={{ flex: 1 }}>
                                <label>Coordenadas</label>
                                <p className="static-info">{apiario.coordenadas || apiario.posicion?.join(', ')}</p>
                            </div>
                        </div>
                    </div>

                    <hr className="form-divider" />

                    {/* Campos Editables (Gestión Operativa) */}
                    <div className="input-group">
                        <label htmlFor="tipo_flora">Tipo de Floración Predominante</label>
                        <input 
                            type="text" 
                            id="tipo_flora" 
                            name="tipo_flora" 
                            value={formData.tipo_flora} 
                            onChange={handleChange} 
                            placeholder={apiario.tipo_flora || 'Ej: Eucalipto, Trigo, etc.'}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="capacidad_maxima">Capacidad Máxima (Colmenas)</label>
                        <input 
                            type="number" 
                            id="capacidad_maxima" 
                            name="capacidad_maxima" 
                            value={formData.capacidad_maxima} 
                            onChange={handleChange} 
                            min={0}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="estado">Estado del Apiario</label>
                        <select 
                            id="estado" 
                            name="estado" 
                            value={formData.estado} 
                            onChange={handleChange}
                            required
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                            <option value="En Mantenimiento">En Mantenimiento</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="descripcion_acceso">Descripción de Vialidad / Acceso</label>
                        <textarea 
                            id="descripcion_acceso" 
                            name="descripcion_acceso" 
                            value={formData.descripcion_acceso} 
                            onChange={handleChange} 
                            rows="3"
                            required
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <div className="button-group">
                        <button type="button" className="secondary-btn" onClick={() => setViewState("VerMisApiarios")}>
                            CANCELAR
                        </button>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                        </button>
                    </div>
                </form>
                </div>
            </div>

            {/* Modal de Feedback para el usuario */}
            <ModalMSN 
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                title={modalInfo.titulo}
                message={modalInfo.mensaje}
                type={modalInfo.tipo}
                goView={setViewState}
                view={""}
            />
        </div>
    );
};

export default ModificarApiario;
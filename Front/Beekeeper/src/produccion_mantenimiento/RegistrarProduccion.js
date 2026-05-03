import React from 'react';
import { useRegistrarProduccion } from './hooks/useRegistrarProduccion';
import './css/registrarProduccion.css'; 
import apitherapy from '../imagenes/apitherapy.png';
import ModalMSN from '../componentes/modalMSN';

const RegistrarProduccion = ({ setViewState, usr }) => {
    const { 
        formData, handleChange, submitProduccion, loading, isModalOpen, setIsModalOpen, modalInfo,
        activeTab, setActiveTab, apiarios, todasLasColmenas, searchTermColmena, manejarCambioColmena, colmenasFiltradas, countProductivas, isFormValid
    } = useRegistrarProduccion(usr, setViewState);

    const colmenaSeleccionada = todasLasColmenas.find(item => String(item.colmena.id) === String(formData.colmena_id));

    return (
        <div className="detalle-container detalle-container-margin">
             <div className="detalle-header">
                <button className="back-btn" onClick={() => setViewState('MiPerfil')}>
                    ← Volver
                </button>
                <h1>Producción y <span>Mantenimiento</span></h1>
            </div>

            <div className="detalle-grid">
                <section className="detalle-left-panel">
                    <div className="overlay-content">
                        <div>
                            <img src={apitherapy} alt="Logo" className="bee-logo-small" />
                        </div>
                        <h2>Planificación</h2>
                        <p>Selecciona el apiario o colmena para registrar la cosecha.</p>
                    </div>

                    <div className="detalle-card info-card feeding-selector-card">
                        <div className="input-group">
                            <h3>PRECIOS DE MERCADO</h3>
                            <div className="costs-container costs-container-small">
                                <div className="input-group input-group-compact">
                                    <label className="label-tiny">Miel ($/kg)</label>
                                    <input type="number" step="0.01" name="precio_miel" value={formData.precio_miel} onChange={handleChange} placeholder="0.00" />
                                </div>
                                <div className="input-group input-group-compact">
                                    <label className="label-tiny">Polen ($/kg)</label>
                                    <input type="number" step="0.01" name="precio_polen" value={formData.precio_polen} onChange={handleChange} placeholder="0.00" />
                                </div>
                            </div>
                        </div>
                        <div className="tabs-container">
                            <button className={`tab-btn ${activeTab === 'individual' ? 'active' : ''}`} onClick={() => setActiveTab('individual')}>Individual</button>
                            <button className={`tab-btn ${activeTab === 'bloque' ? 'active' : ''}`} onClick={() => setActiveTab('bloque')}>Por Apiario</button>
                        </div>

                        <div className="tab-content tab-content-spacing">
                            {activeTab === 'individual' ? (
                                <div className="input-group">
                                    <label>Identificador de Colmena</label>
                                    <input type="text" list="hives_list_prod" placeholder="Ej: ME-22..." value={searchTermColmena} onChange={manejarCambioColmena} autoComplete="off" />
                                    <datalist id="hives_list_prod">
                                        {todasLasColmenas.map(c => (
                                            <option key={c.colmena.id} value={c.colmena.id_colmena_usuario}>{c.nombre_apiario || 'Sin apiario'}</option>
                                        ))}
                                    </datalist>

                                    {colmenaSeleccionada && (
                                        <div className="detalle-left-panel matched-hives-preview animate-fade-in">
                                            <label>Detalles de la Colmena</label>
                                            <div className="info-row">
                                                <span className="info-span">Tipo:</span>
                                                <strong className="info-strong">{colmenaSeleccionada.colmena.tipo_colmena}</strong>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-span">Estado Actual:</span>
                                                <strong className="info-strong">{colmenaSeleccionada.colmena.estado}</strong>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-span">Ubicación:</span>
                                                <strong className="info-strong">{colmenaSeleccionada.nombre_apiario || 'Sin asignar'}</strong>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="block-filters">
                                    <div className="input-group">
                                        <label>Apiario</label>
                                        <select name="apiario_id" value={formData.apiario_id} onChange={handleChange}>
                                            <option value="">-- Seleccionar Apiario --</option>
                                            {apiarios.map(a => <option key={a.id} value={a.id}>{a.nombre_referencia}</option>)}
                                        </select>
                                    </div>
                                    {formData.apiario_id && (
                                        <div className="matched-hives-preview animate-fade-in detalle-left-panel">
                                            <label>Colmenas productivas detectadas ({colmenasFiltradas.length})</label>
                                            <div className="hives-tag-container">
                                                {colmenasFiltradas.map(c => <span key={c.colmena.id} className="hive-tag">{c.colmena.id_colmena_usuario}</span>)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sección de especificación de metodología */}
                        <div className="metodo-info-container animate-fade-in metodo-info-divider">
                            
                                <div className="info-box">
                                    <p className="info-box-text">
                                        ℹ️ Seleccionado un apiario, la totalidad de la producción se divide entre las colmenas <strong>PRODUCTIVAS</strong> del momento ({countProductivas} detectadas), manejando los volúmenes de una forma más fácil pero perdiendo el detalle de la información por colmena. Pudiendo determinar cuáles son los apiarios más productivos.
                                    </p>
                                </div>
                         
                                <div className="info-box">
                                    <p className="info-box-text">
                                        ℹ️ Si registramos la producción por colmena, además de saber el total producido por apiario, sabemos en detalle qué colmenas son mejores para <strong>futuras divisiones</strong> y mejora genética.
                                    </p>
                                </div>
                           
                        </div>
                    </div>
                </section>

                <section className="detalle-right-panel">
                    <div className="detalle-card info-card card-white-bg">
                        <h1 className="main-title main-title-spacing">REGISTRAR <span>COSECHA</span></h1>
                        <form onSubmit={submitProduccion} className="login-form">
                        
                            <div className="input-group">
                                <label>Fecha de Cosecha</label>
                                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
                            </div>

                            {/* Producción Obtenida */}
                            <div className="feeding-section">
                                <label>PRODUCCIÓN (Kg)</label>
                                <div className="production-inputs-flex">
                                    <div className="input-group flex-equal">
                                        <label>Miel (Kg)</label>
                                        <input type="number" step="0.1" name="cantidad_miel" value={formData.cantidad_miel} onChange={handleChange} placeholder="0.0" />
                                    </div>
                                    <div className="input-group flex-equal">
                                        <label>Polen (Kg)</label>
                                        <input type="number" step="0.1" name="cantidad_polen" value={formData.cantidad_polen} onChange={handleChange} placeholder="0.0" />
                                    </div>
                                </div>
                            </div>

                            {/* Características y Tipo */}
                            <div className="feeding-section">
                                <div className="input-group checkbox-group checkbox-row-align">
                                    <input 
                                        type="checkbox" 
                                        id="es_monofloral" 
                                        name="es_monofloral" 
                                        checked={formData.es_monofloral} 
                                        onChange={handleChange} 
                                        className="input-width-auto"
                                    />
                                    <label htmlFor="es_monofloral" className="label-no-margin">¿Es cosecha Monofloral?</label>
                                </div>
                                
                                <div className="input-group">
                                    <label>Características Organolépticas</label>
                                    <textarea 
                                        name="caracteristicas" 
                                        value={formData.caracteristicas} 
                                        onChange={handleChange} 
                                        rows="2" 
                                        placeholder="Color, aroma, sabor, humedad..." 
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className={`primary-btn btn-submit-full ${!isFormValid && !loading ? 'btn-waiting' : ''}`} 
                                disabled={loading || !isFormValid}
                            >
                                {loading ? 'GUARDANDO...' : isFormValid ? 'GUARDAR COSECHA' : 'COMPLETA LOS DATOS'}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
            
            <ModalMSN 
                isOpen={isModalOpen} 
                onClose={setIsModalOpen} 
                title={modalInfo.titulo || (modalInfo.tipo === 'success' ? 'Éxito' : 'Error')} 
                message={modalInfo.mensaje || 'Procesando solicitud...'} 
                type={modalInfo.tipo} 
                goView={setViewState} 
                view="" 
            />
        </div>
    );
};

export default RegistrarProduccion;
import React from 'react';
import { useRegistrarProduccion } from './hooks/useRegistrarProduccion';
import '../colmenas/css/alimentarColmena.css'; // Reutilizamos estilos de layout
import '../usuario/css/modificarUsuario.css';
import '../apiarios/css/detalleApiario.css';
import apitherapy from '../imagenes/apitherapy.png';
import ModalMSN from '../componentes/modalMSN';

const RegistrarProduccion = ({ setViewState, usr }) => {
    const { 
        formData, handleChange, submitProduccion, loading, isModalOpen, setIsModalOpen, modalInfo,
        activeTab, setActiveTab, apiarios, todasLasColmenas, searchTermColmena, manejarCambioColmena, colmenasFiltradas 
    } = useRegistrarProduccion(usr, setViewState);

    const itemEnEdicion = todasLasColmenas.find(c => c.colmena.id === formData.colmena_id);
    const colmenaEnEdicion = itemEnEdicion?.colmena;

    const hayColmenasSeleccionadas = activeTab === 'individual' 
        ? !!formData.colmena_id 
        : (!!formData.apiario_id && colmenasFiltradas.length > 0);

    return (
        <div className="detalle-container" style={{marginTop: '80px'}}>
             <div className="detalle-header">
                <button className="back-btn" onClick={() => setViewState('MiPerfil')}>
                    ← Volver
                </button>
                <h1>Producción y <span>Mantenimiento</span></h1>
            </div>

            <div className="detalle-grid">
                <section className="detalle-left-panel">
                    <div className="overlay-content">
                        <div className="bee-icon">
                            <img src={apitherapy} alt="Logo" style={{width: '80px'}} />
                        </div>
                        <h2>Planificación</h2>
                        <p>Selecciona el apiario o colmena para registrar la cosecha.</p>
                    </div>

                    <div className="detalle-card info-card feeding-selector-card">
                        <div className="tabs-container">
                            <button className={`tab-btn ${activeTab === 'individual' ? 'active' : ''}`} onClick={() => setActiveTab('individual')}>Individual</button>
                            <button className={`tab-btn ${activeTab === 'bloque' ? 'active' : ''}`} onClick={() => setActiveTab('bloque')}>Por Apiario</button>
                        </div>

                        <div className="tab-content" style={{marginTop: '20px'}}>
                            {activeTab === 'individual' ? (
                                <div className="input-group">
                                    <label>Identificador de Colmena</label>
                                    <input type="text" list="hives_list_prod" placeholder="Ej: ME-22..." value={searchTermColmena} onChange={manejarCambioColmena} autoComplete="off" />
                                    <datalist id="hives_list_prod">
                                        {todasLasColmenas.map(c => (
                                            <option key={c.colmena.id} value={c.colmena.id_colmena_usuario}>{c.nombre_apiario || 'Sin apiario'}</option>
                                        ))}
                                    </datalist>
                                    {colmenaEnEdicion && (
                                        <div className="matched-hives-preview animate-fade-in">
                                            <label>Detalles:</label>
                                            <div className="info-row"><span>Tipo:</span><strong>{colmenaEnEdicion.tipo_colmena}</strong></div>
                                            <div className="info-row"><span>Estado:</span><strong>{colmenaEnEdicion.estado}</strong></div>
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
                                        <div className="matched-hives-preview animate-fade-in">
                                            <label>Colmenas detectadas ({colmenasFiltradas.length})</label>
                                            <div className="hives-tag-container">
                                                {colmenasFiltradas.map(c => <span key={c.colmena.id} className="hive-tag">{c.colmena.id_colmena_usuario}</span>)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="detalle-right-panel">
                    <div className="detalle-card info-card" style={{background: 'white'}}>
                        <h1 className="main-title" style={{marginBottom: '30px'}}>REGISTRAR <span>COSECHA</span></h1>
                        <form onSubmit={submitProduccion} className="login-form">
                            {/* Bloque de Precios del Mercado */}
                            <div className="input-group">
                                <label>PRECIOS DE MERCADO</label>
                                <div className="costs-container" style={{ marginBottom: '10px' }}>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: '0.65rem' }}>Miel ($/kg)</label>
                                        <input type="number" step="0.01" name="precio_miel" value={formData.precio_miel} onChange={handleChange} placeholder="0.00" />
                                    </div>
                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: '0.65rem' }}>Polen ($/kg)</label>
                                        <input type="number" step="0.01" name="precio_polen" value={formData.precio_polen} onChange={handleChange} placeholder="0.00" />
                                    </div>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Fecha de Cosecha</label>
                                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
                            </div>

                            {/* Producción Obtenida */}
                            <div className="feeding-section">
                                <label>PRODUCCIÓN (Kg)</label>
                                <div style={{display:'flex', gap:'15px', marginTop:'15px'}}>
                                    <div className="input-group" style={{flex:1}}>
                                        <label>Miel (Kg)</label>
                                        <input type="number" step="0.1" name="cantidad_miel" value={formData.cantidad_miel} onChange={handleChange} placeholder="0.0" />
                                    </div>
                                    <div className="input-group" style={{flex:1}}>
                                        <label>Polen (Kg)</label>
                                        <input type="number" step="0.1" name="cantidad_polen" value={formData.cantidad_polen} onChange={handleChange} placeholder="0.0" />
                                    </div>
                                </div>
                            </div>

                            {/* Características y Tipo */}
                            <div className="feeding-section">
                                <div className="input-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                    <input 
                                        type="checkbox" 
                                        id="es_monofloral" 
                                        name="es_monofloral" 
                                        checked={formData.es_monofloral} 
                                        onChange={handleChange} 
                                        style={{ width: 'auto' }}
                                    />
                                    <label htmlFor="es_monofloral" style={{ margin: 0 }}>¿Es cosecha Monofloral?</label>
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

                            <div className="input-group">
                                <label>Notas</label>
                                <textarea name="notas" value={formData.notas} onChange={handleChange} rows="3" placeholder="Detalles de la cosecha..." />
                            </div>
                            <button 
                                type="submit" 
                                className={`primary-btn ${!hayColmenasSeleccionadas && !loading ? 'btn-waiting' : ''}`} 
                                disabled={loading || !hayColmenasSeleccionadas}
                                style={{width: '100%', marginTop: '20px'}}
                            >
                                {loading ? 'GUARDANDO...' : hayColmenasSeleccionadas ? 'GUARDAR COSECHA' : 'SELECCIONA ORIGEN'}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
            
            <ModalMSN isOpen={isModalOpen} onClose={setIsModalOpen} {...modalInfo} goView={setViewState} view="MiPerfil" />
        </div>
    );
};

export default RegistrarProduccion;
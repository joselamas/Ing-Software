import React from 'react';
import { useAlimentarColmena } from './hooks/useAlimentarColmena';
import './css/alimentarColmena.css';
import apitherapy from '../imagenes/apitherapy.png';
import ModalMSN from '../componentes/modalMSN';

const AlimentarColmena = ({ colmena, setViewState, usr }) => {
    const { 
        formData, 
        handleChange, 
        enviarAlimentacion, 
        loading, 
        isModalOpen, 
        setIsModalOpen, 
        modalInfo,
        activeTab,
        setActiveTab,
        apiarios,
        todasLasColmenas,
        searchTermColmena,
        setSearchTermColmena,
        manejarCambioColmena,
        colmenasFiltradas
    } = useAlimentarColmena(colmena, setViewState, usr);

    const colmenaSeleccionada = todasLasColmenas.find(c => String(c.colmena.id) === String(formData.colmena_id));

    const handleHiveFocus = (e) => {
        if (!formData.colmena_id) {
            const input = e.target;
            const currentValue = input.value;
            input.value = '';
            window.setTimeout(() => {
                input.value = currentValue;
            }, 0);
        }
    };

    const handleIndividualTab = () => {
        setActiveTab('individual');
        setSearchTermColmena('');
        handleChange({ target: { name: 'colmena_id', value: '' } });
    };

    // Buscamos el objeto completo de la colmena seleccionada para mostrar detalles (mantener para compatibilidad)
    const itemEnEdicion = todasLasColmenas.find(c => c.colmena.id === Number(formData.colmena_id));
    const colmenaEnEdicion = itemEnEdicion?.colmena;

    // Lógica para habilitar el botón de guardado
    const hayColmenasSeleccionadas = activeTab === 'individual' 
        ? !!formData.colmena_id 
        : (!!formData.apiario_id && colmenasFiltradas.length > 0);

    return (
        <div className="detalle-container">
             <div className="detalle-header">
                <button className="back-btn" onClick={() => setViewState('VerMisColmenas')}>
                    ← Volver
                </button>
                <h1>Gestión de <span>Alimentación</span></h1>
            </div>

            <div className="detalle-grid">
                {/* PANEL IZQUIERDO: SELECCIÓN */}
                <section className="detalle-left-panel">
                    <div className="overlay-content">
                        <div>
                            <img src={apitherapy} alt="Logo" className="logo-image" />
                        </div>
                        <h2>Planificación</h2>
                        <p>Selecciona el objetivo de la alimentación.</p>
                    </div>

                    <div className="detalle-card info-card feeding-selector-card">
                        {/* SECCIÓN DE COSTOS UNITARIOS */}
                        <h3 >Costos</h3>
                        <div className="costs-container">
                            <div className="input-group">
                                <label>Azúcar ($/kg)</label>
                                <input type="number" step="0.01" name="costo_azucar" value={formData.costo_azucar} onChange={handleChange} placeholder="0.00" />
                            </div>
                            <div className="input-group">
                                <label>Polen ($/kg)</label>
                                <input type="number" step="0.01" name="costo_polen" value={formData.costo_polen} onChange={handleChange} placeholder="0.00" />
                            </div>
                            <div className="input-group">
                                <label>Torta ($/kg)</label>
                                <input type="number" step="0.01" name="costo_torta" value={formData.costo_torta} onChange={handleChange} placeholder="0.00" />
                            </div>
                        </div>

                        <div className="tabs-container">
                            <button 
                                className={`tab-btn ${activeTab === 'individual' ? 'active' : ''}`}
                                onClick={handleIndividualTab}
                            >
                                Individual
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'bloque' ? 'active' : ''}`}
                                onClick={() => setActiveTab('bloque')}
                            >
                                Por Bloque
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === 'individual' ? (
                                <div className="input-group">
                                    <h3 htmlFor="colmena_search">Identificador de Colmena</h3>
                                    <input
                                        type="text"
                                        id="colmena_search"
                                        name="colmena_id"
                                        list="hives_list_prod"
                                        value={searchTermColmena}
                                        onChange={manejarCambioColmena}
                                        onFocus={handleHiveFocus}
                                        onClick={handleHiveFocus}
                                        placeholder="Ej: COL-001 o ME-22..."
                                        autoComplete="off"
                                    />
                                    <datalist id="hives_list_prod">
                                        {todasLasColmenas.map(hive => (
                                            <option
                                                key={hive.colmena.id}
                                                value={hive.colmena.id_colmena_usuario}
                                            >
                                                {hive.nombre_apiario ? hive.nombre_apiario : 'Sin apiario'}
                                            </option>
                                        ))}
                                    </datalist>

                                    {/* Sección de detalles de la colmena seleccionada individualmente */}
                                    {colmenaSeleccionada && (
                                        <div className="matched-hives-preview animate-fade-in detalle-left-panel">
                                            <label className="hive-details-label">Detalles de la Colmena:</label>
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
                                        <label>Apiario Destino</label>
                                        <select name="apiario_id" value={formData.apiario_id} onChange={handleChange}>
                                            <option value="">-- Seleccionar Apiario --</option>
                                            {apiarios.map(a => (
                                                <option key={a.id} value={a.id}>{a.nombre_referencia}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Filtrar por Tipo</label>
                                        <select name="filtro_tipo" value={formData.filtro_tipo} onChange={handleChange} disabled={!formData.apiario_id}>
                                            <option value="">Todos los tipos</option>
                                            <option value="Langstroth">Langstroth</option>
                                            <option value="Dadant">Dadant</option>
                                            <option value="Nucleo">Núcleo</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Filtrar por Estado</label>
                                        <select name="filtro_estado" value={formData.filtro_estado} onChange={handleChange} disabled={!formData.apiario_id}>
                                            <option value="">Todos los estados</option>
                                            <option value="Nucleo">Núcleo</option>
                                            <option value="Crecimiento">Crecimiento</option>
                                            <option value="Mantenimiento">Mantenimiento</option>
                                            <option value="Produccion">Producción</option>
                                        </select>
                                    </div>

                                    {formData.apiario_id && (
                                        <div className="matched-hives-preview animate-fade-in">
                                            <label>Colmenas detectadas ({colmenasFiltradas.length}):</label>
                                            <div className="hives-tag-container">
                                                {colmenasFiltradas.length > 0 ? (
                                                    colmenasFiltradas.map(c => (
                                                        <span key={c.colmena.id} className="hive-tag">
                                                            {c.colmena.id_colmena_usuario}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="no-hives-found">No se encontraron colmenas con estos filtros.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* PANEL DERECHO: FORMULARIO DE ALIMENTOS */}
                <section className="detalle-right-panel">
                    <div className="detalle-card info-card">
                        <h1 className="main-title">REGISTRAR <span>ALIMENTOS</span></h1>

                        <form onSubmit={enviarAlimentacion} className="login-form">
                            <div className="input-group">
                                <label>Fecha de Aplicación</label>
                                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
                            </div>

                            <div className="feeding-section">
                                <div className="feeding-header">
                                    <label>Jarabe de Azúcar</label>
                                    <button 
                                        type="button" 
                                        className={`toggle-btn ${formData.jarabe_activo ? 'active' : 'inactive'}`}
                                        onClick={() => handleChange({ target: { name: 'jarabe_activo', type: 'checkbox', checked: !formData.jarabe_activo } })}
                                    >
                                        {formData.jarabe_activo ? 'Desactivar' : 'Activar'}
                                    </button>
                                </div>
                                <div className={`form-collapse-container ${formData.jarabe_activo ? 'expanded' : 'collapsed'}`}>
                                    <div className="form-collapse-content">
                                        <div className="row-inputs">
                                            <input type="number" step="0.1" name="jarabe_cantidad" placeholder="Litros" value={formData.jarabe_cantidad || ''} onChange={handleChange} required={formData.jarabe_activo} />
                                            <select name="jarabe_concentracion" value={formData.jarabe_concentracion || '1:1'} onChange={handleChange}>
                                                <option value="1:1">1:1</option>
                                                <option value="2:1">2:1</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="feeding-section">
                                <div className="feeding-header">
                                    <label>Torta Proteica</label>
                                    <button 
                                        type="button" 
                                        className={`toggle-btn ${formData.torta_activo ? 'active' : 'inactive'}`}
                                        onClick={() => handleChange({ target: { name: 'torta_activo', type: 'checkbox', checked: !formData.torta_activo } })}
                                    >
                                        {formData.torta_activo ? 'Desactivar' : 'Activar'}
                                    </button>
                                </div>
                                <div className={`form-collapse-container ${formData.torta_activo ? 'expanded' : 'collapsed'}`}>
                                    <div className="form-collapse-content">
                                        <div className="input-group form-collapse-input-group">
                                            <label>Cantidad en Gramos</label>
                                            <input 
                                                type="number" 
                                                name="torta_cantidad" 
                                                placeholder="Ej: 200" 
                                                value={formData.torta_cantidad} 
                                                onChange={handleChange} 
                                                required={formData.torta_activo} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="feeding-section">
                                <div className="feeding-header">
                                    <label>Suplemento de Polen</label>
                                    <button 
                                        type="button" 
                                        className={`toggle-btn ${formData.polen_activo ? 'active' : 'inactive'}`}
                                        onClick={() => handleChange({ target: { name: 'polen_activo', type: 'checkbox', checked: !formData.polen_activo } })}
                                    >
                                        {formData.polen_activo ? 'Desactivar' : 'Activar'}
                                    </button>
                                </div>
                                <div className={`form-collapse-container ${formData.polen_activo ? 'expanded' : 'collapsed'}`}>
                                    <div className="form-collapse-content">
                                        <div className="input-group form-collapse-input-group">
                                            <label>Cantidad en Gramos</label>
                                            <input 
                                                type="number" 
                                                name="polen_cantidad" 
                                                placeholder="Ej: 100" 
                                                value={formData.polen_cantidad} 
                                                onChange={handleChange} 
                                                required={formData.polen_activo} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Notas</label>
                                <textarea name="notas" value={formData.notas} onChange={handleChange} rows="3" />
                            </div>

                            <button 
                                type="submit" 
                                className={`primary-btn ${!hayColmenasSeleccionadas && !loading ? 'btn-waiting' : ''}`} 
                                disabled={loading || !hayColmenasSeleccionadas} 
                            >
                                {loading ? 'GUARDANDO...' : hayColmenasSeleccionadas ? 'GUARDAR REGISTRO' : 'SELECCIONA COLMENAS'}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
            
            <ModalMSN 
            isOpen={isModalOpen} 
            onClose={setIsModalOpen}
            title={modalInfo.titulo}
            message={modalInfo.mensaje}
            type={modalInfo.tipo}
            goView={setViewState} 
            view="" />
        </div>
    );
};

export default AlimentarColmena;
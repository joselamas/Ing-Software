import React from 'react';
import { useModificarColmena } from './hooks/useModificarColmena';
import './css/registrarColmena.css'; // Reutilizamos layout de paneles
import '../usuario/css/modificarUsuario.css'; // Estilos de componentes de formulario
import apitherapy from '../imagenes/apitherapy.png';
import ModalMSN from '../componentes/modalMSN';

const ModificarColmena = ({ colmena, setViewState, usr, selectedApiarioID }) => {
    const { formData, apiarios, colmenasMadreDisponibles, searchTermMadre, manejarCambioMadre, handleChange, manejarEdicion, loading, isModalOpen, setIsModalOpen, modalInfo } = useModificarColmena(colmena, setViewState, usr, selectedApiarioID);

    return (
        <div className="login-container">
            <div className="left-panel">
                <div className="pattern-overlay"></div>
                <div className="overlay-content">
                    <div>
                        <img src={apitherapy} alt="Logo" className="panel-img" />
                    </div>
                    <h2>Actualizar Colmena</h2>
                    <p>Gestiona el estado y la trazabilidad de tus colmenas activas.</p>
                </div>
            </div>

            <div className="right-panel">
                <div className="form-wrapper" style={{ marginTop: '150px' }}>
                    <div className="header-inline">
                        <h1 className="main-title">EDITAR <span>COLMENA</span></h1>
                    </div>

                    <form onSubmit={manejarEdicion} className="login-form">
                        <div className="input-group">
                            <label>Identificador / Marca Propia</label>
                            <input
                                type="text"
                                name="id_colmena_usuario"
                                value={formData.id_colmena_usuario}
                                onChange={handleChange}
                                disabled
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Tipo de Colmena</label>
                            <select name="tipo_colmena" value={formData.tipo_colmena} onChange={handleChange} required>
                                <option value="Langstroth">Langstroth</option>
                                <option value="Dadant">Dadant</option>
                                <option value="Keniana">Keniana</option>
                                <option value="Layens">Layens</option>
                                <option value="Nucleo">Núcleo</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Estado Actual</label>
                            <select name="estado" value={formData.estado} onChange={handleChange} required>
                                <option value="Nucleo">Núcleo</option>
                                <option value="Crecimiento">Crecimiento</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Produccion">Producción</option>
                                <option value="Vencimiento">Vencimiento</option>
                            </select>
                        </div>

                        <div className="input-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="es_enjambre"
                                name="es_enjambre"
                                checked={formData.es_enjambre}
                                onChange={handleChange}
                                style={{ width: 'auto' }}
                                defaultChecked={false}
                            />
                            <label htmlFor="es_enjambre" style={{ margin: 0 }}>¿No es una sustitucion de Reina?</label>
                        </div>

                        {!formData.es_enjambre && (
                            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                <div className="input-group">
                                    <label htmlFor="id_colmena_madre">Colmena Madre (Marca o Identificador)</label>
                                    <input
                                        type="text"
                                        id="id_colmena_madre"
                                        name="id_colmena_madre"
                                        list="colmenas_madre_list"
                                        placeholder="Escribe para buscar (ej: ME-22)..."
                                        value={searchTermMadre}
                                        onChange={manejarCambioMadre}
                                        required
                                    />
                                    <datalist id="colmenas_madre_list">
                                        {colmenasMadreDisponibles.map(col => (
                                            <option key={col.id} value={col.id_colmena_usuario} />
                                        ))}
                                    </datalist>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label>Inicio Reina</label>
                                        <input
                                            type="date"
                                            name="fecha_inicio_reina"
                                            value={formData.fecha_inicio_reina}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <hr className="form-divider" />
                        <h3 className="section-title-small">Traslado / Cambio de Apiario</h3>
                        <div className="input-group">
                            <label htmlFor="apiario_id">Ubicación Actual (Apiario)</label>
                            <select
                                id="apiario_id"
                                name="apiario_id"
                                value={formData.apiario_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Seleccione un apiario destino</option>
                                {apiarios.map((api) => (
                                    <option key={api.id} value={api.id}>
                                        {api.nombre_referencia.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="button-group">
                            <button type="button" className="secondary-btn" onClick={() => setViewState("VerMisColmenas")}>
                                CANCELAR
                            </button>
                            <button type="submit" className="primary-btn" disabled={loading}>
                                {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ModalMSN 
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                title={modalInfo.titulo}
                message={modalInfo.mensaje}
                type={modalInfo.tipo}
                goView={setViewState}
                view="VerMisColmenas"
            />
        </div>
    );
};

export default ModificarColmena;
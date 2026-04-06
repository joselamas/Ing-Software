import React from 'react';
import { useRegistrarColmena } from './hooks/useRegistrarColmena';
import './css/registrarColmena.css';
import apitherapy from '../imagenes/apitherapy.png';
// URL de imagen externa para evitar errores de carga local
const imagenColmena = apitherapy;

const RegistrarColmena = (props) => {
    const { colmena, apiarios, manejarCambio, registrar, cargando, error } = useRegistrarColmena(props.usr);

    return (
        <div className="main-container">
            <div className="left-panel">
                <div className="pattern-overlay"></div>
                <div className="overlay-content">
                    <div className="colmena-icon">
                        <img src={imagenColmena} alt="Logo" className="panel-img" />
                    </div>
                    <h2>Nuestras Colmenas</h2>
                    <p>El corazón del apiario reside en la fuerza y salud de sus colmenas.</p>
                </div>
            </div>

            <div className="right-panel">
                <div className="form-wrapper">
                    <div className="header-inline">
                        <h1 className="main-title">REGISTRAR <span>COLMENA</span></h1>
                    </div>

                    <form onSubmit={registrar} className="login-form">
                        <div className="input-group">
                            <label htmlFor="tipo_colmena">Tipo de Colmena</label>
                            <select
                                id="tipo_colmena"
                                name="tipo_colmena"
                                value={colmena.tipo_colmena}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="" disabled>Seleccione un tipo</option>
                                <option value="Langstroth">Langstroth</option>
                                <option value="Dadant">Dadant</option>
                                <option value="Keniana">Keniana</option>
                                <option value="Layens">Layens</option>
                                <option value="Nucleo">Núcleo</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="fecha_inicio">Fecha de Instalación</label>
                            <input
                                type="date"
                                id="fecha_inicio"
                                name="fecha_inicio"
                                value={colmena.fecha_inicio}
                                onChange={manejarCambio}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="apiario_id">Asignar a Apiario</label>
                            <select
                                id="apiario_id"
                                name="apiario_id"
                                value={colmena.apiario_id}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="" disabled>Seleccione un apiario</option>
                                {apiarios.map((apiario) => (
                                    <option key={apiario.id} value={apiario.id}>
                                        ID: {apiario.id} - {apiario.nombre_referencia} 
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="es_enjambre"
                                name="es_enjambre"
                                checked={colmena.es_enjambre}
                                onChange={manejarCambio}
                                style={{ width: 'auto' }}
                            />
                            <label htmlFor="es_enjambre" style={{ margin: 0 }}>¿Es un enjambre?</label>
                        </div>

                        {!colmena.es_enjambre && (
                            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label htmlFor="id_colmena_madre">ID Colmena Madre</label>
                                        <input
                                            type="number"
                                            id="id_colmena_madre"
                                            name="id_colmena_madre"
                                            placeholder="Ej. 12"
                                            value={colmena.id_colmena_madre}
                                            onChange={manejarCambio}
                                            required
                                        />
                                    </div>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label htmlFor="fecha_inicio_reina">Inicio Reina</label>
                                        <input
                                            type="date"
                                            id="fecha_inicio_reina"
                                            name="fecha_inicio_reina"
                                            value={colmena.fecha_inicio_reina}
                                            onChange={manejarCambio}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && <p style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>{error}</p>}

                        <div className="button-group">
                            <button type="button" className="secondary-btn" onClick={() => window.history.back()}>
                                CANCELAR
                            </button>
                            <button type="submit" className="primary-btn" disabled={cargando}>
                                {cargando ? 'REGISTRANDO...' : 'GUARDAR COLMENA'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrarColmena;
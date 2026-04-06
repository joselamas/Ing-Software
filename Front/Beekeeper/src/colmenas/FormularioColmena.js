import React from 'react';
import Button from '../componentes/Button';
import { useFormularioColmena } from './hooks/useFormularioColmena';
import './css/formularioColmena.css';

const FormularioColmena = ({ setViewState, usr }) => {
    const { estados, setters, handleSubmit } = useFormularioColmena(usr);

    return (
        <div className="apiario-main-container"> 
            {/* Panel Izquierdo: Color Miel Vibrante con Panal */}
            <div className="apiario-side-info">
                <div className="info-content">
                    <div className="hex-icon-large">⬢</div>
                    <h1>NUEVA COLMENA</h1>
                    <p>Gestiona el inventario biológico de tus apiarios.</p>
                    <Button onClick={() => setViewState('VerMisColmenas')} className="btn-outline-white">
                        VER MIS COLMENAS
                    </Button>
                </div>
            </div>

            {/* Panel Derecho: Formulario de Registro */}
            <div className="apiario-side-form">
                <div className="form-wrapper-pro">
                    <div className="form-header-minimalist">
                        <h3>Registro de Activo</h3>
                        <p>Complete los datos para la nueva colmena</p>
                    </div>

                    {estados.mensaje.texto && (
                        <div className={`alert-box ${estados.mensaje.tipo}`}>
                            {estados.mensaje.texto}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="beekeeping-form-pro">
                        <div className="input-group-pro">
                            <label>UBICACIÓN (APIARIO)</label>
                            <select value={estados.apiarioId} onChange={(e) => setters.setApiarioId(e.target.value)} required>
                                <option value="">-- Selecciona un Apiario --</option>
                                {estados.apiarios.map(apiario => (
                                    <option key={apiario.id} value={apiario.id}>{apiario.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group-pro">
                            <label>FECHA DE INGRESO</label>
                            <input type="date" value={estados.fechaInicio} onChange={(e) => setters.setFechaInicio(e.target.value)} required />
                        </div>

                        <div className="input-group-pro">
                            <label>ORIGEN BIOLÓGICO</label>
                            <div className="radio-cards-container">
                                <label className={`radio-card-item ${estados.esEnjambre ? 'active' : ''}`}>
                                    <input type="radio" checked={estados.esEnjambre} onChange={() => setters.setEsEnjambre(true)} />
                                    <span>Enjambre</span>
                                </label>
                                <label className={`radio-card-item ${!estados.esEnjambre ? 'active' : ''}`}>
                                    <input type="radio" checked={!estados.esEnjambre} onChange={() => setters.setEsEnjambre(false)} />
                                    <span>División</span>
                                </label>
                            </div>
                        </div>

                        {!estados.esEnjambre && (
                            <div className="input-group-pro highlight-input">
                                <label>ID DE LA COLMENA MADRE</label>
                                <input 
                                    type="number" 
                                    placeholder="Ej. 15"
                                    value={estados.idColmenaMadre} 
                                    onChange={(e) => setters.setIdColmenaMadre(e.target.value)} 
                                    required={!estados.esEnjambre}
                                />
                                <small>Asegura la trazabilidad indicando la colmena de procedencia.</small>
                            </div>
                        )}

                        <button type="submit" className="btn-confirm-yellow" disabled={estados.cargando}>
                            {estados.cargando ? 'REGISTRANDO...' : 'REGISTRAR COLMENA'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormularioColmena;
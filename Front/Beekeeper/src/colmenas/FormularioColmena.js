import React from 'react';
import Button from '../componentes/Button';
import { useFormularioColmena } from './hooks/useFormularioColmena'; 
import './css/dashboard.css';            
import './css/formularioColmena.css';    

const FormularioColmena = ({ setViewState, usr }) => {
    const { estados, setters, handleSubmit } = useFormularioColmena(usr);

    return (
        <div className="contenedor main-container">
            <header className="header">
                <h2>Registrar Nueva Colmena</h2>
                <Button onClick={() => setViewState('VerMisColmenas')} className="btnVolver">
                    Ver colmenas
                </Button>
            </header>

            {/* Reutilizamos las clases globales de mensaje/error de layout.css */}
            {estados.mensaje.texto && (
                <div className={estados.mensaje.tipo === 'error' ? 'error' : 'mensaje'}>
                    {estados.mensaje.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} className="formulario-oscuro">
                
                <div className="form-group">
                    <label>Ubicación (Apiario Destino): </label>
                    <select value={estados.apiarioId} onChange={(e) => setters.setApiarioId(e.target.value)} required>
                        <option value="">-- Selecciona un Apiario --</option>
                        {estados.apiarios.map(apiario => (
                            <option key={apiario.id} value={apiario.id}>
                                {apiario.nombre} (ID: {apiario.id})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Fecha de Ingreso: </label>
                    <input type="date" value={estados.fechaInicio} onChange={(e) => setters.setFechaInicio(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Origen del Activo Biológico:</label>
                    <div className="radio-group">
                        <label>
                            <input type="radio" checked={estados.esEnjambre} onChange={() => setters.setEsEnjambre(true)} />
                            Enjambre Silvestre (Captura)
                        </label>
                        <label>
                            <input type="radio" checked={!estados.esEnjambre} onChange={() => setters.setEsEnjambre(false)} />
                            División Controlada
                        </label>
                    </div>
                </div>

                {!estados.esEnjambre && (
                    <div className="panel-trazabilidad">
                        <label>ID de la Colmena Madre: </label>
                        <input 
                            type="number" 
                            min="1"
                            placeholder="Ej. 15" 
                            value={estados.idColmenaMadre} 
                            onChange={(e) => setters.setIdColmenaMadre(e.target.value)} 
                            required={!estados.esEnjambre}
                        />
                        <small>Asegura la trazabilidad de procedencia indicando de qué colmena se originó esta división.</small>
                    </div>
                )}

                <button type="submit" disabled={estados.cargandoEnvio} className="btn-submit">
                    {estados.cargandoEnvio ? 'Guardando en Base de Datos...' : 'Registrar Colmena'}
                </button>
            </form>
        </div>
    );
};

export default FormularioColmena;
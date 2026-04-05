import React from 'react';
import './css/tarjetaColmena.css';

const TarjetaColmena = ({ colmena, onDesactivar }) => 
{
    return (
        <div className="tarjeta">
            <div className='tarjeta-header'>
                <h3>Colmena #{colmena.id}</h3>
                <button 
                    onClick={() => onDesactivar(colmena.id)}
                    className="btn-desactivar"
                    title={`Dar de baja a la colmena ${colmena.id}`} 
                >
                    ×
                </button>
            </div>
            <p><strong>Responsable:</strong> {colmena.usuario_acronimo}</p>
            <p><strong>Origen:</strong> {colmena.es_enjambre ? 'Enjambre Silvestre' : 'División Controlada'}</p>
            {!colmena.es_enjambre && colmena.id_colmena_madre && (
                <p><strong>Colmena Madre:</strong> #{colmena.id_colmena_madre}</p>
            )}
            <p><strong>Fecha de Inicio:</strong> {new Date(colmena.fecha_inicio).toLocaleDateString()}</p>
            <span className="badge">Apiario {colmena.apiario_id}</span>
        </div>
    );
};

export default TarjetaColmena;
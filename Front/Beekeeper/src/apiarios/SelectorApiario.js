import React from 'react';
import { useSelectorApiario } from '../hooks/useSelectorApiario';
import './css/selectorApiario.css';

const SelectorApiario = ({ apiarioSeleccionado, onSeleccion, usr }) => {
    // Consumimos el Custom Hook
    const { apiarios, cargando } = useSelectorApiario(usr);

    return (
        <div className="contenedor">
            <label><strong>Filtrar por Ubicación: </strong></label>
            <select 
                value={apiarioSeleccionado} 
                onChange={(e) => onSeleccion(e.target.value)}
                className="selector"
                disabled={cargando}
            >
                <option value="">{cargando ? 'Cargando apiarios...' : 'Todos los Apiarios'}</option>
                {apiarios.map(apiario => (
                    <option key={apiario.id} value={apiario.id}>
                        {apiario.nombre} (ID: {apiario.id})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectorApiario;
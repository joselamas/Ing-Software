import React from 'react';
import TarjetaColmena from './TarjetaColmena';
import './css/gridColmenas.css';
const GridColmenas = ({ colmenas, onDesactivar }) => 
{
    // Si el arreglo viene vacío (por el filtro o porque no hay datos), mostramos un mensaje
    if (colmenas.length === 0) 
    {
        return <p className="mensajeVacio">No hay colmenas registradas en esta ubicación.</p>;
    }

    return (
        <div className="grid">
            {colmenas.map(colmena => (
                <TarjetaColmena 
                key={colmena.id} 
                colmena={colmena} 
                onDesactivar={onDesactivar}
                />
            ))}
        </div>
    );
};

export default GridColmenas;
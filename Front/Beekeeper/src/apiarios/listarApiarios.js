import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useListarApiarios } from './hooks/useListarApiarios.js';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './css/listarApiarios.css';

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ListarApiarios = () => {
    const { apiarios, loading } = useListarApiarios();
    const [filtro, setFiltro] = useState('');

    // Corrección clave: Verificamos que apiarios sea un array antes de usar .filter
    const apiariosFiltrados = useMemo(() => {
        if (!Array.isArray(apiarios)) return []; 
        return apiarios.filter(a => 
            a.nombre_referencia?.toLowerCase().includes(filtro.toLowerCase())
        );
    }, [apiarios, filtro]);

    if (loading) return <div className="loading">Cargando apiarios...</div>;

    return (
        <div className="gestion-container">
            <div className="main-content-layout">
                <div className="list-side-panel">
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="Buscar apiario por nombre..." 
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>

                    <div className="cards-panel">
                        {apiariosFiltrados.length > 0 ? (
                            apiariosFiltrados.map((apiario) => (
                                <div className="apiario-card-mini" key={apiario.id}>
                                    <div className="info-apiario">
                                        <strong>{apiario.nombre_referencia}</strong>
                                        <p style={{ fontSize: '0.85rem', margin: 0 }}>
                                            Altitud: {apiario.msnm} | Cap: {apiario.capacidad_maxima}
                                        </p>
                                    </div>
                                    <div className="apiario-mini-actions">
                                        <button className="view-btn-eye">👁️</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron apiarios.</p>
                        )}
                    </div>
                </div>

                <div className="map-side-panel">
                    <MapContainer center={[8.58, -71.14]} zoom={12} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {apiariosFiltrados.map((apiario) => {
                            const coords = apiario.coordenadas?.split(',').map(Number);
                            return coords ? (
                                <Marker key={apiario.id} position={coords}>
                                    <Popup>{apiario.nombre_referencia}</Popup>
                                </Marker>
                            ) : null;
                        })}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default ListarApiarios;
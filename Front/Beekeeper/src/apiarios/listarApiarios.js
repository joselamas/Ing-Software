import React from 'react';
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

export default function ListarApiarios({ usr, setViewState }) {
    const { apiarios, loading, error } = useListarApiarios(usr, setViewState);
    const centroDefecto = [8.5891, -71.1450]; // Mérida

    if (loading) return <div className="loading-apiarios">Consultando base de datos apícola...</div>;

    return (
        <div className="gestion-container">
            <header className="list-header">
                <h1>Mis <span>Apiarios</span></h1>
                <div className="actions">
                    <button className="add-btn" onClick={() => setViewState("CrearApiario")}>
                        + Nuevo Apiario
                    </button>
                </div>
            </header>

            {error && <div className="error-banner">{error}</div>}

            <div className="main-content-layout">
                {/* LISTADO TÉCNICO */}
                <div className="cards-panel">
                    {apiarios.length > 0 ? (
                        apiarios.map((apiario) => (
                            <div key={apiario.id} className="apiario-card-mini">
                                <div className="card-info">
                                    <h3>{apiario.nombre_referencia}</h3>
                                    <p><span>Altitud:</span> {apiario.msnm} MSNM</p>
                                </div>
                                <button 
                                    onClick={() => setViewState("DetalleApiario")} 
                                    className="view-btn-icon"
                                >
                                    👁️
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No hay apiarios registrados para este usuario.</div>
                    )}
                </div>

                {/* MAPA DE UBICACIONES */}
                <div className="map-side-panel">
                    <MapContainer center={centroDefecto} zoom={11} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap'
                        />
                        {apiarios.map(apiario => (
                            <Marker key={apiario.id} position={apiario.posicion}>
                                <Popup>
                                    <strong>{apiario.nombre_referencia}</strong><br/>
                                    {apiario.msnm} MSNM
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
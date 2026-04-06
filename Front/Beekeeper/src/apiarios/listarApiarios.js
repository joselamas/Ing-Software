import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
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

export default function ListarApiarios({ usr, setViewState, setSelectedApiario }) {
    const { apiarios, loading, error } = useListarApiarios(usr, setViewState);
    const [searchTerm, setSearchTerm] = useState('');
    const centroDefecto = [8.5891, -71.1450]; // Mérida

    const apiariosFiltrados = useMemo(() => {
        const filter = searchTerm.trim().toLowerCase();
        return filter.length === 0
            ? apiarios
            : apiarios.filter(apiario => apiario.nombre_referencia?.toLowerCase().includes(filter));
    }, [apiarios, searchTerm]);

    if (loading) return <div className="loading-apiarios">Consultando base de datos apícola...</div>;

    return (
        <div className="gestion-container">
            <header className="perfil-header list-header">
                <div>
                <h1>Mis <span>Apiarios</span></h1>
                </div>
                <button className="perfil-btn" onClick={() => setViewState('CrearApiaro')}>
                        + Nuevo Apiario
                </button>
            </header>


            {error && <div className="error-banner">{error}</div>}

            <div className="main-content-layout">
              <section className="list-side-panel">
                 <div className="search-bar">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar apiario por nombre..."
                            aria-label="Buscar apiario"
                        />
                    </div>
                {/* LISTADO TÉCNICO */}
                <div className="cards-panel">
                    {apiariosFiltrados.length > 0 ? (
                        apiariosFiltrados.map((apiario) => (
                            <div key={apiario.id} className="apiario-card-mini">
                                <div className="card-info">
                                    <h3>{apiario.nombre_referencia}</h3>
                                    <p><span>Altitud:</span> {apiario.msnm} MSNM</p>
                                    <p><span>Colmenas:</span> 0</p>
                                    <p><span>Capacidad:</span> {apiario.capacidad_maxima ?? 'Pendiente'} colmenas</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setSelectedApiario(apiario);
                                        setViewState("DetalleApiario");
                                    }} 
                                    className="view-btn-icon"
                                >
                                    👁️
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">
                            {searchTerm.trim().length > 0
                                ? 'No se encontró ningún apiario con ese nombre.'
                                : 'No hay apiarios registrados para este usuario.'}
                        </div>
                    )}
                </div>
                </section>
                {/* MAPA DE UBICACIONES */}
                <div className="map-side-panel">
                    <MapContainer center={centroDefecto} zoom={11} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap'
                        />
                        {apiarios.map(apiario => {
                            const tienePosicionValida = Array.isArray(apiario.posicion)
                                && apiario.posicion.length === 2
                                && Number.isFinite(apiario.posicion[0])
                                && Number.isFinite(apiario.posicion[1]);

                            return tienePosicionValida ? (
                                <React.Fragment key={apiario.id}>
                                    <Circle
                                        center={apiario.posicion}
                                        pathOptions={{ color: '#3399ff', fillColor: '#3399ff', fillOpacity: 0.1 }}
                                        radius={1000}
                                    />
                                    <Circle
                                        center={apiario.posicion}
                                        pathOptions={{ color: '#66cc66', fillColor: '#66cc66', fillOpacity: 0.08 }}
                                        radius={2000}
                                    />
                                    <Circle
                                        center={apiario.posicion}
                                        pathOptions={{ color: '#ffcc00', fillColor: '#ffcc00', fillOpacity: 0.06 }}
                                        radius={3000}
                                    />
                                    <Marker position={apiario.posicion}>
                                        <Popup>
                                            <strong>{apiario.nombre_referencia}</strong><br/>
                                            {apiario.msnm} MSNM
                                        </Popup>
                                    </Marker>
                                </React.Fragment>
                            ) : null;
                        })}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
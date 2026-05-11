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

// Función para generar un icono de color dinámico según la capacidad
const getApiaryIcon = (apiario) => {
    const total = apiario.colmenas?.length || 0;
    const capacidad = apiario.capacidad_maxima || 0;
    // Si capacidad es 0 y hay colmenas, es 100% (verde oscuro). Si no hay nada, es 0 (negro).
    const porcentaje = capacidad > 0 ? (total / capacidad) * 100 : (total > 0 ? 100 : 0);

    let color = '#000000'; // Negro por defecto (0 colmenas)

    if (total > 0) {
        if (porcentaje <= 10) color = '#ff0000'; // Crítico
        else if (porcentaje <= 45) color = '#ff8000'; // Bajo
        else if (porcentaje <= 75) color = '#fbd269'; // Medio
        else if (porcentaje <= 95) color = '#00ff0d'; // Óptimo
        else color = '#00ddff'; // Verde Oscuro (100% o más)
    }

    const svgHtml = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="34px" height="34px">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>`;

    return L.divIcon({
        html: svgHtml,
        className: 'custom-apiary-marker',
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32]
    });
};

export default function ListarApiarios({ usr, setViewState, setSelectedApiario }) {
    const { apiarios, loading, error, filters, handleFilterChange, limpiarFiltros } = useListarApiarios(usr, setViewState);
    const [showFilters, setShowFilters] = useState(false);
    const centroDefecto = [8.5891, -71.1450]; // Mérida

    if (loading) return <div className="loading-apiarios">Consultando base de datos apícola...</div>;

    const toggleFilters = () => setShowFilters(!showFilters);

    return (
        <div className="gestion-container">
            <header className="perfil-header list-header">
                <div>
                  <h1>Mis <span>Apiarios</span></h1>
                  <p>Mostramos la Geolocalización de tus apiarios, para facilitar el manejo</p>

                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className={`filter-toggle-btn ${showFilters ? 'active' : ''}`} onClick={toggleFilters}>
                        {showFilters ? '✖ Cerrar Filtros' : '🔍 Filtros'}
                    </button>
                    <button className="perfil-btn" onClick={() => setViewState('CrearApiaro')}>
                            + Nuevo Apiario
                    </button>
                </div>
            </header>

            {/* SECCIÓN DE FILTROS DESPLEGABLE */}
            {showFilters && (
                <section className="filters-area">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>Nombre</label>
                            <input type="text" name="nombre" value={filters.nombre} onChange={handleFilterChange} placeholder="Buscar por nombre..." />
                        </div>
                        <div className="filter-group">
                            <label>Capacidad Mín.</label>
                            <input type="number" name="capacidadMin" value={filters.capacidadMin} onChange={handleFilterChange} placeholder="Ej: 10" />
                        </div>
                        <div className="filter-group">
                            <label>Altitud Máx.</label>
                            <input type="number" name="altitudMax" value={filters.altitudMax} onChange={handleFilterChange} placeholder="msnm" />
                        </div>
                        <div className="filter-group">
                            <label>Ocupación</label>
                            <select name="ocupacionRange" value={filters.ocupacionRange} onChange={handleFilterChange}>
                                <option value="">Todas</option>
                                <option value="vacio">Vacío (0%)</option>
                                <option value="critico">Crítico (≤ 10%)</option>
                                <option value="baja">Baja (10-45%)</option>
                                <option value="medio">Media (45-75%)</option>
                                <option value="optimo">Óptimo (75-95%)</option>
                                <option value="lleno">Lleno (> 95%)</option>
                            </select>
                        </div>
                        <div className="filter-actions-container">
                            <button className="clear-filters-btn" onClick={limpiarFiltros}>
                                Limpiar Filtros
                            </button>
                            <button className="close-filters-btn" onClick={() => setShowFilters(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {error && <div className="error-banner">{error}</div>}

            <div className="main-content-layout">
              <section className="list-side-panel">
                <div className="list-stats-header">
                    <span>Resultados: <strong>{apiarios.length}</strong></span>
                </div>

                {/* LISTADO TÉCNICO */}
                <div className="cards-panel">
                    {apiarios.length > 0 ? (
                        apiarios.map((apiario) => (
                            <div key={apiario.id} className="apiario-card-mini">
                                <div className="card-info">
                                    <h3 title={apiario.nombre_referencia}>
                                        {apiario.nombre_referencia.length > 20 ? apiario.nombre_referencia.substring(0, 20) + '...' : apiario.nombre_referencia}
                                    </h3>
                                    <p><span>Altitud:</span> {apiario.msnm} MSNM</p>
                                </div>
                                   <div className="card-info">
                                    <p><span>Colmenas:</span> {apiario.colmenas?.length || 0}</p>
                                    <p><span>Capacidad:</span> {apiario.capacidad_maxima ?? 'Pendiente'}</p>
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
                            {apiarios.length === 0 
                                ? 'No se encontraron apiarios con los filtros aplicados.'
                                : 'Cargando listado...'}
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

                            // Calculamos el resumen de estados para este apiario
                            const resumenEstados = apiario.colmenas?.reduce((acc, col) => {
                                const est = col.estado || 'Indefinido';
                                acc[est] = (acc[est] || 0) + 1;
                                return acc;
                            }, {});

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
                                        <Marker
                                        position={apiario.posicion}
                                        icon={getApiaryIcon(apiario)}
                                    >                                        <Popup>
                                            <strong>{apiario.nombre_referencia}</strong><br/>
                                            {apiario.msnm} MSNM<br/>
                                            <hr />
                                            <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                                                {resumenEstados && Object.entries(resumenEstados).map(([estado, cantidad]) => (
                                                    <div key={estado}>{cantidad} {estado.toLowerCase()}</div>
                                                ))}
                                                <div style={{ borderTop: '1px solid #eee', marginTop: '5px', paddingTop: '2px' }}>
                                                    <strong>{apiario.colmenas?.length || 0} total</strong>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                </React.Fragment>
                            ) : null;
                        })}
                    </MapContainer>

                    {/* Leyenda de colores de capacidad */}
                    <div className="map-legend">
                        <h4>Ocupación</h4>
                        <div className="legend-item"><span className="dot" style={{backgroundColor: '#000000'}}></span> Vacío (0%)</div>
                        <div className="legend-item"><span className="dot" style={{backgroundColor: '#ff0000'}}></span> Crítico (≤ 10%)</div>
                        <div className="legend-item"><span className="dot" style={{backgroundColor: '#ff8000'}}></span> Bajo (10-45%)</div>
                        <div className="legend-item"><span className="dot" style={{backgroundColor: '#fbd269'}}></span> Medio (45-75%)</div>
                        <div className="legend-item"><span className="dot" style={{backgroundColor: '#00ff0d'}}></span> Óptimo (75-95%)</div>
                        <div className="legend-item"><span className="dot" style={{backgroundColor: '#00ddff'}}></span> Lleno (&gt; 95%)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}  
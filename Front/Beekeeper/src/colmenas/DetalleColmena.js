import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import * as WSColmena from '../webService/WS_colmena';
import 'leaflet/dist/leaflet.css';
import './css/DetalleColmena.css';

// Replicamos exactamente tu método de listarApiarios.js usando L.divIcon para evitar imágenes rotas
const getCheckpointIcon = () => {
    return L.divIcon({
        html: `<div class="custom-apiary-marker" style="background-color: #e74c3c; width: 32px; height: 32px; border-radius: 50%; border: 3px solid #2d2424; box-shadow: 4px 4px 0px #2d2424; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 14px;">📍</span>
               </div>`,
        className: 'apiary-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
};

const DetalleColmena = ({ colmena, setViewState }) => {
    if (!colmena) {
        setViewState("VerMisColmenas");
        return null;
    }

    // Destructuramos: info contiene los datos de la colmena, coordenadas está en la raíz del objeto
    const { colmena: info, nombre_apiario, coordenadas: coordsRaw } = colmena;

    const [historial, setHistorial] = useState({ alimentacion: [], produccion: [] });
    const [cargandoHistorial, setCargandoHistorial] = useState(false);

    // Carga de historial (Alimentación y Producción) desde el WebService
    useEffect(() => {
        const cargarHistorial = async () => {
            if (!info?.id) return;
            setCargandoHistorial(true);
            try {
                const res = await WSColmena.getDetalleMantenimiento(info.id);
                if (res.status === 1) {
                    setHistorial({
                        alimentacion: res.data.alimentacion || [],
                        produccion: res.data.produccion || []
                    });
                }
            } catch (err) { console.error("Error cargando historial:", err); }
            finally { setCargandoHistorial(false); }
        };
        cargarHistorial();
    }, [info?.id]);

    // 1. PROCESAMIENTO DE UBICACIÓN
    let ubicacion = null;
    
    // Prioridad absoluta al campo coordenadas recibido en el JSON (ej: "8.622464, -71.148520")
    if (coordsRaw && typeof coordsRaw === 'string' && coordsRaw.includes(',')) {
        ubicacion = coordsRaw.split(',').map(n => parseFloat(n.trim()));
    } else if (info?.coordenadas && typeof info.coordenadas === 'string' && info.coordenadas.includes(',')) {
        // Fallback por si acaso vienen dentro de info
        ubicacion = info.coordenadas.split(',').map(n => parseFloat(n.trim()));
    }

    // Validamos si la ubicación es válida para Leaflet
    const tienePosicionValida = Array.isArray(ubicacion) && 
                                ubicacion.length === 2 && 
                                Number.isFinite(ubicacion[0]) && 
                                Number.isFinite(ubicacion[1]);

    // 2. CENTRO DEL MAPA: La ubicación de la colmena es el centro
    const centroMapa = tienePosicionValida ? ubicacion : [8.5891, -71.1450];

    return (
        <div className="detalle-container">
            <div className="detalle-header">
                <button className="back-btn" onClick={() => setViewState("VerMisColmenas")}>
                    ← Volver
                </button>
                <h1>Detalle de Colmena: <span>{info.id_colmena_usuario}</span></h1>
            </div>

            <div className="detalle-grid">
                
                {/* PANEL IZQUIERDO: Estética idéntica a DetalleApiario */}
                <section className="detalle-left-panel">
                    <div className="overlay-content">
                        <div className="bee-icon">
                            <span style={{ fontSize: '3.5rem' }}>🐝</span>
                        </div>
                        <h2>Colmena</h2>
                        <p>Información biológica y ubicación geográfica.</p>
                    </div>
                    
                    <div className="detalle-card info-card">
                        <h2>Información general</h2>
                        <div className="info-row">
                            <span>Apiario</span>
                            <strong>{nombre_apiario || "Sin asignar"}</strong>
                        </div>
                        <div className="info-row">
                            <span>Tipo</span>
                            <strong>{info.tipo_colmena}</strong>
                        </div>
                        <div className="info-row">
                            <span>Estado</span>
                            <strong>{info.estado}</strong>
                        </div>
                        <div className="info-row">
                            <span>Origen</span>
                            <strong>{info.es_enjambre ? "Enjambre" : "División"}</strong>
                        </div>
                        <div className="info-row">
                            <span>Instalación</span>
                            <strong>{info.fecha_inicio?.split('T')[0]}</strong>
                        </div>
                        
                        {/* Mapa integrado en el panel izquierdo */}
                        <div className="map-wrapper-colmena">
                            <MapContainer center={centroMapa} zoom={15} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap'
                                />
                                {tienePosicionValida && (
                                    <Marker position={ubicacion} icon={getCheckpointIcon()}>
                                        <Popup>
                                            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                                {info.id_colmena_usuario}<br/>
                                                Apiario: {nombre_apiario}
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                    </div>
                </section>

                {/* PANEL DERECHO: Historial de Producción y Alimentación */}
                <section className="detalle-right-panel">
                    <div className="detalle-card colmenas-card" style={{ marginBottom: '24px' }}>
                        <div className="section-title">
                            <h2>Producción Reciente</h2>
                        </div>
                        <div className="historial-items-container">
                            {cargandoHistorial ? (
                                <div className="placeholder-text">Cargando producción...</div>
                            ) : historial.produccion.length > 0 ? (
                                historial.produccion.map((prod, index) => (
                                    <div key={index} className="historial-row">
                                        <span>{prod.fecha?.split('T')[0]}</span>
                                        <strong>{prod.cantidad_kg}kg ({prod.tipo_producto})</strong>
                                    </div>
                                ))
                            ) : <div className="placeholder-text">Sin registros de producción.</div>}
                        </div>
                    </div>

                    <div className="detalle-card colmenas-card">
                        <div className="section-title">
                            <h2>Alimentación Reciente</h2>
                        </div>
                        <div className="historial-items-container">
                            {cargandoHistorial ? (
                                <div className="placeholder-text">Cargando alimentación...</div>
                            ) : historial.alimentacion.length > 0 ? (
                                historial.alimentacion.map((al, index) => (
                                    <div key={index} className="historial-row alimentacion-border">
                                        <span>{al.fecha?.split('T')[0]}</span>
                                        <strong>{al.tipo_suministro} ({al.cantidad}kg)</strong>
                                    </div>
                                ))
                            ) : <div className="placeholder-text">Sin registros de alimentación.</div>}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DetalleColmena;
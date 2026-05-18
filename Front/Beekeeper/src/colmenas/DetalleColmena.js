import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
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
    // 1. CONTROL DE CONSOLA: Abre la consola del navegador (F12) para ver si la posición viene dentro del objeto
    useEffect(() => {
        console.log("🔍 DATOS RECIBIDOS EN DETALLE COLMENA:", colmena);
    }, [colmena]);

    if (!colmena) {
        setViewState("VerMisColmenas");
        return null;
    }

    const { colmena: info, nombre_apiario } = colmena;

    // 2. BÚSQUEDA EXHAUSTIVA: Intentamos capturar la posición desde cualquier estructura posible
    const posicionApiario = colmena.posicion || colmena.apiario?.posicion || info?.posicion;

    // Validamos si es un arreglo válido [lat, lng] idéntico a tu lógica de listarApiarios
    const tienePosicionValida = Array.isArray(posicionApiario) && 
                                posicionApiario.length === 2 && 
                                Number.isFinite(posicionApiario[0]) && 
                                Number.isFinite(posicionApiario[1]);

    // Si no hay posición válida, usamos Mérida por defecto para que el mapa no se vaya al océano
    const centroMapa = tienePosicionValida ? posicionApiario : [8.5891, -71.1450];

    return (
        <div className="gestion-container">
            <header className="perfil-header">
                <div>
                    <h1>Detalles <span>Colmena</span></h1>
                    <p>ID: <strong>{info.id_colmena_usuario}</strong> | Apiario: {nombre_apiario || "Sin asignar"}</p>
                </div>
                <button className="perfil-btn" onClick={() => setViewState("VerMisColmenas")}>
                    ← Volver
                </button>
            </header>

            {/* Estructura de Grid de dos mitades */}
            <div className="detalle-colmena-layout">
                
                {/* MITAD IZQUIERDA: Información General + Mapa */}
                <div className="columna-izquierda-packs">
                    
                    {/* Caja de Información General */}
                    <section className="info-general-box">
                        <div className="box-header-apiario">
                            <span className="box-icon-bee">🐝</span>
                            <h2>COLMENA</h2>
                            <p className="box-subheader">Información general y estado de la colmena.</p>
                        </div>

                        <div className="info-container-apiario">
                            <h3 className="info-title-apiario">Información general</h3>
                            
                            <div className="info-row-apiario">
                                <span className="label-apiario">TIPO</span>
                                <span className="value-apiario">{info.tipo_colmena}</span>
                            </div>
                            <div className="info-row-apiario">
                                <span className="label-apiario">ESTADO</span>
                                <span className="value-apiario">{info.estado}</span>
                            </div>
                            <div className="info-row-apiario">
                                <span className="label-apiario">ORIGEN</span>
                                <span className="value-apiario">{info.es_enjambre ? "Enjambre" : "División"}</span>
                            </div>
                            <div className="info-row-apiario">
                                <span className="label-apiario">FECHA DE INSTALACIÓN</span>
                                <span className="value-apiario">{info.fecha_inicio?.split('T')[0]}</span>
                            </div>
                        </div>
                    </section>

                    {/* El contenedor del Mapa */}
                    <div className="map-colmena-panel">
                        <MapContainer center={centroMapa} zoom={15} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap'
                            />
                            {tienePosicionValida && (
                                <Marker position={posicionApiario} icon={getCheckpointIcon()}>
                                    <Popup>
                                        <div style={{ textAlign: 'center', fontFamily: 'inherit', fontWeight: 'bold' }}>
                                            Apiario: {nombre_apiario || "Ubicación del Apiario"}
                                        </div>
                                    </Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>

                </div>

                {/* MITAD DERECHA: Bloques de producción y alimentación */}
                <div className="columna-derecha-packs">
                    
                    <section className="detalle-card produccion">
                        <h3>Producción Reciente</h3>
                        {info.produccion && info.produccion.length > 0 ? (
                            info.produccion.map((prod, index) => (
                                <div key={index} className="info-item">
                                    <span>{prod.fecha?.split('T')[0]}:</span> {prod.cantidad_kg}kg ({prod.tipo_producto})
                                </div>
                            ))
                        ) : (
                            <div className="placeholder-text">No hay registros de producción recientes.</div>
                        )}
                    </section>

                    <section className="detalle-card alimentacion">
                        <h3>Alimentación Reciente</h3>
                        {info.alimentacion && info.alimentacion.length > 0 ? (
                            info.alimentacion.map((al, index) => {
                                const fechaFmt = al.fecha?.split('T')[0] || "Sin fecha";
                                const alimento = al.tipo_suministro || "Suministro";
                                const cant = al.cantidad || 0;
                                const costo = al.precio_total_insumo !== undefined ? al.precio_total_insumo : 0;

                                return (
                                    <div key={index} className="info-item">
                                        <span>{fechaFmt}:</span> {alimento} ({cant} unds) {costo ? `- $${costo}` : ''}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="placeholder-text">No hay registros de alimentación.</div>
                        )}
                    </section>

                </div>
            </div>
        </div>
    );
};

export default DetalleColmena;
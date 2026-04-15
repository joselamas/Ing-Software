import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import { useCrearApiario } from './hooks/useCrearApiario.js';
import Modal from '../componentes/modalMSN.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './css/crearApiario.css';

// Corregir error de iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente interno para capturar el clic
function LocationMarker({ onMapClick, position }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return position ? <Marker position={position} /> : null;
}

export default function CrearApiario({ usr, setViewState }) {
    const { 
        formData, handleChange, handleSubmit, handleLeafletClick, 
        loading, isModalOpen, setIsModalOpen, modalInfo 
    } = useCrearApiario(usr, setViewState);

    const center = [8.5891, -71.1450]; // Mérida
    const markerPos = formData.coordenadas 
        ? [parseFloat(formData.coordenadas.split(',')[0]), parseFloat(formData.coordenadas.split(',')[1])] 
        : null;

    return (
        <div className="main-container">
            <div className="left-panel">
                <div className="panel-content">
                    <div className="hex-icon">⬢</div>
                    <h2>Nuevo <span>Apiario</span></h2>
                    <p>Usa OpenStreetMap para ubicar tu apiario .</p>
                    
                    <div id="map" style={{ height: "500px", width: "600px", marginTop: "20px", borderRadius: "12px" }}>
                        <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: "100%" }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <LocationMarker onMapClick={handleLeafletClick} position={markerPos} />
                            {markerPos && (
                                <>
                                    <Circle
                                        center={markerPos}
                                        pathOptions={{ color: '#3399ff', fillColor: '#3399ff', fillOpacity: 0.3 }}
                                        radius={1000}
                                    />
                                    <Circle
                                        center={markerPos}
                                        pathOptions={{ color: '#66cc66', fillColor: '#66cc66', fillOpacity: 0.1 }}
                                        radius={2000}
                                    />
                                    <Circle
                                        center={markerPos}
                                        pathOptions={{ color: '#ffcc00', fillColor: '#ffcc00', fillOpacity: 0.08 }}
                                        radius={3000}
                                    />
                                </>
                            )}
                        </MapContainer>
                    </div>
                </div>
            </div>

            <div className="right-panel">
                <div className="form-container">
                    <h2 className='main-title' style={{marginBottom:'20px'}}>Nuevo <span>Apiario</span></h2>
                    <form onSubmit={handleSubmit} className="beekeeping-form">
                        <div className="input-group">
                            <label>Nombre de Referencia</label>
                            <input type="text" name="nombre_referencia" value={formData.nombre_referencia} onChange={handleChange} required />
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>Coordenadas</label>
                                <input type="text" name="coordenadas" value={formData.coordenadas} readOnly enabled />
                            </div>
                            <div className="input-group">
                                <label>MSNM</label>
                                <input type="number" name="msnm" value={formData.msnm}  required enabled />
                            </div>
                        </div>
                        <div className="input-group flora-group">
                            <label>Tipo de Flora</label>
                            <textarea name="tipo_flora" value={formData.tipo_flora} onChange={handleChange} rows="3" />
                        </div>
                        <div className="input-group textarea-group wide-textarea">
                            <label>Descripción de Acceso</label>
                            <textarea name="descripcion_acceso" value={formData.descripcion_acceso} onChange={handleChange} rows="3" />
                        </div>
                        <div className="input-row centered-row">
                            <div className="input-group centered-group">
                                <label>Capacidad Máxima</label>
                                <input
                                    type="number"
                                    name="capacidad_maxima"
                                    value={formData.capacidad_maxima}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                            </div>
                        </div>
                        <button type="submit" className="primary-btn" disabled={loading}>Registrar Apiario</button>
                    </form>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalInfo.titulo} message={modalInfo.mensaje} type={modalInfo.tipo} />
        </div>
    );
}
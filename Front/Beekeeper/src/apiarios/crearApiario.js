import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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
                        </MapContainer>
                    </div>
                </div>
            </div>

            <div className="right-panel">
                <div className="form-container">
                    <h2>Nuevo <span>Apiario</span></h2>
                    <p className="form-desc">Gestionar tus apiarios fácilmente.</p>
                    <form onSubmit={handleSubmit} className="beekeeping-form">
                        <div className="input-group">
                            <label>Nombre de Referencia</label>
                            <input type="text" name="nombre_referencia" value={formData.nombre_referencia} onChange={handleChange} required />
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>Coordenadas</label>
                                <input type="text" name="coordenadas" value={formData.coordenadas} readOnly />
                            </div>
                            <div className="input-group">
                                <label>MSNM</label>
                                <input type="number" name="msnm" value={formData.msnm} onChange={handleChange} required />
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
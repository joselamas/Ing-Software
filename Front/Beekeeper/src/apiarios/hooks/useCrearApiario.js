import { useState } from 'react';
import * as WSApiario from '../../webService/WS_apiario.js';

export const useCrearApiario = (usr, setViewState) => {
    const [formData, setFormData] = useState({
        nombre_referencia: '',
        coordenadas: '',
        msnm: ''
    });

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '', tipo: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Función para manejar el clic en el mapa de Leaflet
    const handleLeafletClick = async (lat, lng) => {
        const coordsString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        setFormData(prev => ({
            ...prev,
            coordenadas: coordsString
        }));

        // Intento de obtener altitud gratuita vía Open-Elevation
        try {
            const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
            const data = await response.json();
            if (data.results && data.results[0]) {
                setFormData(prev => ({
                    ...prev,
                    msnm: Math.round(data.results[0].elevation)
                }));
            }
        } catch (error) {
            console.error("No se pudo obtener la altitud automáticamente:", error);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        const payload = {
            acronimo_usuario: usr.acronimo,
            nombre_referencia: formData.nombre_referencia,
            coordenadas: formData.coordenadas,
            msnm: parseInt(formData.msnm) || 0,
            activo: true
        };

        try {
            const res = await WSApiario.CrearApiario(payload);
            if (res && res.status === 1) {
                setModalInfo({ titulo: 'Éxito', mensaje: 'Apiario creado correctamente', tipo: 'success' });
            } else {
                setModalInfo({ titulo: 'Error', mensaje: res.mensaje || 'Error al guardar', tipo: 'error' });
            }
        } catch (error) {
            setModalInfo({ titulo: 'Error', mensaje: 'Error de conexión con el servidor', tipo: 'error' });
        } finally {
            setLoading(false);
            setIsModalOpen(true);
        }
    };

    // AQUÍ ESTÁ EL RETURN CORREGIDO (Sin los puntos suspensivos)
    return { 
        formData, 
        handleChange, 
        handleSubmit, 
        handleLeafletClick, 
        loading, 
        isModalOpen, 
        setIsModalOpen, 
        modalInfo 
    };
};
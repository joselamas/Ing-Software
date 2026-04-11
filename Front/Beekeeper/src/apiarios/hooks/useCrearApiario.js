import { useState } from 'react';
import * as WSApiario from '../../webService/WS_apiario.js';

export const useCrearApiario = (usr, setViewState) => {
    const [formData, setFormData] = useState({
        nombre_referencia: '',
        coordenadas: '',
        msnm: '',
        tipo_flora: '',
        capacidad_maxima: '',
        descripcion_acceso: ''
    });

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '', tipo: '' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLeafletClick = (lat, lng) => {
        setFormData(prev => ({
            ...prev,
            coordenadas: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const res = await WSApiario.CrearApiario({ ...formData, acronimo_usuario: usr.acronimo });
            if (res && res.status === 1) {
                setModalInfo({ titulo: 'Éxito', mensaje: 'Apiario creado correctamente', tipo: 'success' });
            }
        } catch (error) {
            setModalInfo({ titulo: 'Error', mensaje: 'Fallo de conexión', tipo: 'error' });
        } finally {
            setLoading(false);
            setIsModalOpen(true);
        }
    };

    return { formData, handleChange, handleSubmit, handleLeafletClick, loading, isModalOpen, setIsModalOpen, modalInfo };
};
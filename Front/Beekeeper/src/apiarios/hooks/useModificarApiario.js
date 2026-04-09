import { useState } from 'react';
// Se asume la existencia de una función de actualización en el WS_apiario
 import * as WSApiario from '../../webService/WS_apiario.js';

export const useModificarApiario = (apiarioInicial, setViewState, usr) => {
    const [formData, setFormData] = useState({
        id: apiarioInicial?.id,
        tipo_flora: apiarioInicial?.tipo_flora || '',
        capacidad_maxima: apiarioInicial?.capacidad_maxima || '',
        descripcion_acceso: apiarioInicial?.descripcion_acceso || '',
        estado: apiarioInicial?.estado || (apiarioInicial?.activo === false ? 'Inactivo' : 'Activo'),
        coordenadas: apiarioInicial?.coordenadas ? String(apiarioInicial.coordenadas) : '',
        msnm: apiarioInicial?.msnm || '',
        nombre_referencia: apiarioInicial?.nombre_referencia || '',
        acronimo_usuario: usr?.acronimo || '',
        activo: apiarioInicial?.activo || true
        
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para controlar el ModalMSN
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '', tipo: 'success' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const manejarEdicion = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
             const res = await WSApiario.ModificarApiario(formData);
             
             if (res && res.status === 1) {
                 setModalInfo({
                     titulo: "¡Actualización Exitosa!",
                     mensaje: "Los datos del apiario han sido actualizados correctamente.",
                     tipo: "success"
                 });
                 setIsModalOpen(true);
             } else {
                 setModalInfo({
                     titulo: "Error al Actualizar",
                     mensaje: res.mensaje || "No se pudieron guardar los cambios en el apiario.",
                     tipo: "error"
                 });
                 setIsModalOpen(true);
             }
        } catch (err) {
            setModalInfo({
                titulo: "Fallo de Conexión",
                mensaje: "Ocurrió un error al conectar con el servidor.",
                tipo: "error"
            });
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, manejarEdicion, loading, error, isModalOpen, setIsModalOpen, modalInfo };
};
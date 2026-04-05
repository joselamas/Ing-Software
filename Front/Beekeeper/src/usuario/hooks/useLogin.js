import { useState } from 'react';
import * as WSUsuario from '../../webService/WS_usuario.js';

export const useLogin = (props) => {
    // Estados para controlar el formulario y el Modal
    const [formData, setFormData] = useState({
        identificador: '',
        clave: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '' });

    // Manejador de cambios (Sincroniza los inputs con el estado)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Función de Login
    const aceptarLog = async (e) => {
        if (e) e.preventDefault();

        try {
            // Enviamos el identificador y la clave en Base64
            const respuesta = await WSUsuario.ValidarLogin(formData.identificador, btoa(formData.clave));
            
            if (respuesta && respuesta.status === 1) {
                // ÉXITO: Guardamos el usuario y cambiamos la vista
                props.setUsr(respuesta.usuario);
                props.setViewState('ModificarUsuario');
            } else {
                // ERROR DE LOGUEO
                setModalInfo({
                    titulo: "Acceso Denegado",
                    mensaje: respuesta.mensaje || "Credenciales incorrectas. Intenta de nuevo."
                });
                setIsModalOpen(true);
            }
        } catch (err) {
            setModalInfo({
                titulo: "Error de Conexión",
                mensaje: "No se pudo establecer comunicación con el servidor de Beekeeper."
            });
            setIsModalOpen(true);
        }
    };

    return {
        formData,
        isModalOpen,
        setIsModalOpen,
        modalInfo,
        handleChange,
        aceptarLog
    };
};
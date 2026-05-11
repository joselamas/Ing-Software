import { useState } from 'react';
import * as WSUsuario from '../../webService/WS_usuario.js';

export const useCrearUsuario = (setViewState) => {
    const [formData, setFormData] = useState({
        acronimo: '',
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        localidad_asociada: '',
        clave: '',
        repetirClave: '',
        permiso: 2,
        activo: true
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [modalInfo, setModalInfo] = useState({
        titulo: '',
        mensaje: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value 
        }));
    };

    const manejarRegistro = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.clave !== formData.repetirClave) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        const { repetirClave, ...datosAEnviar } = formData;

        const payload = {
            ...datosAEnviar,
            clave: btoa(datosAEnviar.clave) // Cifrado simple solicitado
        };

        try {
            const respuesta = await WSUsuario.CrearUsuario(payload);

            if (respuesta && respuesta.status === 1) {
                setModalInfo({
                    titulo: 'Registro Exitoso',
                    mensaje: 'El usuario ha sido creado correctamente. Ahora puede iniciar sesión.'
                });
                setFormData({
                    acronimo: '', nombre: '', apellido: '', telefono: '',
                    correo: '', localidad_asociada: '', clave: '',
                    repetirClave: '', permiso: 2, activo: true
                });
            } else {
                setModalInfo({
                    titulo: 'Error de Registro',
                    mensaje: respuesta.mensaje || 'No se pudo completar el registro.'
                });
            }
        } catch (err) {
            setModalInfo({
                titulo: 'Error de Conexión',
                mensaje: 'Hubo un problema al conectar con el servidor.'
            });
        } finally {
            setLoading(false);
            setIsModalOpen(true);
        }
    };

    return {
        formData,
        handleChange,
        manejarRegistro,
        isModalOpen,
        setIsModalOpen,
        modalInfo,
        error,
        loading
    };
};
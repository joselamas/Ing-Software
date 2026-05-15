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

        // 1. Validar formato de correo electrónico
        // Exige que haya texto, luego un "@", luego texto, un punto ".", y texto al final.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo)) {
            setModalInfo({
                titulo: 'Correo Inválido',
                mensaje: 'Por favor, ingrese un correo electrónico válido (ejemplo@correo.com).'
            });
            setIsModalOpen(true);
            return;
        }

        // 2. Validar complejidad de la contraseña
        // Mínimo 8 caracteres, al menos 1 letra, 1 número y 1 carácter especial
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(formData.clave)) {
            setModalInfo({
                titulo: 'Contraseña Débil',
                mensaje: 'La contraseña no cumple con los requisitos mínimos de seguridad.'
            });
            setIsModalOpen(true);
            return;
        }

        // 3. Validar que las contraseñas coincidan
        if (formData.clave !== formData.repetirClave) {
            setModalInfo({
                titulo: 'Error en Contraseñas',
                mensaje: 'Las contraseñas no coinciden. Por favor, verifíquelas.'
            });
            setIsModalOpen(true);
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
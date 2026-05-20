import { useState } from 'react';
import * as WSUsuario from '../../webService/WS_usuario.js';

export const useModificarUsuario = (usr, setUsr) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '', tipo: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        if (data.password || data.repeatPassword) {
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            
            if (!passwordRegex.test(data.password)) {
                setModalInfo({
                    titulo: 'Contraseña Débil',
                    mensaje: 'La nueva contraseña no cumple con los requisitos mínimos de seguridad.',
                    tipo: 'error'
                });
                setIsModalOpen(true);
                setLoading(false);
                return;
            }

            if (data.password !== data.repeatPassword) {
                setModalInfo({
                    titulo: 'Error en Contraseñas',
                    mensaje: 'Las contraseñas no coinciden.',
                    tipo: 'error'
                });
                setIsModalOpen(true);
                setLoading(false);
                return;
            }
        }

        const payload = {
            acronimo: usr.acronimo,
            nombre: usr.nombre,
            apellido: usr.apellido,
            correo: data.correo || usr.correo,
            telefono: data.telefono || usr.telefono,
            localidad_asociada: data.localidad || usr.localidad_asociada,
            clave: data.password ? btoa(data.password) : ""
        };

        try {
            const res = await WSUsuario.ModificarUsuario(payload);
            if (res && res.status === 1) {
             
                setUsr(payload); // Actualizamos el estado del usuario con los nuevos dato
              
                setModalInfo({
                    titulo: 'Actualización Exitosa',
                    mensaje: 'Tu perfil ha sido actualizado correctamente.',
                    tipo: 'success'
                });
            } else {
                setModalInfo({
                    titulo: 'Error al actualizar',
                    mensaje: res?.mensaje || 'Error al actualizar el perfil.',
                    tipo: 'error'
                });
            }
        } catch (err) {
            setModalInfo({
                titulo: 'Error de conexión',
                mensaje: 'Error de conexión con el servidor.',
                tipo: 'error'
            });
        } finally {
            setLoading(false);
            setIsModalOpen(true);
        }
    };

    return {
        handleSubmit,
        loading,
        error,
        isModalOpen,
        setIsModalOpen,
        modalInfo
    };
};
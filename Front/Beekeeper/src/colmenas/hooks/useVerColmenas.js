import { useState, useEffect } from 'react';
import * as WSColmena from '../../webService/WS_colmena';

export const useVerColmenas = (usr) => {
    const [colmenas, setColmenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '', tipo: 'success' });
    useEffect(() => {
        const fetchColmenas = async () => {
            if (!usr) return;
            setCargando(true);
            try {
                const res = await WSColmena.getListColmenasUsr(usr.acronimo);
                if (res && res.status === 1) {
                    setColmenas(res.data ? res.data : []);
                } else {
                    setError(res.mensaje || "Error al cargar el listado de colmenas.");
                }
            } catch (err) {
                setError("Fallo en la comunicación con el servidor.");
            } finally {
                setCargando(false);
            }
        };
        fetchColmenas();
    }, [usr]);

    const desactivarColmena = async (idColmena) => {
        // Llamamos al servicio web que acabamos de crear
        const res = await WSColmena.desactivarColmena(idColmena);

        if (res && res.status === 1) {
            // Eliminamos la tarjeta de la memoria de React 
            // en lugar de volver a cargar toda la página
            setColmenas(colmenasActuales => 
                colmenasActuales.filter(c => c.colmena.id !== idColmena)
            );
            setModalInfo({
                    titulo: "Desactivación Exitosa",
                    mensaje: res.mensaje || "La colmena ha sido dada de baja correctamente.",
                    tipo: "success"
                });
                setIsModalOpen(true);
        } else {
            setModalInfo({
                    titulo: "Error",
                    mensaje: res.mensaje || "Hubo un error al intentar desactivar la colmena.",
                    tipo: "error"
                });
            setIsModalOpen(true);
        }
    };

    return { colmenas, cargando, error, isModalOpen, setIsModalOpen, modalInfo, desactivarColmena };
};
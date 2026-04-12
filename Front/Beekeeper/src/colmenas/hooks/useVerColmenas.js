import { useState, useEffect } from 'react';
import * as WSColmena from '../../webService/WS_colmena';

export const useVerColmenas = (usr) => {
    const [colmenas, setColmenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ titulo: '', mensaje: '' });
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
        // Confirmación nativa para evitar clics accidentales
        const confirmar = window.confirm("¿Estás seguro de que deseas desactivar esta colmena?");
        if (!confirmar) return;

        // Llamamos al servicio web que acabamos de crear
        const res = await WSColmena.desactivarColmena(idColmena);

        if (res && res.status === 1) {
            // Eliminamos la tarjeta de la memoria de React 
            // en lugar de volver a cargar toda la página
            setColmenas(colmenasActuales => 
                colmenasActuales.filter(c => c.colmena.id !== idColmena)
            );
            setModalInfo({
                    titulo: "Confirmarción",
                    mensaje: res.mensaje || "Realmente desea eliminar esta colmena?."
                });
                setIsModalOpen(true);
        } else {
            setModalInfo({
                    titulo: "Error",
                    mensaje: res.mensaje || "Hubo un error al intentar desactivar la colmena."
                });
            setIsModalOpen(true);
        }
    };

    return { colmenas, cargando, error, isModalOpen, setIsModalOpen, modalInfo, desactivarColmena };
};
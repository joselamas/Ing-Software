import { useState, useEffect } from 'react';
import * as WSColmena from '../../webService/WS_colmena';

export const useVerColmenas = (usr) => {
    const [colmenas, setColmenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

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

    // CAMBIO: La función ahora retorna el resultado en lugar de abrir el modal aquí mismo.
    // Esto permite que la VISTA decida qué mensaje mostrar.
    
    const desactivarColmena = async (idColmena) => {
        try {
            // Se eliminó el window.confirm que causaba la ventana gris
            const res = await WSColmena.desactivarColmena(idColmena);
            if (res && res.status === 1) {
                setColmenas(colmenasActuales => 
                    colmenasActuales.filter(c => c.colmena.id !== idColmena)
                );
                return { success: true, mensaje: res.mensaje };
            }
            return { success: false, mensaje: res.mensaje || "No se pudo desactivar." };
        } catch (err) {
            return { success: false, mensaje: "Error de conexión con el servidor." };
        }
    };

    return { colmenas, cargando, error, desactivarColmena };
};
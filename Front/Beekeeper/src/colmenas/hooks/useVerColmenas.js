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

    return { colmenas, cargando, error };
};
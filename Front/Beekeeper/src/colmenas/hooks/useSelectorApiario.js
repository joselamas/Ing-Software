import { useState, useEffect } from 'react';
import { apiService } from '../../webService/WS_colmena.js';

export const useSelectorApiario = (usr) => {
    const [apiarios, setApiarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchApiarios = async () => {
            try {
                const data = await apiService.obtenerApiarios(usr);
                setApiarios(data);
            } catch (err) {
                console.error(err);
            } finally {
                setCargando(false);
            }
        };

        fetchApiarios();
    }, [usr]);

    return { apiarios, cargando };
};
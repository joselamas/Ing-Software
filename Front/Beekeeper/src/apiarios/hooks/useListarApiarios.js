import { useState, useEffect } from 'react';
import * as WSApiario from '../../webService/WS_apiario.js';

export const useListarApiarios = () => {
    const [apiarios, setApiarios] = useState([]); // Inicializado como array vacío
    const [loading, setLoading] = useState(true);

    const getApiarios = async () => {
        setLoading(true);
        try {
            const res = await WSApiario.ListarApiarios();
            // Validamos que 'res' sea un array antes de guardarlo
            setApiarios(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error("Error al cargar apiarios:", error);
            setApiarios([]); // Si hay error, mantenemos el array vacío
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getApiarios();
    }, []);

    return { apiarios, loading };
};